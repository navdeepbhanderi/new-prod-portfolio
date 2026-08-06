"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { OPEN_PALETTE_EVENT } from "@/lib/events";

const CommandPalette = dynamic(
  () => import("./CommandPalette").then((m) => ({ default: m.CommandPalette })),
  { ssr: false }
);

/**
 * Defers the command palette out of the critical bundle: it loads on browser
 * idle, or immediately on ⌘K / an open event — in which case the trigger is
 * replayed once the palette has mounted.
 */
export function CommandPaletteLazy() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    let idleId: number | undefined;
    let timeoutId: number | undefined;

    const openOnceMounted = () => {
      setReady(true);
      window.setTimeout(
        () => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT)),
        300
      );
    };
    const onOpenRequest = () => openOnceMounted();
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openOnceMounted();
      }
    };
    window.addEventListener(OPEN_PALETTE_EVENT, onOpenRequest, { once: true });
    window.addEventListener("keydown", onKey);

    const load = () => setReady(true);
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(load, { timeout: 3000 });
    } else {
      timeoutId = window.setTimeout(load, 2000);
    }

    return () => {
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpenRequest);
      window.removeEventListener("keydown", onKey);
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [ready]);

  return ready ? <CommandPalette /> : null;
}
