import type { Game } from "../types/game.ts";
import type { FilterOption, MultiFilterDefinition } from "./types.ts";

/**
 * Options come from the loaded games, but values restored from a shared URL
 * stay visible even when no loaded game carries them yet.
 */
export function getFilterOptions(
  filter: MultiFilterDefinition,
  games: readonly Game[],
  selected: readonly string[],
): FilterOption[] {
  const options = filter.getOptions(games);
  const known = new Set(options.map((option) => option.value));
  const missing = selected
    .filter((value) => !known.has(value))
    .map((value) => ({ value, label: value }));
  return [...options, ...missing];
}
