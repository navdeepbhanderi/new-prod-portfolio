import { cn } from "@/lib/utils";

/**
 * The horizon: one lit line across the foot of the frame with a soft glow
 * rising off it.
 *
 * At `md+` it's a single very wide, very tall rounded rectangle pushed mostly
 * below the frame. `border-radius: 999px` clamps to half the shorter side, so
 * the flat run of the top edge is exactly `width - height` and the rounded ends
 * are what bend the line down near each edge. Both design frames want those
 * ends *inside* the viewport — 3g curves over its outer ~90px of 1440, 3c over
 * its outer ~120px. Get the width-to-height ratio wrong and the flat run
 * swallows the whole screen: the arc renders as a dead straight rule.
 *
 * That is why width drives height here rather than both being fixed. A literal
 * `2300px` matches 3g only up to a 1353px viewport, past which `170vw` took over
 * and flattened it. Expressed as a ratio the curve holds at any width, and only
 * the apex is anchored — in `%` of the container for the footer (whose height is
 * its own), in `svh` for the intro (which is the viewport).
 *
 * Below `md` the footer is auto-height and much taller, so a line at a fixed
 * offset lands in the middle of the sitemap. There it becomes an edgeless glow
 * instead — which is what the design does on phones anyway.
 *
 * No animation and no filters: two static gradients, one paint.
 * Parent needs `relative overflow-hidden`.
 */

/**
 * `footer` is 3g: 2300x1040 at bottom -620 in an 1440x820 frame — apex at 48.8%
 * of the container, flat run 88px shy of each edge.
 * `intro` is 3c: 2100x900 at bottom -520 in 1440x840 — a slightly tighter arc
 * sitting higher, apex 45svh off the floor.
 */
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
