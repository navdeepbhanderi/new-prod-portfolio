"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * Oversized outlined section index that drifts slower than the content —
 * absolutely position it inside a `relative overflow-hidden` section.
 */
export function ParallaxNumeral({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute right-0 top-0 -z-10 select-none",
        className
      )}
    >
      <motion.span
        style={reduced ? undefined : { y }}
        className="text-stroke-border block font-mono text-[clamp(8rem,22vw,18rem)] font-bold leading-none opacity-50"
      >
        {value}
      </motion.span>
    </div>
  );
}
