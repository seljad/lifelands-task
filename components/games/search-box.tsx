"use client";

import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce.ts";
import { useUrlState } from "@/hooks/use-url-state.ts";
import { QUERY_PARAM } from "@/lib/filters/state.ts";
import { stringCodec } from "@/lib/url-codecs.ts";
import { CONTROL_HEIGHT_CLASS } from "./layout.ts";

const DEBOUNCE_MS = 300;

export function SearchBox() {
  const [urlQuery, setUrlQuery] = useUrlState(QUERY_PARAM, "", stringCodec, {
    history: "replace",
  });
  const [draft, setDraft] = useState(urlQuery);
  const [lastUrlQuery, setLastUrlQuery] = useState(urlQuery);
  const debouncedDraft = useDebounce(draft, DEBOUNCE_MS);

  if (urlQuery !== lastUrlQuery) {
    setLastUrlQuery(urlQuery);
    if (urlQuery !== debouncedDraft) setDraft(urlQuery);
  }

  useEffect(() => {
    setUrlQuery(debouncedDraft);
  }, [debouncedDraft, setUrlQuery]);

  return (
    <div className="relative w-full max-w-xl">
      <label htmlFor="game-search" className="sr-only">
        جستجوی بازی بر اساس نام یا سازنده
      </label>
      <input
        id="game-search"
        type="search"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="جستجوی نام بازی یا سازنده…"
        autoComplete="off"
        className={`${CONTROL_HEIGHT_CLASS} w-full rounded-xl border border-border bg-surface px-4 text-base placeholder:text-muted`}
      />
    </div>
  );
}
