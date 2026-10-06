import type { FilterCriteria, FilterState } from "../filters/state.ts";
import type { Game } from "../types/game.ts";

export function makeGame(overrides: Partial<Game> = {}): Game {
  return {
    id: "game-1",
    title: "Epic Ludo",
    companyName: "Vahid",
    category: "تفننی",
    imageUrl: "https://dl.lifelands.ir/game/a.webp",
    vendors: [],
    score: 0,
    rating: 0,
    like: 0,
    seenCount: 0,
    runCount: 0,
    quality: 0,
    ...overrides,
  };
}

export const EMPTY_CRITERIA: FilterCriteria = {
  selections: {},
  minimums: {},
  favoritesOnly: false,
};

export function browse(criteria: Partial<FilterCriteria> = {}): FilterState {
  return {
    mode: "browse",
    sort: "default",
    criteria: { ...EMPTY_CRITERIA, ...criteria },
  };
}

export function search(
  query: string,
  criteria: Partial<FilterCriteria> = {},
): FilterState {
  return {
    mode: "search",
    query,
    sort: "relevance",
    criteria: { ...EMPTY_CRITERIA, ...criteria },
  };
}
