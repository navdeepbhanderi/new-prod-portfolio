"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span aria-hidden style={{ opacity }} className="mr-[0.28em]">
      {children}
    </motion.span>
  );
}

/**
 * Kinetic manifesto: each word brightens from near-invisible to full
 * strength, scrubbed to scroll position — the paragraph reads itself as it
 * travels up the viewport. Opacity-only (scrub-safe), real text for AT via
 * aria-label, plain paragraph under reduced motion.
 */
export function KineticText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    // Starts lighting up as the paragraph enters the lower viewport and is
    // fully lit well before it reaches the top — no dead scroll at either end.
    offset: ["start 0.9", "start 0.38"],
  });

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  const words = text.split(" ");

  return (
    <p ref={ref} aria-label={text} className={cn("flex flex-wrap", className)}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          range={[i / words.length, Math.min(1, (i + 1.6) / words.length)]}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}
