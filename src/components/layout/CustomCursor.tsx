"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/use-media-query";
import { useMounted } from "@/hooks/use-mounted";

type CursorVariant = "default" | "hover" | "view" | "invert" | "hidden";

const RING_SIZE: Record<CursorVariant, number> = {
  default: 18,
  hover: 44,
  view: 72,
  invert: 56,
  hidden: 12,
};

function resolveVariant(target: HTMLElement | null): {
  name: CursorVariant;
  label: string;
} {
  const el = target?.closest<HTMLElement>(
    "[data-cursor], a, button, input, textarea, select"
  );
  if (!el) return { name: "default", label: "" };
  if (el.matches("input, textarea, select")) return { name: "hidden", label: "" };
  const dc = el.dataset.cursor;
  if (dc === "view")
    return { name: "view", label: el.dataset.cursorLabel ?? "View" };
  if (dc === "invert") return { name: "invert", label: "" };
  if (dc === "hidden") return { name: "hidden", label: "" };
  return { name: "hover", label: "" };
}

export function CustomCursor() {
  const mounted = useMounted();
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();

  // Precise dot tracks 1:1; the ring trails on a spring.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.3 });
  const ringY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.3 });

  const [variant, setVariant] = useState<{ name: CursorVariant; label: string }>({
    name: "default",
    label: "",
  });
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isTouch || reduced) return;

    // Position: motion values only — no React state per mousemove.
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const firstMove = (e: MouseEvent) => {
      move(e);
      setVisible(true);
    };
    // Variant: pointerover fires on target-boundary changes only.
    const over = (e: Event) => setVariant(resolveVariant(e.target as HTMLElement));
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    window.addEventListener("mousemove", firstMove, { once: true });
    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      window.removeEventListener("mousemove", firstMove);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [isTouch, reduced, x, y]);

  if (!mounted || isTouch || reduced) return null;

  const { name, label } = variant;
  const filled = name === "view" || name === "invert";
  const size = RING_SIZE[name];

  return (
    <>
      {/* Precise dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block"
        style={{ x, y }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
          animate={{
            width: 6,
            height: 6,
            opacity: visible && (name === "default" || name === "hover") ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>

      {/* Trailing ring / disc */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          className={
            filled
              ? "grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-foreground mix-blend-difference"
              : "grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-foreground/40 bg-foreground/5"
          }
          animate={{
            width: size,
            height: size,
            scale: pressed ? 0.85 : 1,
            opacity: !visible || name === "hidden" ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <AnimatePresence>
            {name === "view" && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
                className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-background"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}
