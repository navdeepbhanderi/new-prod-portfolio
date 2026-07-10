import type { Variants } from "framer-motion";

/** Shared easing curves typed as cubic-bezier tuples for Framer Motion. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/** GSAP twin of EASE_OUT_EXPO for timelines that live outside Framer. */
export const GSAP_EASE = "power4.out";

/** Duration scale (seconds). */
export const DUR = { fast: 0.2, base: 0.4, reveal: 0.7, slow: 1.1 } as const;

/** UI-state spring — nav pill, cursor size, toggles. */
export const SPRING_SNAPPY = {
  type: "spring",
  stiffness: 400,
  damping: 30,
} as const;

/** Soft physical spring — tilt, magnetic attraction. */
export const SPRING_SOFT = {
  type: "spring",
  stiffness: 150,
  damping: 20,
  mass: 0.5,
} as const;

/** Fade + rise + blur reveal, the site's core entrance. */
export function fadeUpBlur(delay = 0, y = 24): Variants {
  return {
    hidden: { opacity: 0, y, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: DUR.reveal, ease: EASE_OUT, delay },
    },
  };
}

/** Parent orchestrator for staggered children. */
export function staggerContainer(stagger = 0.06, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
}

/** Small pop-in for chips / pills. */
export const chipPop: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};
