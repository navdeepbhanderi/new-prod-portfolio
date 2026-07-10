"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const LenisContext = createContext<Lenis | null>(null);

/** The live Lenis instance, or null (reduced motion / before mount). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  lenisRef.current = lenis;

  // Route changes must land at the top (or at the hash target) — Next's own
  // scroll reset gets overridden by Lenis's animation loop otherwise.
  const pathname = usePathname();
  const firstRouteRef = useRef(true);
  useEffect(() => {
    if (firstRouteRef.current) {
      // Don't fight the browser's scroll restoration on initial load/reload.
      firstRouteRef.current = false;
      return;
    }
    const instance = lenisRef.current;
    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;
    if (target) {
      requestAnimationFrame(() => {
        if (instance) instance.scrollTo(target as HTMLElement, { offset: -88 });
        else target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else if (instance) {
      instance.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    // Geist metrics shift heading heights once fonts land; remeasure triggers.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    if (reduced) {
      ScrollTrigger.refresh();
      return;
    }

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Allow anchor links to drive Lenis.
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a[href^='#']");
      if (!target) return;
      const id = target.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        instance.scrollTo(el as HTMLElement, { offset: -88 });
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      gsap.ticker.remove(onTick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
