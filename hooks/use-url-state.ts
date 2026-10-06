"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { UrlCodec } from "../lib/url-codecs.ts";
import { readUrlParam, scheduleUrlUpdate } from "../lib/url-writer.ts";
import type { HistoryMode } from "../lib/url-writer.ts";

type UrlStateOptions = {
  history?: HistoryMode;
};

export function useUrlState<T>(
  key: string,
  defaultValue: T,
  codec: UrlCodec<T>,
  { history = "push" }: UrlStateOptions = {},
): [T, (value: T) => void] {
  const searchParams = useSearchParams();
  const raw = searchParams.get(key);
  const value = useMemo(
    () => codec.parse(raw, defaultValue),
    [codec, raw, defaultValue],
  );

  const setValue = useCallback(
    (next: T) => {
      const serialized = codec.serialize(next);
      const isDefault = serialized === codec.serialize(defaultValue);
      const nextParam = isDefault ? null : serialized;
      if (nextParam === readUrlParam(key)) return;
      scheduleUrlUpdate(key, nextParam, history);
    },
    [codec, defaultValue, history, key],
  );

  return [value, setValue];
}
