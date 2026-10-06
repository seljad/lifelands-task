export type HistoryMode = "push" | "replace";

type PendingUpdate = {
  params: Map<string, string | null>;
  history: HistoryMode;
};

let pending: PendingUpdate | null = null;

function flush(): void {
  if (pending === null) return;
  const { params: patch, history } = pending;
  pending = null;

  const params = new URLSearchParams(window.location.search);
  for (const [key, value] of patch) {
    if (value === null) params.delete(key);
    else params.set(key, value);
  }

  const query = params.toString();
  const next = `${window.location.pathname}${query === "" ? "" : `?${query}`}${window.location.hash}`;
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  if (next === current) return;

  if (history === "push") window.history.pushState(null, "", next);
  else window.history.replaceState(null, "", next);
}

export function readUrlParam(key: string): string | null {
  return new URLSearchParams(window.location.search).get(key);
}

/**
 * Updates made in the same tick are merged into one history entry, so
 * "clear all filters" does not create one back-button stop per parameter.
 */
export function scheduleUrlUpdate(
  key: string,
  value: string | null,
  history: HistoryMode,
): void {
  if (pending === null) {
    pending = { params: new Map(), history: "replace" };
    queueMicrotask(flush);
  }
  pending.params.set(key, value);
  if (history === "push") pending.history = "push";
}
