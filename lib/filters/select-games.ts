import { sortGames } from "../sort-games.ts";
import type { Game } from "../types/game.ts";
import { filterGames } from "./filter-games.ts";
import type { FilterState } from "./state.ts";

export function selectGames(
  games: readonly Game[],
  state: FilterState,
  favorites: ReadonlySet<string>,
): Game[] {
  const filtered = filterGames(games, state, favorites);
  return state.sort === "default" || state.sort === "relevance"
    ? filtered
    : sortGames(filtered, state.sort);
}
