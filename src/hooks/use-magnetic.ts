"use client";

import { useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { useIsTouch, usePrefersReducedMotion } from "./use-media-query";

/**
 * Magnetic pointer attraction for buttons / interactive elements.
 * Disabled on touch devices and when reduced motion is requested.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null);
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const disabled = isTouch || reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMouseMove = (e: React.MouseEvent<T>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, x: springX, y: springY, onMouseMove, onMouseLeave, disabled };
}
