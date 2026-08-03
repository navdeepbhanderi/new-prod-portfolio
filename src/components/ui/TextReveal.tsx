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
};

/**
 * Word-by-word reveal with a subtle blur + rise. Each word animates in sequence.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.045,
  once = true,
  as = "h2",
}: TextRevealProps) {
  // Words wrapped in *asterisks* render in the display serif italic — one
  // editorial emphasis phrase per heading. Asterisks are stripped everywhere
  // (including the aria-label) so AT reads clean prose.
  let active = false;
  const words = text.split(" ").map((token) => {
    let word = token;
    let accent = active;
    if (word.startsWith("*")) {
      accent = true;
      active = true;
      word = word.slice(1);
    }
    if (word.endsWith("*")) {
      word = word.slice(0, -1);
      active = false;
    }
    return { word, accent };
  });
  const label = text.replace(/\*/g, "");
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={label}
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
