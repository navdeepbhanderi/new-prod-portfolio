"use client";

import { MotionConfig } from "framer-motion";

/**
 * Makes every Framer Motion animation respect prefers-reduced-motion.
 * The global CSS kill-switch only covers CSS animations; this covers
 * the inline-style/WAAPI animations Framer produces.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
