/*
  From: https://github.com/DiamondLightSource/xrpddatavis
*/

import { useState } from "react";

const PREFIX = "imaginghub.";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    /* private window or blocked storage - preferences just won't persist */
  }
}

/**
 * A `useState` that also persists to `localStorage`, per browser - the same
 * role `store.read`/`store.write` played in the previous vanilla JS frontend.
 * Never throws if storage is unavailable (a private window, cleared/blocked
 * site data): it just falls back to in-memory state for that session.
 */
export function usePersistentState<T>(key: string, fallback: T) {
  const [state, setState] = useState<T>(() => read(key, fallback));

  const set = (value: T | ((prev: T) => T)) => {
    setState((prev) => {
      const next = value instanceof Function ? value(prev) : value;
      write(key, next);
      return next;
    });
  };

  return [state, set] as const;
}
