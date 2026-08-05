"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { intro } from "@/lib/intro";
import { useLenis } from "@/components/layout/SmoothScroll";
import { Starfield } from "@/components/ui/Starfield";
import { HorizonGlow } from "@/components/ui/HorizonGlow";
import { PROFILE } from "@/lib/profile";
import { DUR, GSAP_EASE, GSAP_EASE_IN_OUT, INTRO, STAGGER } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Never finish faster than this — under it the light sweep across the name is
 * a flicker rather than a moment.
 */
const MIN_MS = 900;
/** …and never hold the visitor longer than this, however slow the network is. */
const MAX_MS = 2000;

/** 6b runs the log at one word per line — the desktop phrasing wraps at 390. */
const STEPS = [
  { id: "fonts", label: "Typefaces loaded", short: "Typefaces" },
  { id: "scene", label: "Scene compiled", short: "Scene" },
  { id: "hero", label: "Entering hero", short: "Hero" },
];

const CORNERS = [
  "left-5 top-5 border-l border-t sm:left-10 sm:top-10",
  "right-5 top-5 border-r border-t sm:right-10 sm:top-10",
  "bottom-5 left-5 border-b border-l sm:bottom-10 sm:left-10",
  "bottom-5 right-5 border-b border-r sm:bottom-10 sm:right-10",
];

/**
 * Once-per-session intro, composed as a loading manifest rather than a centred
 * word: registration marks, the name filling with light, a boot log, and the
 * counter as the largest number on screen.
 *
 * The counter is the **real** progress value — fonts and the hero portrait
 * report in as they land, and the name's light sweep is clipped to that same
 * number. Everything warm? it eases to 100 and leaves early. Network stalled?
 * it leaves at MAX_MS regardless. Any key or tap skips it outright.
 *
 * Server-rendered opaque so a fresh session never flashes the page; a pre-paint
 * <head> script hides it entirely on repeat visits (see layout.tsx / globals.css).
 */
