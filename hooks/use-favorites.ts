"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  parseFavorites,
  serializeFavorites,
  toggleFavorite,
} from "../lib/favorites.ts";

const STORAGE_KEY = "lifelands:favorites";
const EMPTY_FAVORITES: ReadonlySet<string> = new Set();

const listeners = new Set<() => void>();
let memoryRaw: string | null = null;
let cachedRaw: string | null | undefined;
let cachedFavorites: ReadonlySet<string> = EMPTY_FAVORITES;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? memoryRaw;
  } catch {
    return memoryRaw;
  }
}

function getSnapshot(): ReadonlySet<string> {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedFavorites = parseFavorites(raw);
  }
  return cachedFavorites;
}

function getServerSnapshot(): ReadonlySet<string> {
  return EMPTY_FAVORITES;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(favorites: ReadonlySet<string>): void {
  memoryRaw = serializeFavorites(favorites);
  try {
    window.localStorage.setItem(STORAGE_KEY, memoryRaw);
  } catch {}
  listeners.forEach((listener) => listener());
}

export function useFavorites(): {
  favorites: ReadonlySet<string>;
  toggle: (id: string) => void;
} {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback((id: string) => {
    write(toggleFavorite(getSnapshot(), id));
  }, []);

  return { favorites, toggle };
}
