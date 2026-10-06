"use client";

import { useId } from "react";
import { useUrlState } from "@/hooks/use-url-state.ts";
import { formatNumber } from "@/lib/format.ts";
import type { RangeFilterDefinition } from "@/lib/filters/types.ts";
import { numberCodec } from "@/lib/url-codecs.ts";
import { CONTROL_HEIGHT_CLASS, CONTROL_WIDTH_CLASS } from "./layout.ts";

export function RangeFilter({ definition }: { definition: RangeFilterDefinition }) {
  const [value, setValue] = useUrlState(
    definition.id,
    definition.min,
    numberCodec,
    { history: "replace" },
  );
  const inputId = useId();
  const isActive = value > definition.min;

  return (
    <div
      className={`${CONTROL_HEIGHT_CLASS} ${CONTROL_WIDTH_CLASS.range} flex items-center gap-3 rounded-xl border px-4 text-sm ${
        isActive ? "border-accent bg-surface-muted" : "border-border bg-surface"
      }`}
    >
      <label htmlFor={inputId} className="shrink-0">
        {definition.label}: <output htmlFor={inputId}>{formatNumber(value)}</output>
      </label>
      <input
        id={inputId}
        type="range"
        min={definition.min}
        max={definition.max}
        step={definition.step}
        value={value}
        onChange={(event) => setValue(event.target.valueAsNumber)}
        className="min-w-0 flex-1 accent-accent"
      />
    </div>
  );
}
