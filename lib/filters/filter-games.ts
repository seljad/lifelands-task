import { normalizePersian } from "../normalize-persian.ts";
import type { Game } from "../types/game.ts";
import { FILTERS } from "./config.ts";
import type { FilterCriteria, FilterState } from "./state.ts";

const searchTextCache = new WeakMap<Game, string>();

function getSearchText(game: Game): string {
  let text = searchTextCache.get(game);
  if (text === undefined) {
    text = normalizePersian(`${game.title} ${game.companyName}`);
    searchTextCache.set(game, text);
  }
  return text;
}

function matchesCriteria(game: Game, criteria: FilterCriteria): boolean {
  return FILTERS.every((filter) => {
    if (filter.kind === "multi") {
      const selected = criteria.selections[filter.id] ?? [];
      return (
        selected.length === 0 ||
        filter.getValues(game).some((value) => selected.includes(value))
      );
    }
    const minimum = criteria.minimums[filter.id] ?? filter.min;
    return game[filter.field] >= minimum;
  });
}

/**
 * Every search token must appear in the normalized title or company name.
 * Filters combine with AND across filters and OR within one filter.
 */
export function filterGames(
  games: readonly Game[],
  state: FilterState,
  favorites: ReadonlySet<string>,
): Game[] {
  const tokens =
    state.mode === "search" ? normalizePersian(state.query).split(" ") : [];

  return games.filter(
    (game) =>
      (!state.criteria.favoritesOnly || favorites.has(game.id)) &&
      matchesCriteria(game, state.criteria) &&
      tokens.every((token) => getSearchText(game).includes(token)),
  );
}
