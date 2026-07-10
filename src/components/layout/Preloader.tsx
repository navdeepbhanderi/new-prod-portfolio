"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { intro } from "@/lib/intro";
import { useLenis } from "@/components/layout/SmoothScroll";
import { Starfield } from "@/components/ui/Starfield";
import { HorizonGlow } from "@/components/ui/HorizonGlow";
import { PROFILE } from "@/lib/profile";

const NAME = PROFILE.name.toUpperCase();

/**
 * Once-per-session intro: an outlined name fills with light as the counter
 * runs, then a double-curtain lift hands off into the hero. Server-rendered
 * opaque so a fresh session never flashes the page; a pre-paint <head>
 * script hides it entirely on repeat visits (see layout.tsx / globals.css).
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const startedRef = useRef(false);

  const lenis = useLenis();

  // Belt-and-braces scroll lock while the intro plays (keyboard/space too).
  useEffect(() => {
    if (gone) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "clip";
    return () => {
      html.style.overflow = prev;
    };
  }, [gone]);

  // Lenis mounts asynchronously; stop it whenever it exists and we're active.
  useEffect(() => {
    if (gone || !lenis) return;
    lenis.stop();
    return () => lenis.start();
  }, [lenis, gone]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || intro.isDone()) {
      intro.complete();
      setGone(true);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(".pl-name", { yPercent: 60, opacity: 0 });
      gsap.set(".pl-fill", { clipPath: "inset(0 100% 0 0)" });
      gsap.set(".pl-eyebrow", { opacity: 0, y: 10 });

      const counter = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          setGone(true);
          requestAnimationFrame(() => ScrollTrigger.refresh());
        },
      });

      // Counter + progress hairline.
      tl.to(
        counter,
        {
          value: 100,
          duration: 1.5,
          ease: "power2.inOut",
          snap: { value: 1 },
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(
                Math.round(counter.value)
              ).padStart(3, "0");
            }
          },
        },
        0
      );
      tl.fromTo(
        ".pl-hairline",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: "power2.inOut" },
        0
      );

      // Name rises in, then its outline fills with light alongside the counter.
      tl.to(".pl-eyebrow", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.1);
      tl.to(
        ".pl-name",
        { yPercent: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
        0.15
      );
      tl.to(
        ".pl-fill",
        { clipPath: "inset(0 0% 0 0)", duration: 1.25, ease: "power2.inOut" },
        0.3
      );

      // Exit: name lifts away, meta fades, curtains follow.
      tl.to(
        ".pl-name",
        { yPercent: -70, opacity: 0, duration: 0.5, ease: "power2.in" },
        1.75
      );
      tl.to(
        [".pl-meta", ".pl-eyebrow"],
        { opacity: 0, duration: 0.3, ease: "power1.out" },
        1.8
      );

      // Hand off to the hero as the curtain starts lifting so the beats overlap.
      tl.add(() => intro.complete(), 2.05);
      tl.to(
        ".pl-panel-main",
        { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
        2.05
      );
      tl.to(
        ".pl-panel-follow",
        { yPercent: -100, duration: 0.9, ease: "power4.inOut" },
        2.11
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  if (gone) return null;

  return (
    <div
      id="preloader"
      ref={rootRef}
      aria-hidden
      className="fixed inset-0 z-[95] overflow-hidden"
    >
      {/* Follower panel — briefly visible as the main curtain lifts. */}
      <div className="pl-panel-follow absolute inset-0 bg-muted" />

      {/* Main curtain carries the content up with it. */}
      <div className="pl-panel-main absolute inset-0 flex flex-col overflow-hidden bg-background">
        {/* Deep space: stars + a rising event horizon behind the name. */}
        <Starfield density={0.00009} className="opacity-80" />
        <HorizonGlow className="opacity-90" />

        <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-6">
          <span className="pl-eyebrow font-mono text-[11px] uppercase tracking-[0.5em] text-muted-foreground">
            Portfolio — {new Date().getFullYear()}
          </span>

          <div className="pl-name relative select-none whitespace-nowrap text-[clamp(2.5rem,8.5vw,7rem)] font-semibold leading-none tracking-tight">
            {/* Outline layer */}
            <span className="text-stroke-strong block">{NAME}</span>
            {/* Fill layer — swept open in sync with the counter */}
            <span className="pl-fill text-name-gradient absolute inset-0 block">
              {NAME}
            </span>
          </div>
        </div>

        <div className="pl-meta relative flex items-end justify-between px-6 pb-6 sm:px-10 sm:pb-8">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Software Engineer
          </span>
          <span
            ref={counterRef}
            className="font-mono text-sm tabular-nums text-foreground/80"
          >
            000
          </span>
        </div>

        <div className="pl-hairline absolute bottom-0 left-0 h-px w-full origin-left bg-foreground/30" />
      </div>
    </div>
  );
}
