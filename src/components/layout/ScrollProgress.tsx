"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left bg-gradient-to-r from-foreground/40 via-foreground to-foreground/40"
      style={{ scaleX }}
    />
  );
}
