"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLenis } from "@/components/layout/SmoothScroll";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

function Pill({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-foreground/[0.02] px-5 py-2.5 text-sm text-foreground/75">
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
      {label}
    </span>
  );
}

/**
 * Infinite marquee whose speed and skew react to scroll velocity —
 * flick-scroll and the row rushes and shears, then settles back.
 */
export function VelocityMarquee({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const row = rowRef.current;
    const track = trackRef.current;
    if (!row || !track) return;

    gsap.set(track, { xPercent: reverse ? -50 : 0 });
    const tween = gsap.to(track, {
      xPercent: reverse ? 0 : -50,
      repeat: -1,
      ease: "none",
      duration: 40,
    });

    // Velocity spikes push the targets up; the ticker eases toward them and
    // decays them back to rest, so the marquee always settles on its own.
    let speed = 1;
    let speedTarget = 1;
    let skew = 0;
    let skewTarget = 0;

    const onTick = () => {
      speed += (speedTarget - speed) * 0.1;
      skew += (skewTarget - skew) * 0.1;
      speedTarget += (1 - speedTarget) * 0.04;
      skewTarget -= skewTarget * 0.04;
      tween.timeScale(speed);
      gsap.set(row, { skewX: skew });
    };
    gsap.ticker.add(onTick);

    const onScroll = (e: { velocity: number }) => {
      speedTarget = 1 + Math.min(Math.abs(e.velocity) / 12, 2.5);
      skewTarget = gsap.utils.clamp(-4, 4, e.velocity * 0.12);
    };
    lenis?.on("scroll", onScroll);

    return () => {
      lenis?.off("scroll", onScroll);
      gsap.ticker.remove(onTick);
      tween.kill();
      gsap.set(row, { skewX: 0, clearProps: "transform" });
    };
  }, [reduced, reverse, lenis]);

  if (reduced) {
    return (
      <div className="flex flex-wrap justify-center gap-3 px-6">
        {items.map((item) => (
          <Pill key={item} label={item} />
        ))}
      </div>
    );
  }

  // The tween loops the track by -50%, so it must be two identical halves and
  // each half has to outspan any viewport — otherwise wide screens see the
  // track end mid-row. Four copies per half (~32 chips) covers up to 4K.
  const half = Array.from({ length: 4 }, () => items).flat();

  return (
    <div className="mask-x overflow-hidden">
      <div ref={rowRef} className={cn("flex")}>
        <div ref={trackRef} className="flex shrink-0 gap-3 pr-3">
          {[...half, ...half].map((item, i) => (
            <Pill key={`${item}-${i}`} label={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
