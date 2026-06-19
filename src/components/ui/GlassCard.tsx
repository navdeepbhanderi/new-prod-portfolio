"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Glass surface with a cursor-following border glow. Used for premium cards.
 */
export function GlassCard({
  children,
  className,
  interactive = true,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [active, setActive] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-foreground/[0.02] backdrop-blur-sm transition-colors duration-300",
        interactive && "hover:border-foreground/20",
        className
      )}
    >
      {interactive && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: active ? 1 : 0,
            background: `radial-gradient(420px circle at ${pos.x}px ${pos.y}px, hsl(0 0% 100% / 0.06), transparent 65%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
