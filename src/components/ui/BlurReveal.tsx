"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUpBlur } from "@/lib/motion";

type BlurRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "section" | "li" | "span";
};

export function BlurReveal({
  children,
  className,
  delay = 0,
  y = 24,
  once = true,
  as = "div",
}: BlurRevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      variants={fadeUpBlur(delay, y)}
    >
      {children}
    </MotionTag>
  );
}
