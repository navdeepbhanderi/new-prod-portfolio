"use client";

import { useSyncExternalStore } from "react";

export const INTRO_KEY = "nv-intro-done";

const listeners = new Set<() => void>();
// Mirrors sessionStorage so subscribers get notified within this document
// (storage events don't fire in the tab that wrote them).
let done: boolean | null = null;

function read(): boolean {
  if (done !== null) return done;
  try {
    done = sessionStorage.getItem(INTRO_KEY) === "1";
  } catch {
    done = false;
  }
  return done;
}

export const intro = {
  isDone(): boolean {
    if (typeof window === "undefined") return false;
    return read();
  },
  complete(): void {
    if (done === true) return;
    done = true;
    try {
      sessionStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* private mode — in-memory flag still works */
    }
    listeners.forEach((cb) => cb());
  },
  subscribe(cb: () => void): () => void {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useIntroDone(): boolean {
  return useSyncExternalStore(
    intro.subscribe,
    () => intro.isDone(),
    () => false
  );
}
