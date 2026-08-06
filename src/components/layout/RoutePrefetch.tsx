"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@/data/projects";
import { useIntroDone } from "@/lib/intro";

/**
 * Prefetch the case-study routes on idle once the intro has handed over.
 * In-view <Link> prefetch doesn't cover navigations from the palette or
 * footer, and the view transition freezes the page while it waits. Skipped
 * on save-data / 2G connections.
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
