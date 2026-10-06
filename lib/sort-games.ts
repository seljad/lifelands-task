import type { Game } from "./types/game.ts";
import type { NumericKeys } from "./types/utility.ts";

export type SortKey = NumericKeys<Game>;

export function sortGames(games: readonly Game[], key: SortKey): Game[] {
  return [...games].sort((a, b) => b[key] - a[key]);
}
