"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT_EXPO } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

type CharRevealProps = {
  text: string;
  /** Accessible name override — defaults to `text`. */
  label?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Applied to each character span (e.g. a background-clip gradient). */
  charClassName?: string;
  delay?: number;
  stagger?: number;
  /** mount: animate on load · inView: on scroll into view · manual: via `play`. */
  trigger?: "mount" | "inView" | "manual";
  play?: boolean;
  /** Initial rotation (deg) each char settles from. */
  rotate?: number;
  once?: boolean;
};

/**
 * Character-level rise reveal. Chars are split at render time so they exist
 * in the server HTML (no FOUC) and screen readers get one `aria-label`.
 */
export function CharReveal({
  text,
  label,
  as = "h2",
  className,
  charClassName,
  delay = 0,
  stagger = 0.025,
  trigger = "inView",
  play = false,
  rotate = 6,
  once = true,
}: CharRevealProps) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as];

  const charVariants: Variants = {
    hidden: { y: "115%", rotate },
    visible: {
      y: "0%",
      rotate: 0,
      transition: { duration: 0.9, ease: EASE_OUT_EXPO },
    },
  };

  if (reduced) {
    const Tag = as;
    return (
      <Tag className={className} aria-label={label}>
        {text}
      </Tag>
    );
  }

  const animationProps =
    trigger === "mount"
      ? { initial: "hidden" as const, animate: "visible" as const }
      : trigger === "manual"
        ? {
            initial: "hidden" as const,
            animate: play ? ("visible" as const) : ("hidden" as const),
          }
        : {
            initial: "hidden" as const,
            whileInView: "visible" as const,
            viewport: { once, margin: "-60px" },
          };

  const words = text.split(" ");

  return (
    <MotionTag
      className={cn("flex flex-wrap gap-x-[0.28em]", className)}
      aria-label={label ?? text}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      {...animationProps}
    >
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} aria-hidden className="flex overflow-hidden">
          {Array.from(word).map((char, ci) => (
            <motion.span
              key={ci}
              variants={charVariants}
              className={cn("inline-block", charClassName)}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </MotionTag>
  );
}
