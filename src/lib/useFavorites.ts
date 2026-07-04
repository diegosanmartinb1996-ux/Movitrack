"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "movitrack:favorites";
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedValue: string[] = [];

function readSnapshot(): string[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedValue = raw ? JSON.parse(raw) : [];
    } catch {
      cachedValue = [];
    }
  }
  return cachedValue;
}

const EMPTY: string[] = [];

function getServerSnapshot(): string[] {
  return EMPTY;
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function writeFavorites(next: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);

  const toggleFavorite = useCallback((id: string) => {
    const current = readSnapshot();
    const next = current.includes(id)
      ? current.filter((f) => f !== id)
      : [...current, id];
    writeFavorites(next);
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
