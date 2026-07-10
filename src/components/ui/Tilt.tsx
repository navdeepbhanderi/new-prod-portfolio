"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { SPRING_SOFT } from "@/lib/motion";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/use-media-query";

type TiltProps = {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  max?: number;
  scale?: number;
  /** 0 disables the sheen layer. */
  glareOpacity?: number;
};

/**
 * Pointer-driven 3D tilt with an optional moving sheen. Motion values only —
 * zero React renders per mousemove. Renders a plain div on touch / reduced motion.
 */
export function Tilt({
  children,
  className,
  max = 6,
  scale = 1.015,
  glareOpacity = 0.06,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  // Normalized pointer position within the element, 0→1.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const hovering = useMotionValue(0);
  const sheenOpacity = useSpring(hovering, { stiffness: 200, damping: 30 });

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING_SOFT);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING_SOFT);
  const glareX = useTransform(px, [0, 1], [0, 100]);
  const glareY = useTransform(py, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(65% 65% at ${glareX}% ${glareY}%, hsl(0 0% 100% / ${glareOpacity}), transparent 70%)`;

  if (isTouch || reduced) {
    return <div className={className}>{children}</div>;
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
    hovering.set(1);
  };

  const onPointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
    hovering.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      whileHover={{ scale }}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative", className)}
    >
      {children}
      {glareOpacity > 0 && (
        <motion.div
          aria-hidden
          style={{ background: glare, opacity: sheenOpacity }}
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
        />
      )}
    </motion.div>
  );
}
