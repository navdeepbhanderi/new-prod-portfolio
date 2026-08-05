"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { useIntroDone } from "@/lib/intro";

/**
 * Warms the case-study routes once the page itself is done.
 *
 * Next already prefetches a `<Link>` when it scrolls into view, but that means
 * the deck has to be on screen before a project route is warm — so opening one
 * from the command palette, the footer, or a fast click near the top still paid
 * for the fetch. Since the whole navigation happens inside
 * `document.startViewTransition`, that wait is a *frozen* page rather than a
 * spinner, which reads far worse than it measures.
 *
 * Two routes of static HTML, fetched on idle after the intro has handed over,
 * and skipped entirely when the visitor has asked us to save data.
 */
export function RoutePrefetch() {
  const router = useRouter();
  const introDone = useIntroDone();

  useEffect(() => {
    if (!introDone) return;

    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && /2g/.test(connection.effectiveType)) return;

    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const warm = () => PROJECTS.forEach((p) => router.prefetch(`/projects/${p.id}`));

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(warm, { timeout: 3000 });
    } else {
      timeoutId = window.setTimeout(warm, 1800);
    }

    return () => {
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [router, introDone]);

  return null;
}
