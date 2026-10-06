import { FILTERS } from "@/lib/filters/config.ts";
import type { FilterState } from "@/lib/filters/state.ts";
import type { Game } from "@/lib/types/game.ts";
import { FavoritesToggle } from "./favorites-toggle.tsx";
import { MultiFilter } from "./multi-filter.tsx";
import { RangeFilter } from "./range-filter.tsx";
import { SearchBox } from "./search-box.tsx";
import { SortSelect } from "./sort-select.tsx";

type FilterBarProps = {
  state: FilterState;
  games: readonly Game[];
};

export function FilterBar({ state, games }: FilterBarProps) {
  return (
    <div className="space-y-3">
      <SearchBox />
      <div className="flex flex-wrap items-center gap-3">
        {FILTERS.map((filter) =>
          filter.kind === "multi" ? (
            <MultiFilter key={filter.id} definition={filter} games={games} />
          ) : (
            <RangeFilter key={filter.id} definition={filter} />
          ),
        )}
        <SortSelect mode={state.mode} sort={state.sort} />
        <FavoritesToggle />
      </div>
    </div>
  );
}
