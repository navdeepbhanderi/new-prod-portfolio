"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, MapPin } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { SOCIALS } from "@/data/socials";
import { BRAND_ICONS } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { ProfileImage } from "@/components/ui/ProfileImage";
import { EASE_OUT } from "@/lib/motion";

const fade = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT, delay: 0.2 + i * 0.1 },
  }),
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16"
    >
      {/* Background layers */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-lines mask-b opacity-60" />
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(230_60%_50%/0.12),transparent_60%)] blur-2xl" />
        <motion.div
          className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-foreground/[0.04] blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-10 bottom-1/4 h-80 w-80 rounded-full bg-accent/[0.05] blur-3xl"
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container-px grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
        {/* Left: copy */}
        <div className="flex flex-col items-start">
          <motion.div
            custom={0}
            variants={fade}
            initial="hidden"
            animate="visible"
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-3.5 py-1.5 text-xs text-muted-foreground"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for opportunities
            <span className="mx-1 h-3 w-px bg-border" />
            <MapPin className="h-3 w-3" />
            India
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
          >
            <h1 className="text-name-gradient text-[clamp(3rem,7vw,5rem)] font-semibold leading-[0.95] tracking-tight">
              Navdeep
            </h1>
          </motion.div>

          <motion.p
            custom={3}
            variants={fade}
            initial="hidden"
            animate="visible"
            className="mt-7 max-w-xl text-fluid-lead leading-relaxed text-muted-foreground"
          >
            {PROFILE.tagline}{" "}
            <span className="text-foreground/90">
              Software Engineer based in India.
            </span>
          </motion.p>

          <motion.div
            custom={4}
            variants={fade}
            initial="hidden"
            animate="visible"
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Magnetic>
              <Button asChild size="lg">
                <Link href="#projects" scroll={false}>
                  View Projects
                  <ArrowDown className="h-4 w-4" />
                </Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild size="lg" variant="outline">
                <Link href="#contact" scroll={false}>
                  Contact Me
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </Magnetic>
          </motion.div>

          <motion.div
            custom={5}
            variants={fade}
            initial="hidden"
            animate="visible"
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
        </div>

        {/* Right: portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.4 }}
          className="relative mx-auto hidden w-full max-w-sm lg:block"
        >
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-[radial-gradient(circle_at_50%_30%,hsl(230_60%_50%/0.15),transparent_70%)] blur-xl" />
          <div className="glass relative aspect-[4/5] overflow-hidden rounded-[1.75rem] p-1.5">
            <div className="relative h-full w-full overflow-hidden rounded-[1.4rem]">
              <ProfileImage priority />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
            </div>
          </div>
          <div className="glass absolute -bottom-4 -left-4 rounded-2xl px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Focus
            </p>
            <p className="text-sm font-medium">Full-stack development</p>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground md:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-gradient-to-b from-foreground/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
