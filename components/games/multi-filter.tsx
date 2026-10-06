"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useUrlState } from "@/hooks/use-url-state.ts";
import { getFilterOptions } from "@/lib/filters/options.ts";
import type { MultiFilterDefinition } from "@/lib/filters/types.ts";
import type { Game } from "@/lib/types/game.ts";
import { stringListCodec } from "@/lib/url-codecs.ts";
import { formatNumber } from "@/lib/format.ts";
import { CONTROL_HEIGHT_CLASS, CONTROL_WIDTH_CLASS } from "./layout.ts";

const NO_SELECTION: readonly string[] = [];

type MultiFilterProps = {
  definition: MultiFilterDefinition;
  games: readonly Game[];
};

export function MultiFilter({ definition, games }: MultiFilterProps) {
  const [selected, setSelected] = useUrlState(
    definition.id,
    NO_SELECTION,
    stringListCodec,
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const options = useMemo(
    () => getFilterOptions(definition, games, selected),
    [definition, games, selected],
  );

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !containerRef.current?.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isOpen]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && isOpen) {
      event.stopPropagation();
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const toggleValue = (value: string) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${CONTROL_WIDTH_CLASS.multi}`}
      onKeyDown={handleKeyDown}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((open) => !open)}
        className={`${CONTROL_HEIGHT_CLASS} flex w-full items-center justify-between gap-2 rounded-xl border px-4 text-sm ${
          selected.length > 0
            ? "border-accent bg-surface-muted font-semibold"
            : "border-border bg-surface"
        }`}
      >
        <span className="truncate">
          {definition.label}
          {selected.length > 0 && ` (${formatNumber(selected.length)})`}
        </span>
        <svg viewBox="0 0 20 20" className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div
          id={panelId}
          role="group"
          aria-label={definition.label}
          className="absolute inset-s-0 top-full z-20 mt-2 max-h-72 w-56 overflow-y-auto rounded-xl border border-border bg-surface p-2 shadow-xl"
        >
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-surface-muted has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => toggleValue(option.value)}
                className="h-4 w-4 accent-accent"
              />
              {option.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
