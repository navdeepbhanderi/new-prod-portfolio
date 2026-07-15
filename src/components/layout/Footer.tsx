"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { SOCIALS } from "@/data/socials";
import { BRAND_ICONS } from "@/components/icons";
import { Magnetic } from "@/components/ui/MagneticButton";
import { Starfield } from "@/components/ui/Starfield";
import { HorizonGlow } from "@/components/ui/HorizonGlow";
import { useMounted } from "@/hooks/use-mounted";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useLenis } from "@/components/layout/SmoothScroll";

const NAME = PROFILE.firstName.toUpperCase();

function LocalTime() {
  const mounted = useMounted();
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!mounted) return;
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [mounted]);

  // Render a same-width invisible placeholder until the clock is live so the
  // justify-between row doesn't reflow when the time pops in.
  return (
    <span
      className={cn(
        "font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground",
        !time && "invisible"
      )}
    >
      Junagadh, IN · {time || "00:00"} IST
    </span>
  );
}

/**
 * Sticky-bottom uncover: <main> (opaque, z-10) lifts away as the page ends,
 * revealing this footer beneath it. Pure CSS positioning — degrades to a
 * normal footer without JS; only the inner "settle" drift is scripted.
 */
export function Footer() {
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const lenis = useLenis();

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { yPercent: -10, opacity: 0.55 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            start: () => ScrollTrigger.maxScroll(window) - window.innerHeight * 0.7,
            end: "max",
            scrub: 0.4,
          },
        }
      );
    }, inner);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <footer className="sticky bottom-0 z-0 overflow-hidden md:h-[78svh]">
      {/* Deep-space backdrop: twinkling stars over an event-horizon arc. */}
      <div aria-hidden className="absolute inset-0">
        <Starfield density={0.00012} />
        <HorizonGlow />
      </div>

      <div
        ref={innerRef}
        className="relative flex h-full flex-col justify-end gap-10 pb-32 pt-16 md:gap-0 md:pb-8"
      >
        <div className="container-px flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {PROFILE.headline}
          </span>
          <Link
            href={pathname === "/" ? "#hero" : "#top"}
            scroll={false}
            onClick={scrollToTop}
            aria-label={`${PROFILE.name} — back to top`}
            className="group flex select-none"
          >
            {Array.from(NAME).map((char, i) => (
              <span
                key={i}
                aria-hidden
                className="text-horizon-lit inline-block text-[clamp(3.5rem,14vw,13rem)] font-semibold leading-none tracking-tight transition-colors duration-300 hover:text-foreground"
              >
                {char}
              </span>
            ))}
          </Link>
          {/* Over the starfield the standard border/muted treatment vanishes —
              these need a filled glass disc and brighter strokes to read. */}
          <div className="mt-2 flex items-center gap-3">
            {SOCIALS.map((social) => {
              const Icon = BRAND_ICONS[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-foreground/15 bg-foreground/[0.06] text-foreground/80 backdrop-blur-sm transition-all duration-300 hover:border-foreground/40 hover:bg-foreground/10 hover:text-foreground"
                >
                  <Icon className="h-[1.1rem] w-[1.1rem]" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right padding keeps "Back to top" clear of the floating chat button. */}
        <div className="container-px flex flex-col items-center justify-between gap-6 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row sm:gap-4 sm:pt-6 md:pr-56">
          <p>© {new Date().getFullYear()} {PROFILE.name}. Built with Next.js.</p>
          <LocalTime />
          <Magnetic>
            <Link
              href={pathname === "/" ? "#hero" : "#top"}
              scroll={false}
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              Back to top <ArrowUp className="h-3.5 w-3.5" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </footer>
  );
}
