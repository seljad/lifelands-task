import type { SortKey } from "../sort-games.ts";
import type { Game } from "../types/game.ts";

export type FilterOption = {
  value: string;
  label: string;
};

export type MultiFilterDefinition = {
  kind: "multi";
  id: string;
  label: string;
  getValues: (game: Game) => readonly string[];
  getOptions: (games: readonly Game[]) => FilterOption[];
  isValidValue: (value: string) => boolean;
};

export type RangeFilterDefinition = {
  kind: "range";
  id: string;
  label: string;
  field: SortKey;
  min: number;
  max: number;
  step: number;
};

export type FilterDefinition = MultiFilterDefinition | RangeFilterDefinition;
