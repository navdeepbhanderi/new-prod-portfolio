"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#<>/*+-";

/**
 * Terminal-style decode: characters cycle through random glyphs and settle
 * left-to-right into the real text when scrolled into view. Made for the
 * mono eyebrow/meta layer — keep it off body copy. Renders the real text
 * on the server and under reduced motion; `aria-label` keeps AT stable
 * while the visible glyphs churn.
 */
export function ScrambleText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!inView || reduced) return;
    // ~2 frames of churn per character, 30ms cadence ≈ 0.5–0.9s per label.
    const totalFrames = Math.max(10, text.length * 2);
    let frame = 0;
    const id = setInterval(() => {
      frame++;
      const settled = Math.ceil((frame / totalFrames) * text.length);
      if (settled >= text.length) {
        clearInterval(id);
        setDisplay(text);
        return;
      }
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (i < settled || char === " ") return char;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
    }, 30);
    return () => clearInterval(id);
  }, [inView, reduced, text]);

  return (
    <span ref={ref} aria-label={text} className={className}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