export function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});
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

    // ---- real readiness signals -------------------------------------------
    const mark = (id: string) => setDone((d) => (d[id] ? d : { ...d, [id]: true }));
    let fontsReady = false;
    let sceneReady = false;

    document.fonts?.ready.then(() => {
      fontsReady = true;
      mark("fonts");
    });

    // "Scene" is the hero portrait — the LCP element. Once it has decoded there
    // is a real page underneath worth revealing.
    const portrait = new Image();
    const settleScene = () => {
      sceneReady = true;
      mark("scene");
    };
    portrait.onload = settleScene;
    portrait.onerror = settleScene;
    portrait.src = "/navdeep.webp";
    if (portrait.decode) portrait.decode().then(settleScene).catch(settleScene);

    // ---- skip --------------------------------------------------------------
    let skipped = false;
    const skip = () => {
      skipped = true;
    };
    window.addEventListener("keydown", skip, { passive: true });
    window.addEventListener("pointerdown", skip, { passive: true });

    let raf = 0;

    const ctx = gsap.context(() => {
      // Entrance. Hidden states are inline on the JSX so the first paint never
      // flashes the finished frame — these animate *to* the visible state.
      const entrance = gsap.timeline();
      entrance.to(".pl-mark", {
        opacity: 1,
        duration: DUR.fast,
        stagger: STAGGER.meta,
      });
      entrance.to(
        ".pl-meta-item",
        { opacity: 1, y: 0, duration: DUR.fast, stagger: STAGGER.meta },
        INTRO.marks
      );
      entrance.to(
        ".pl-name",
        { opacity: 1, yPercent: 0, duration: 0.8, ease: GSAP_EASE },
        INTRO.name
      );
      entrance.to(".pl-foot", { opacity: 1, duration: DUR.base }, 0.3);
      entrance.to(".pl-role", { opacity: 1, duration: DUR.base }, 0.35);

      // ---- progress ---------------------------------------------------------
      let shown = 0;
      let horizonFired = false;
      let exiting = false;
      const start = performance.now();

      // 3c fills the one-line name left→right; 6b stacks it to two lines and
      // fills top→bottom instead, because a horizontal wipe across a stacked
      // block reads as two unrelated wipes. Held as a MediaQueryList so `paint`
      // stays a property read rather than a re-evaluated query each frame.
      const stacked = window.matchMedia("(max-width: 639px)");

      const paint = (p: number) => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
        }
        if (fillRef.current) {
          const remaining = (1 - p) * 100;
          fillRef.current.style.clipPath = stacked.matches
            ? `inset(0 0 ${remaining}% 0)`
            : `inset(0 ${remaining}% 0 0)`;
        }
        if (hairlineRef.current) {
          hairlineRef.current.style.transform = `scaleX(${p})`;
        }
      };

      const exit = () => {
        if (exiting) return;
        exiting = true;
        cancelAnimationFrame(raf);
        paint(1);
        mark("hero");

        const tl = gsap.timeline({
          onComplete: () => {
            setGone(true);
            requestAnimationFrame(() => ScrollTrigger.refresh());
          },
        });

        tl.to(
          [".pl-meta", ".pl-foot", ".pl-mark", ".pl-role"],
          { opacity: 0, duration: DUR.micro, ease: "power1.out" },
          0
        );

        // The name leans toward the navbar mark as it dissolves — direction says
        // "hand-off", but the travel is capped so it never darts to a corner.
        tl.add(() => {
          const nameEl = rootRef.current?.querySelector<HTMLElement>(".pl-name");
          const target = document.getElementById("nav-mark");
          if (!nameEl || !target) {
            gsap.to(".pl-name", {
              yPercent: -70,
              opacity: 0,
              duration: 0.5,
              ease: "power2.in",
            });
            return;
          }
          const a = nameEl.getBoundingClientRect();
          const b = target.getBoundingClientRect();
          const dx = (b.left + b.width / 2 - (a.left + a.width / 2)) * 0.22;
          const dy = (b.top + b.height / 2 - (a.top + a.height / 2)) * 0.3;
          gsap.to(nameEl, {
            x: gsap.utils.clamp(-110, 110, dx),
            y: gsap.utils.clamp(-90, 90, dy),
            scale: 0.94,
            opacity: 0,
            transformOrigin: "50% 50%",
            duration: 0.55,
            ease: "power2.inOut",
          });
        }, 0.05);

        // Hand off as the curtain starts lifting so the beats overlap.
        tl.add(() => intro.complete(), 0.2);
        tl.to(
          ".pl-panel-main",
          { yPercent: -100, duration: INTRO.curtain, ease: GSAP_EASE_IN_OUT },
          0.2
        );
        tl.to(
          ".pl-panel-follow",
          { yPercent: -100, duration: INTRO.curtain, ease: GSAP_EASE_IN_OUT },
          0.2 + INTRO.curtainOffset
        );
      };

      const tick = (now: number) => {
        const elapsed = now - start;
        const assetsReady = (fontsReady && sceneReady) || elapsed >= MAX_MS;

        // While waiting, creep toward 92% on the clock so the number always
        // moves; once the real signals land the ceiling opens to 100.
        const ceiling = skipped || assetsReady ? 1 : Math.min(0.92, elapsed / MAX_MS);

        shown += (ceiling - shown) * (skipped ? 0.3 : 0.08);
        if (ceiling - shown < 0.004) shown = ceiling;
        paint(shown);

        if (!horizonFired && shown >= 0.7) {
          horizonFired = true;
          gsap.to(".pl-horizon", { opacity: 1, duration: 0.6, ease: "power2.out" });
          gsap.fromTo(
            ".pl-horizon",
            { yPercent: 14 },
            { yPercent: 0, duration: 1, ease: "power2.out" }
          );
        }

        if (shown >= 0.999 && (elapsed >= MIN_MS || skipped)) {
          exit();
          return;
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, rootRef);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      ctx.revert();
    };
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
        <Starfield density={0.00009} className="opacity-80" />
        <div className="pl-horizon absolute inset-0" style={{ opacity: 0 }}>
          <HorizonGlow variant="intro" className="opacity-90" />
        </div>

        {/* Registration marks — the frame the sequence is composed inside. */}
        {CORNERS.map((pos) => (
          <span
            key={pos}
            className={cn("pl-mark absolute h-3 w-3 border-foreground/25 sm:h-4 sm:w-4", pos)}
            style={{ opacity: 0 }}
          />
        ))}

        <div className="pl-meta relative flex flex-col gap-2 px-[2.125rem] pt-11 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-[4.5rem] sm:pt-16 sm:text-[11px]">
          {/* The name takes the slot the dateline used to hold — it's the one
              thing worth reading on a loading screen, and 6b only has room for
              two items. */}
          <span className="pl-meta-item" style={{ opacity: 0, transform: "translateY(8px)" }}>
            {PROFILE.name}
          </span>
          <span className="pl-meta-item" style={{ opacity: 0, transform: "translateY(8px)" }}>
            {PROFILE.locationShort} · {PROFILE.timezone}
          </span>
        </div>

        <div className="relative flex flex-1 flex-col justify-center px-[2.125rem] sm:px-[4.5rem]">
          <div
            className="pl-name relative select-none text-[clamp(3.25rem,8.6vw,7.5rem)] font-semibold leading-[0.94] tracking-tight"
            style={{ opacity: 0, transform: "translateY(40%)" }}
          >
            {/* Outline layer */}
            <span className="text-stroke-intro block">
              NAVDEEP <br className="sm:hidden" />
              BHANDERI
            </span>
            {/* Fill layer — clipped to the real progress value. 3c and 6b are
                both a plain clip against a static gradient; there is no light
                bar riding the edge, and adding one turned a wipe into a scan. */}
            <span
              ref={fillRef}
              className="pl-fill text-name-gradient absolute inset-0 block"
              style={{ clipPath: "inset(0 100% 0 0)" }}
            >
              NAVDEEP <br className="sm:hidden" />
              BHANDERI
            </span>
          </div>

          <div
            className="pl-role mt-9 flex items-center gap-4 sm:mt-11 sm:gap-5"
            style={{ opacity: 0 }}
          >
            <span className="whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.34em]">
              {PROFILE.title}
            </span>
            <span className="h-px flex-1 bg-border" />
            <span className="hidden whitespace-nowrap font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground sm:block">
              Frontend · Full-stack range
            </span>
          </div>
        </div>

        <div
          className="pl-foot relative flex items-end justify-between gap-6 px-[2.125rem] pb-[3.25rem] sm:px-[4.5rem] sm:pb-24"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col gap-2 font-mono text-[10px] tracking-[0.12em] text-muted-foreground sm:gap-2.5 sm:text-xs">
            {STEPS.map((step) => (
              <span key={step.id} className="flex items-center gap-3">
                <span
                  className={done[step.id] ? "text-emerald-400" : "text-muted-foreground"}
                >
                  {done[step.id] ? "✓" : "▸"}
                </span>
                <span className={done[step.id] ? "" : "text-foreground/85"}>
                  <span className="sm:hidden">{step.short}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </span>
              </span>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <span
              ref={counterRef}
              className="font-mono text-[clamp(3.875rem,11vw,6rem)] font-medium leading-[0.8] tracking-tight text-foreground [font-variant-numeric:tabular-nums]"
            >
              000
            </span>
            <span className="pb-1.5 font-mono text-xs tracking-[0.2em] text-muted-foreground sm:pb-2">
              %
            </span>
          </div>
        </div>

        {/* Floor rule: an unlit track the progress line is drawn along, so the
            bar reads as filling a meter rather than growing out of nothing. */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-foreground/[0.07]">
          <div
            ref={hairlineRef}
            className="pl-hairline h-px w-full origin-left bg-gradient-to-r from-foreground/25 to-foreground"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </div>
  );
}
