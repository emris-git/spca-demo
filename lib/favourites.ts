"use client";

import { useSyncExternalStore } from "react";

// Favourites stay in this browser (localStorage). A real build would sync them to a
// supporter account or send "new animals like these" alerts via the CRM.

const KEY = "spca-demo:favourites";
const EVENT = "spca-demo:favourites";
const EMPTY: string[] = [];
let cache: { raw: string | null; ids: string[] } = { raw: null, ids: EMPTY };

function read(): string[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cache.raw) return cache.ids;
  let ids: string[] = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    ids = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : EMPTY;
  } catch {}
  cache = { raw, ids };
  return ids;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useFavourites() {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function toggleFavourite(id: string) {
  const current = read();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new Event(EVENT));
  return next.includes(id);
}
