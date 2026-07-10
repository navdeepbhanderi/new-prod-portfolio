import { cn } from "@/lib/utils";

/**
 * "Earth from space" horizon: a dark planetary disc rising past the bottom
 * edge with a luminous atmosphere rim, a sunrise hotspot at the apex, and
 * soft cosmic haze — pure CSS, transform/opacity only.
 *
 * The container is masked so the glow fades out well before its top edge —
 * without that, the blurred bloom clips into a hard horizontal seam. The rim
 * line and hotspot are children of the disc so they track its apex at every
 * viewport size. Parent needs `relative overflow-hidden`.
 */
export function HorizonGlow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[38vh] overflow-hidden [mask-image:linear-gradient(to_top,black_55%,transparent_95%)]",
        className
      )}
    >
      {/* Faint cosmic haze hugging the horizon */}
      <div className="absolute bottom-0 left-1/2 h-[70%] w-[130%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_bottom,hsl(228_80%_65%/0.13),transparent_65%)] blur-2xl" />

      {/* The planet — kept low so content above sits in clean dark sky */}
      <div className="animate-horizon absolute bottom-0 left-1/2 aspect-[2.2/1] w-[240%] -translate-x-1/2 translate-y-[76%] rounded-[100%] bg-[hsl(240_6%_2.5%)] shadow-[0_-14px_90px_-10px_hsl(228_95%_72%/0.6),0_-3px_24px_-2px_hsl(0_0%_100%/0.45)] sm:w-[150%] sm:translate-y-[86%]">
        {/* Crisp atmosphere line following the curve */}
        <div className="absolute inset-0 rounded-[100%] border-t-2 border-white/55 [mask-image:linear-gradient(to_right,transparent_8%,black_35%,black_65%,transparent_92%)]" />
        {/* Sunrise hotspot riding the apex */}
        <div className="absolute left-1/2 top-0 h-32 w-[45%] -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[radial-gradient(ellipse_at_center,hsl(210_100%_88%/0.35),hsl(228_90%_70%/0.15),transparent_70%)] blur-2xl" />
        {/* Atmospheric falloff just inside the planet's edge */}
        <div className="absolute inset-0 rounded-[100%] bg-[linear-gradient(to_bottom,hsl(228_60%_55%/0.12),transparent_14%)]" />
      </div>
    </div>
  );
}
