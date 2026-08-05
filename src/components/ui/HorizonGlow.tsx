import { cn } from "@/lib/utils";

/**
 * The horizon: one lit line across the foot of the frame with a soft glow
 * rising off it.
 *
 * At `md+` it's a single very wide, very tall rounded rectangle pushed mostly
 * below the frame. Because it is far wider than any viewport its top edge is
 * flat across the whole screen and only curves away past the edges — a horizon
 * line with rounded ends, not a planet. (It used to be a literal disc with a
 * curved rim and a sunrise hotspot; the curve dominated the footer and fought
 * the type sitting on it.)
 *
 * Below `md` the footer is auto-height and much taller, so a line at a fixed
 * offset lands in the middle of the sitemap. There it becomes an edgeless glow
 * instead — which is what the design does on phones anyway.
 *
 * No animation and no filters: two static gradients, one paint.
 * Parent needs `relative overflow-hidden`.
 */
export function HorizonGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* phones: soft, no hard edge to collide with the stacked content */}
      <div className="absolute inset-x-[-30%] bottom-0 h-[26rem] bg-[radial-gradient(ellipse_80%_100%_at_50%_100%,hsl(var(--accent)/0.2),hsl(var(--accent)/0.06)_45%,transparent_75%)] md:hidden" />

      {/* md+: the flat horizon line with rounded ends */}
      <div className="absolute -bottom-[620px] left-1/2 hidden h-[1040px] w-[max(2300px,170vw)] -translate-x-1/2 rounded-[999px] border-t border-[hsl(225_75%_88%/0.45)] bg-[radial-gradient(ellipse_at_50%_0%,hsl(var(--accent)/0.22),hsl(230_45%_22%/0.1)_32%,transparent_58%)] md:block" />
    </div>
  );
}
