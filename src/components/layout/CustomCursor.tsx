"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";

export function CustomCursor() {
  const mounted = useMounted();
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });

  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTouch || reduced) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as HTMLElement;
      setHovering(Boolean(t.closest("a, button, [data-cursor='hover']")));
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
    };
  }, [isTouch, reduced, x, y]);

  if (!mounted || isTouch || reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/40 bg-foreground/5 backdrop-invert-0"
        animate={{
          width: hovering ? 44 : 18,
          height: hovering ? 44 : 18,
          opacity: visible ? 1 : 0,
          backgroundColor: hovering ? "hsl(0 0% 100% / 0.08)" : "hsl(0 0% 100% / 0.02)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </motion.div>
  );
}
