"use client";

import type Lenis from "lenis";

/**
 * Ref-counted scroll lock shared by every overlay (mobile menu, command
 * palette, chat).
 *
 * Each overlay used to own `document.body.style.overflow` outright, so closing
 * one while another was still open unlocked the page underneath it — open the
 * mobile menu, hit ⌘K, close the palette, and the page scrolled behind the
 * menu. Counting holders means the lock only lifts when the last one leaves.
 */
let holders = 0;
let previousOverflow = "";

export function lockScroll(lenis: Lenis | null): void {
  if (holders === 0) {
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  holders += 1;
  // Lenis is mounted asynchronously, so an overlay may lock before it exists;
  // whoever holds the lock when it appears re-stops it on their next effect run.
  lenis?.stop();
}

export function unlockScroll(lenis: Lenis | null): void {
  holders = Math.max(0, holders - 1);
  if (holders === 0) {
    document.body.style.overflow = previousOverflow;
    lenis?.start();
  }
}

/**
 * Effect-shaped helper: call from a `useEffect` that runs while the overlay is
 * open and return the result as the cleanup.
 *
 *   useEffect(() => (open ? holdScroll(lenis) : undefined), [open, lenis]);
 */
export function holdScroll(lenis: Lenis | null): () => void {
  lockScroll(lenis);
  return () => unlockScroll(lenis);
}
