"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Glass surface with a cursor-following border glow. The pointer position is
 * written to CSS custom properties on the element — zero React renders per
 * mousemove; hover visibility is pure CSS.
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

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!interactive || !el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-foreground/[0.02] backdrop-blur-sm transition-colors duration-300 [contain:paint]",
        interactive && "hover:border-foreground/20",
        className
      )}
      style={{ "--gx": "-200px", "--gy": "-200px" } as React.CSSProperties}
    >
      {interactive && (
        <>
          {/* Cursor-following surface glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(420px circle at var(--gx) var(--gy), hsl(0 0% 100% / 0.06), transparent 65%)",
            }}
          />
          {/* Border brightens near the cursor */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100 [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] [mask-composite:exclude]"
            style={{
              background:
                "radial-gradient(220px circle at var(--gx) var(--gy), hsl(0 0% 100% / 0.35), transparent 70%)",
            }}
          />
        </>
      )}
      {children}
    </div>
  );
}
