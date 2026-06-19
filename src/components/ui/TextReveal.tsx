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
  const words = text.split(" ");
  const MotionTag = motion[as];

  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
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
