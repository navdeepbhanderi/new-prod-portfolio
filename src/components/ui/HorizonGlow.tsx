import { cn } from "@/lib/utils";

/**
 * The horizon: one lit line across the foot of the frame with a soft glow
 * rising off it. At md+ it's a very wide rounded rectangle pushed mostly
 * below the frame — border-radius clamps to half the shorter side, so the
 * flat top run is `width - height` and the rounded ends bend the line down
 * inside the viewport. Width drives height as a ratio so the curve holds at
 * any viewport width; only the apex is anchored (container % for the footer,
 * svh for the intro). Below md it becomes an edgeless glow.
 * No animation, no filters. Parent needs `relative overflow-hidden`.
 */

// footer: apex at 48.8% of the container. intro: tighter arc, apex at 45svh.
const SHAPE = {
  footer:
    "bottom-[calc(51.2%_-_72.3vw)] h-[72.3vw] w-[160vw] border-[hsl(225_75%_88%/0.45)]",
  intro:
    "bottom-[calc(45svh_-_62.6vw)] h-[62.6vw] w-[146vw] border-[hsl(225_100%_87%/0.32)]",
} as const;

export function HorizonGlow({
  className,
  variant = "footer",
}: {
  className?: string;
  variant?: keyof typeof SHAPE;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* phones: soft, no hard edge to collide with the stacked content */}
      <div className="absolute inset-x-[-30%] bottom-0 h-[26rem] bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,hsl(var(--accent)/0.2),hsl(var(--accent)/0.06)_45%,transparent_75%)] md:hidden" />

      {/* md+: the horizon line with rounded ends */}
      <div
        className={cn(
          "absolute left-1/2 hidden -translate-x-1/2 rounded-[999px] border-t bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--accent)/0.22),hsl(230_45%_22%/0.1)_32%,transparent_58%)] md:block",
          SHAPE[variant]
        )}
      />
    </div>
  );
}
