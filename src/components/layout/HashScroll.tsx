"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/layout/SmoothScroll";
import { useIntroDone } from "@/lib/intro";

/**
 * Corrects the landing position on full loads with a hash (/#contact from a
 * case-study page, chat actions, palette fallbacks). The browser's native
 * anchor jump fires before hydration — then Lenis mounts, fonts land, and
 * ScrollTrigger refreshes, shifting the layout so the visitor ends up
 * stranded mid-page. Once the intro releases scroll and layout settles,
 * jump to the real target.
 */
export function HashScroll() {
  const lenis = useLenis();
  const done = useIntroDone();
  const pathname = usePathname();

  useEffect(() => {
    if (!done) return; // preloader still owns scroll
    const hash = window.location.hash.slice(1);
    if (!hash || !document.getElementById(hash)) return;

    let cancelled = false;
    const go = () => {
      if (cancelled) return;
      const target = document.getElementById(hash);
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { offset: -88, immediate: true });
      else target.scrollIntoView({ block: "start" });
    };

    // Fonts + a beat for hydration/ScrollTrigger refresh before measuring.
    let t: ReturnType<typeof setTimeout>;
    document.fonts.ready.then(() => {
      if (!cancelled) t = setTimeout(go, 150);
    });
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [done, lenis, pathname]);

  return null;
}
