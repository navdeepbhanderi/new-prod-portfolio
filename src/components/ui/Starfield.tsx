"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  phase: number;
  speed: number;
  tint: boolean;
};

type Meteor = {
  x: number;
  y: number;
  vx: number; // px per ms
  vy: number;
  life: number;
  max: number;
};

/**
 * Canvas starfield: tiny twinkling stars, a few tinted with the site accent,
 * and an occasional shooting star streaking through. Pauses offscreen;
 * renders one static frame (no meteors) under reduced motion.
 */
export function Starfield({
  className,
  density = 0.00012,
}: {
  className?: string;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let raf = 0;
    let stars: Star[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const build = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: Math.round(w * h * density) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 1.1,
        a: 0.15 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
        tint: Math.random() < 0.18,
      }));
    };

    // Shooting stars: rare, thin, gone in ~a second. Spawned on a randomised
    // clock so they read as chance sightings, never a pattern.
    let meteors: Meteor[] = [];
    let nextMeteor = 3000 + Math.random() * 6000;
    let lastT = 0;

    const drawMeteors = (t: number, w: number, h: number) => {
      const dt = lastT ? Math.min(t - lastT, 48) : 16;
      lastT = t;

      if (t >= nextMeteor) {
        nextMeteor = t + 9000 + Math.random() * 9000;
        const dir = Math.random() < 0.5 ? 1 : -1;
        meteors.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.35,
          vx: dir * (0.28 + Math.random() * 0.18),
          vy: 0.1 + Math.random() * 0.08,
          life: 0,
          max: 900 + Math.random() * 500,
        });
      }

      meteors = meteors.filter((m) => m.life < m.max);
      for (const m of meteors) {
        m.life += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;

        const p = m.life / m.max;
        // quick flare in, long fade out
        const fade = p < 0.18 ? p / 0.18 : 1 - (p - 0.18) / 0.82;
        const mag = Math.hypot(m.vx, m.vy);
        const len = 90;
        const tailX = m.x - (m.vx / mag) * len;
        const tailY = m.y - (m.vy / mag) * len;

        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${0.8 * fade})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.globalAlpha = 1;
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.globalAlpha = 0.9 * fade;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const draw = (t: number) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const twinkle = reduced
          ? 1
          : 0.55 + 0.45 * Math.sin(s.phase + t * 0.001 * s.speed);
        ctx.globalAlpha = s.a * twinkle;
        ctx.fillStyle = s.tint ? "hsl(228 80% 78%)" : "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduced) drawMeteors(t, w, h);
    };

    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    build();
    if (reduced) draw(0);
    else raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      build();
      if (reduced) draw(0);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      if (reduced) return;
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [reduced, density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
