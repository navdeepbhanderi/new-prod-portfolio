"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { useIsTouch, usePrefersReducedMotion } from "./use-media-query";

/**
 * Normalized, spring-smoothed pointer position: both values travel -0.5 → 0.5
 * across the viewport. One passive listener; consumers derive per-layer
 * offsets with useTransform. Stays at 0 on touch / reduced motion.
 */
export function useMouseParallax(): {
  x: MotionValue<number>;
  y: MotionValue<number>;
} {
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const disabled = isTouch || reduced;

  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const x = useSpring(nx, { stiffness: 60, damping: 18 });
  const y = useSpring(ny, { stiffness: 60, damping: 18 });

  useEffect(() => {
    if (disabled) {
      nx.set(0);
      ny.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      nx.set(e.clientX / window.innerWidth - 0.5);
      ny.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [disabled, nx, ny]);

  return { x, y };
}
