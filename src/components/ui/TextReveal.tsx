"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

type TextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  /** inView: on scroll into view · manual: driven by `play`. */
  trigger?: "inView" | "manual";
  play?: boolean;
};

/**
 * Word-by-word reveal with a subtle blur + rise. Each word animates in sequence.
 *
 * The hero uses `trigger="manual"` so its claim waits for the intro's hand-off
 * instead of firing behind the curtain, where nobody would see it.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  once = true,
  as = "h2",
  trigger = "inView",
  play = false,
}: TextRevealProps) {
  // Words wrapped in *asterisks* render in the display serif italic — one
  // editorial emphasis phrase per heading. Asterisks are stripped everywhere
  // (including the aria-label) so AT reads clean prose.
  //
  // The closing marker can sit before punctuation ("*product*,"), so the end of
  // the span is "this token has an asterisk somewhere after the first
  // character" rather than "this token ends with one".
  let active = false;
  const words = text.split(" ").map((token) => {
    const opens = token.startsWith("*");
    if (opens) active = true;
    const accent = active;
    if (token.slice(opens ? 1 : 0).includes("*")) active = false;
    return { word: token.replace(/\*/g, ""), accent };
  });
  const label = text.replace(/\*/g, "");
  const MotionTag = motion[as];

  const animationProps =
    trigger === "manual"
      ? {
          initial: "hidden" as const,
          animate: play ? ("visible" as const) : ("hidden" as const),
        }
      : {
          initial: "hidden" as const,
          whileInView: "visible" as const,
          viewport: { once, margin: "-60px" },
        };

  return (
    <MotionTag
      className={cn(className)}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={label}
      {...animationProps}
    >
      {words.map(({ word, accent }, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={cn("inline-block", accent && "text-accent-italic")}
            aria-hidden
            variants={{
              hidden: { y: "110%", opacity: 0, filter: "blur(8px)" },
              visible: {
                y: "0%",
                opacity: 1,
                filter: "blur(0px)",
                transition: { duration: 0.65, ease: EASE_OUT },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
