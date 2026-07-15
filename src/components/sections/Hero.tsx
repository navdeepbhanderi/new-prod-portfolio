"use client";

import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, FileText, MapPin } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { SOCIALS } from "@/data/socials";
import { BRAND_ICONS } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { CharReveal } from "@/components/ui/CharReveal";
import { SwapText } from "@/components/ui/SwapText";
import { fadeUpBlur, EASE_IN_OUT, EASE_OUT } from "@/lib/motion";
import { useIntroDone } from "@/lib/intro";
import { useMouseParallax } from "@/hooks/use-mouse-parallax";

export function Hero() {
  const done = useIntroDone();
  const state = done ? "visible" : "hidden";

  const pointer = useMouseParallax();
  // Three depths: background drifts opposite the cursor, copy barely,
  // portrait the most — parallax reads as depth, not decoration.
  const bgX = useTransform(pointer.x, (v) => v * -36);
  const bgY = useTransform(pointer.y, (v) => v * -26);
  const copyX = useTransform(pointer.x, (v) => v * 12);
  const copyY = useTransform(pointer.y, (v) => v * 8);
  const portraitX = useTransform(pointer.x, (v) => v * 22);
  const portraitY = useTransform(pointer.y, (v) => v * 16);
  const portraitRotateY = useTransform(pointer.x, (v) => v * 4);
  const portraitRotateX = useTransform(pointer.y, (v) => v * -4);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16"
    >
      {/* Background layers */}
      <motion.div
        aria-hidden
        style={{ x: bgX, y: bgY }}
        className="absolute -inset-10 -z-10"
      >
        <div className="absolute inset-0 bg-grid-lines mask-b opacity-60" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--accent)/0.12),transparent_60%)] blur-2xl" />
        <motion.div
          className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-foreground/[0.04] blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: EASE_IN_OUT }}
        />
        <motion.div
          className="absolute -right-10 bottom-1/4 h-80 w-80 rounded-full bg-accent/[0.05] blur-3xl"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: EASE_IN_OUT }}
        />
      </motion.div>

      <div className="container-px grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: copy */}
        <motion.div
          style={{ x: copyX, y: copyY }}
          className="flex flex-col items-start"
        >
          {/* Mobile-only portrait — the face shouldn't disappear below lg. */}
          <motion.div
            variants={fadeUpBlur(0.4, 16)}
            initial="hidden"
            animate={state}
            className="mb-6 lg:hidden"
          >
            <div className="glass relative h-24 w-24 overflow-hidden rounded-full p-1">
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <ProfileImage priority sizes="6rem" />
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUpBlur(0.5, 16)}
            initial="hidden"
            animate={state}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-3.5 py-1.5 text-xs text-muted-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Open to opportunities
            <span className="mx-1 h-3 w-px bg-border" />
            <MapPin className="h-3 w-3" />
            India
          </motion.div>

          {/* id="hero-name": the preloader measures this block and flies its
              own name into place here during the curtain lift. */}
          <div id="hero-name" data-cursor="invert">
            <CharReveal
              as="h1"
              text="Navdeep"
              label="Navdeep Bhanderi — Software Engineer"
              trigger="manual"
              play={done}
              stagger={0.045}
              charClassName="text-name-gradient"
              className="text-[clamp(3.5rem,11vw,8.5rem)] font-semibold leading-[0.95] tracking-tight"
            />
            {/* Surname as outlined display type — aria-hidden, the h1 label
                above already carries the full name for AT. Negative margin
                pulls the two lines into one typographic unit. */}
            <div aria-hidden>
              <CharReveal
                as="p"
                text="Bhanderi"
                trigger="manual"
                play={done}
                delay={0.35}
                stagger={0.035}
                charClassName="hero-surname-char"
                className="-mt-[0.08em] text-[clamp(3.5rem,11vw,8.5rem)] font-semibold leading-[0.95] tracking-tight"
              />
            </div>
          </div>

          <motion.p
            variants={fadeUpBlur(0.65, 16)}
            initial="hidden"
            animate={state}
            className="mt-7 max-w-xl text-fluid-lead leading-relaxed text-muted-foreground"
          >
            {PROFILE.tagline}
          </motion.p>

          <motion.div
            variants={fadeUpBlur(0.8, 16)}
            initial="hidden"
            animate={state}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Button asChild size="lg">
                <Link href="#projects" scroll={false}>
                  <SwapText>View Projects</SwapText>
                  <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-y-0.5" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild size="lg" variant="outline">
                <Link href="#contact" scroll={false}>
                  <SwapText>Contact Me</SwapText>
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </Link>
              </Button>
            </Magnetic>
            <Button asChild size="lg" variant="outline">
              <a href={PROFILE.resume} target="_blank" rel="noopener noreferrer">
                <SwapText>Resume</SwapText>
                <FileText className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5" />
              </a>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUpBlur(0.95, 16)}
            initial="hidden"
            animate={state}
            className="mt-10 flex items-center gap-4"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Follow
            </span>
            <span className="h-px w-8 bg-border" />
            <div className="flex items-center gap-2">
              {SOCIALS.map((social) => {
                const Icon = BRAND_ICONS[social.icon];
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Right: portrait */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.96, filter: "blur(12px)" },
            visible: {
              opacity: 1,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: 0.9, ease: EASE_OUT, delay: 0.95 },
            },
          }}
          initial="hidden"
          animate={state}
          className="relative mx-auto hidden w-full max-w-sm lg:block xl:max-w-md"
        >
          <motion.div
            style={{
              x: portraitX,
              y: portraitY,
              rotateX: portraitRotateX,
              rotateY: portraitRotateY,
              transformPerspective: 1000,
            }}
          >
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_50%_30%,hsl(var(--accent)/0.15),transparent_70%)] blur-xl" />
            <div className="glass relative aspect-[4/5] overflow-hidden rounded-[1.75rem] p-1.5">
              <div className="relative h-full w-full overflow-hidden rounded-[1.4rem]">
                <ProfileImage priority />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint — visible on all viewports, smaller on mobile */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: done ? 1 : 0 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: EASE_IN_OUT }}
          className="h-8 w-px bg-gradient-to-b from-foreground/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
