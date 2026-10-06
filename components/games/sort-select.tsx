"use client";

import { useUrlState } from "@/hooks/use-url-state.ts";
import { SORT_PARAM } from "@/lib/filters/state.ts";
import type { FilterState } from "@/lib/filters/state.ts";
import { SORT_OPTIONS } from "@/lib/sort-options.ts";
import { stringCodec } from "@/lib/url-codecs.ts";
import { CONTROL_HEIGHT_CLASS, CONTROL_WIDTH_CLASS } from "./layout.ts";

const DEFAULT_SORT_VALUE = "";

export function SortSelect({ mode, sort }: Pick<FilterState, "mode" | "sort">) {
  const [, setSort] = useUrlState(SORT_PARAM, DEFAULT_SORT_VALUE, stringCodec);
  const isDefault = sort === "default" || sort === "relevance";

  return (
    <div className={CONTROL_WIDTH_CLASS.sort}>
      <label htmlFor="game-sort" className="sr-only">
        مرتب‌سازی
      </label>
      <select
        id="game-sort"
        value={isDefault ? DEFAULT_SORT_VALUE : sort}
        onChange={(event) => setSort(event.target.value)}
        className={`${CONTROL_HEIGHT_CLASS} w-full rounded-xl border border-border bg-surface px-3 text-sm`}
      >
        <option value={DEFAULT_SORT_VALUE}>
          {mode === "search" ? "مرتب‌سازی: مرتبط‌ترین" : "مرتب‌سازی: پیش‌فرض"}
        </option>
        {SORT_OPTIONS.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
