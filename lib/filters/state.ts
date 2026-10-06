import { MAX_QUERY_LENGTH } from "../config.ts";
import { normalizePersian } from "../normalize-persian.ts";
import { isSortOptionKey } from "../sort-options.ts";
import type { SortOptionKey } from "../sort-options.ts";
import {
  booleanCodec,
  numberCodec,
  stringCodec,
  stringListCodec,
} from "../url-codecs.ts";
import { FILTERS } from "./config.ts";

export const QUERY_PARAM = "q";
export const SORT_PARAM = "sort";
export const FAVORITES_PARAM = "fav";

export const ALL_PARAM_KEYS: readonly string[] = [
  QUERY_PARAM,
  SORT_PARAM,
  FAVORITES_PARAM,
  ...FILTERS.map((filter) => filter.id),
];

export type FilterCriteria = {
  selections: Readonly<Record<string, readonly string[]>>;
  minimums: Readonly<Record<string, number>>;
  favoritesOnly: boolean;
};

export type BrowseSort = SortOptionKey | "default";
export type SearchSort = SortOptionKey | "relevance";

/**
 * Discriminated on `mode`. "default" (catalog order) only makes sense while
 * browsing and "relevance" (upstream search order) only while searching, and
 * `query` exists only in search mode, so the compiler rejects mixing them.
 */
export type BrowseFilterState = {
  mode: "browse";
  sort: BrowseSort;
  criteria: FilterCriteria;
};

export type SearchFilterState = {
  mode: "search";
  query: string;
  sort: SearchSort;
  criteria: FilterCriteria;
};

export type FilterState = BrowseFilterState | SearchFilterState;

export type ParamSource = {
  get: (key: string) => string | null;
};

export function createFilterState(
  rawQuery: string,
  rawSort: string | null,
  criteria: FilterCriteria,
): FilterState {
  const query = normalizePersian(rawQuery).slice(0, MAX_QUERY_LENGTH);

  if (query === "") {
    const sort = rawSort !== null && isSortOptionKey(rawSort) ? rawSort : "default";
    return { mode: "browse", sort, criteria };
  }

  const sort = rawSort !== null && isSortOptionKey(rawSort) ? rawSort : "relevance";
  return { mode: "search", query, sort, criteria };
}

function parseCriteria(params: ParamSource): FilterCriteria {
  const selections: Record<string, readonly string[]> = {};
  const minimums: Record<string, number> = {};

  for (const filter of FILTERS) {
    const raw = params.get(filter.id);
    if (filter.kind === "multi") {
      selections[filter.id] = stringListCodec
        .parse(raw, [])
        .filter(filter.isValidValue);
    } else {
      minimums[filter.id] = Math.min(
        Math.max(numberCodec.parse(raw, filter.min), filter.min),
        filter.max,
      );
    }
  }

  return {
    selections,
    minimums,
    favoritesOnly: booleanCodec.parse(params.get(FAVORITES_PARAM), false),
  };
}

export function parseFilterState(params: ParamSource): FilterState {
  return createFilterState(
    stringCodec.parse(params.get(QUERY_PARAM), ""),
    params.get(SORT_PARAM),
    parseCriteria(params),
  );
}

export function getFeedQuery(state: FilterState): string {
  return state.mode === "search" ? state.query : "";
}
