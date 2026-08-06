"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { SOCIALS } from "@/data/socials";
import { BRAND_ICONS } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { TextReveal } from "@/components/ui/TextReveal";
import { SwapText } from "@/components/ui/SwapText";
import { fadeUpBlur } from "@/lib/motion";
import { useIntroDone } from "@/lib/intro";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/** Portrait scrims — the fade axis differs per layout (top band vs column). */
const SCRIM_BAND =
  "bg-[linear-gradient(to_bottom,hsl(var(--background)/0.72)_0%,hsl(var(--background)/0.12)_30%,hsl(var(--background)/0.55)_68%,hsl(var(--background))_100%)]";
const SCRIM_COLUMN =
  "md:bg-[linear-gradient(to_right,hsl(var(--background))_0%,hsl(var(--background)/0.86)_9%,hsl(var(--background)/0.34)_24%,hsl(var(--background)/0.04)_46%,hsl(var(--background)/0.06)_78%,hsl(var(--background)/0.3)_100%)]";
const SCRIM_FLOOR =
  "md:bg-[linear-gradient(to_top,hsl(var(--background))_0%,transparent_34%)]";

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
        {label}
      </span>
      <span className="text-[15px] leading-snug text-foreground/85 sm:text-base">
        {children}
      </span>
    </div>
  );
}

export function Hero() {
  const done = useIntroDone();
  const state = done ? "visible" : "hidden";
  const reduced = usePrefersReducedMotion();

  // MotionConfig strips transforms under reduced motion but keeps delays —
  // collapse them so the hero isn't blank while an invisible stagger plays.
  const at = (delay: number) => (reduced ? 0 : delay);

  const pointer = useMouseParallax();
  // Three parallax depths: background drifts opposite the cursor, copy
  // barely, portrait the most.
  const bgX = useTransform(pointer.x, (v) => v * -36);
  const bgY = useTransform(pointer.y, (v) => v * -26);
  const copyX = useTransform(pointer.x, (v) => v * 12);
  const copyY = useTransform(pointer.y, (v) => v * 8);
  const portraitX = useTransform(pointer.x, (v) => v * 22);
  const portraitY = useTransform(pointer.y, (v) => v * 16);

  // Exit: as the hero scrolls out, copy and portrait drift up at different
  // rates while fading.
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const copyExitY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyExitOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const portraitExitY = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const portraitExitOpacity = useTransform(scrollYProgress, [0.05, 0.85], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* ---------- atmosphere ---------- */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { x: bgX, y: bgY }}
        className="absolute -inset-10 -z-10"
      >
        <div className="absolute inset-0 bg-grid-lines mask-b opacity-60" />
        {/* Static — the pointer parallax on this layer supplies the movement. */}
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-foreground/[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[520px] w-[1100px] -translate-x-1/2 translate-y-1/3 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--accent)/0.16),transparent_65%)] blur-3xl" />
      </motion.div>

      {/* ---------- portrait: top band below md, full-bleed column at md+ ---------- */}
      <motion.div
        style={reduced ? undefined : { y: portraitExitY, opacity: portraitExitOpacity }}
        className="pointer-events-none absolute inset-x-0 top-0 h-[clamp(15rem,45svh,25rem)] md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-[38vw] xl:w-[34vw]"
      >
        <motion.div
          style={reduced ? undefined : { x: portraitX, y: portraitY }}
          className="relative h-full w-full"
        >
          <ProfileImage
            priority
            tone
            objectPosition="50% 16%"
            sizes="(min-width: 1280px) 34vw, (min-width: 768px) 38vw, 100vw"
            className="md:[object-position:50%_20%]"
          />
          <div aria-hidden className={`absolute inset-0 ${SCRIM_BAND} ${SCRIM_COLUMN}`} />
          <div aria-hidden className={`absolute inset-0 ${SCRIM_FLOOR}`} />
        </motion.div>
      </motion.div>

      {/* ---------- content ---------- */}
      {/* pt overlaps the portrait band so the copy starts in the scrim's dark
          floor. */}
      <div className="container-px relative z-10 flex min-h-[100svh] flex-col pb-8 pt-[clamp(11.5rem,35.5svh,19.5rem)] md:pb-12 md:pt-28 lg:pb-14">
        <motion.div
          style={reduced ? undefined : { y: copyExitY, opacity: copyExitOpacity }}
          className="flex flex-1 flex-col justify-center"
        >
          <motion.div
            style={reduced ? undefined : { x: copyX, y: copyY }}
            className="flex flex-col items-start md:max-w-[56%] lg:max-w-[52%] xl:max-w-[46rem]"
          >
            <div data-cursor="invert">
              <TextReveal
                as="h1"
                text={PROFILE.claim}
                trigger="manual"
                play={done}
                stagger={at(0.055)}
                delay={at(0.15)}
                className="max-w-[17ch] text-balance text-[clamp(2.375rem,6.4vw,5.75rem)] font-semibold leading-[1] tracking-[-0.034em]"
              />
            </div>

            <motion.p
              variants={fadeUpBlur(at(0.75), 16)}
              initial="hidden"
              animate={state}
              className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg"
            >
              <span className="text-foreground/85">
                {PROFILE.name} — {PROFILE.title} at {PROFILE.companyShort}.
              </span>{" "}
              {PROFILE.byline}
            </motion.p>

            <motion.div
              variants={fadeUpBlur(at(0.9), 16)}
              initial="hidden"
              animate={state}
              className="mt-6 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center"
            >
              <Magnetic className="w-full sm:w-auto">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="#projects" scroll={false}>
                    <SwapText>View projects</SwapText>
                    <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic className="w-full sm:w-auto">
                <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                  <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer">
                    <SwapText>View resume</SwapText>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                  </a>
                </Button>
              </Magnetic>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ---------- fact ledger, pinned to the floor on a hairline ---------- */}
        <motion.div
          variants={fadeUpBlur(at(1.05), 16)}
          initial="hidden"
          animate={state}
          className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-foreground/[0.12] pt-4 sm:mt-10 sm:gap-x-10 sm:gap-y-6 sm:pt-5 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-end lg:gap-10 lg:pt-7"
        >
          <Fact label="Currently">{PROFILE.currently}</Fact>
          <Fact label="Core stack">{PROFILE.coreStack.join(" · ")}</Fact>
          <Fact label="Available">
            <span className="inline-flex items-center gap-2.5">
              <span className="relative flex h-[7px] w-[7px]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-emerald-400" />
              </span>
              Open to opportunities
            </span>
          </Fact>
          <div className="flex items-center gap-2 lg:justify-end">
            {SOCIALS.map((social) => {
              const Icon = BRAND_ICONS[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-foreground/[0.18] bg-foreground/[0.06] text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
