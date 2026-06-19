"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

type MagneticProps = {
  children: React.ReactNode;
  className?: string;
  strength?: number;
};

/**
 * Wraps any element and pulls it toward the cursor on hover.
 * Falls back to a static wrapper on touch / reduced-motion.
 */
export function Magnetic({ children, className, strength = 0.4 }: MagneticProps) {
  const { ref, x, y, onMouseMove, onMouseLeave } = useMagnetic<HTMLDivElement>(strength);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.div>
  );
}
