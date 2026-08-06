"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { SOCIALS } from "@/data/socials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ParallaxNumeral } from "@/components/ui/ParallaxNumeral";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { SwapText } from "@/components/ui/SwapText";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import {
  StackCard,
  ProjectCardContent,
} from "@/components/sections/ProjectStackCard";

const GITHUB = SOCIALS.find((s) => s.icon === "github")?.href ?? "#";

const pad = (n: number) => String(n).padStart(2, "0");

/** Deck position indicator, driven off the deck's scroll progress. */
function DeckRail({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const TRACK = 72;
  const thumb = TRACK / total;
  const y = useTransform(progress, [0, 1], [0, TRACK - thumb]);

  return (
    <div className="pointer-events-none absolute inset-y-0 -right-7 hidden w-6 xl:block">
      <div className="sticky top-[42svh] flex flex-col items-center gap-2.5">
        <span className="font-mono text-[10px] tracking-[0.2em] text-foreground">
          {pad(1)}
        </span>
        <span
          aria-hidden
          className="relative w-0.5 rounded-full bg-border"
          style={{ height: TRACK }}
        >
          <motion.span
            style={{ y, height: thumb }}
            className="absolute inset-x-0 top-0 block rounded-full bg-foreground"
          />
        </span>
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
          {pad(total)}
        </span>
      </div>
    </div>
  );
}

function ArchiveCardContent({ index }: { index: string }) {
  return (
    // Matches the project cards' 68svh so the whole deck is one height below lg.
    <div className="relative flex min-h-[68svh] flex-col items-center justify-center gap-8 p-6 text-center sm:p-10 lg:min-h-[60svh] lg:p-14">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
        {index} — The archive
      </span>
      <span
        aria-hidden
        className="text-stroke-strong block font-mono text-[clamp(4.5rem,16vw,12rem)] font-bold leading-none"
      >
        MORE
      </span>
      <p className="max-w-md text-muted-foreground">
        Experiments, hackathon builds, and works in progress — the rest of the
        story lives on GitHub.
      </p>
      <Magnetic>
        <Button asChild size="lg">
          <a href={GITHUB} target="_blank" rel="noopener noreferrer">
            <SwapText>Explore GitHub</SwapText>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
          </a>
        </Button>
      </Magnetic>
    </div>
  );
}

export function Projects() {
  const stackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  const total = PROJECTS.length + 1;

  return (
    <section id="projects" className="relative scroll-mt-24 py-24 sm:py-32">
      <ParallaxNumeral value="02" className="right-2 top-10" />
      <div className="container-px">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Selected work"
            title="Projects built *like products*"
            description="Each one is a small case study — the problem, the approach, and what makes it work."
          />
          <BlurReveal>
            <span className="hidden whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground sm:block">
              {pad(PROJECTS.length)} featured · 1 archive
            </span>
          </BlurReveal>
        </div>

        <div className="relative mt-16">
          {!reduced && <DeckRail progress={scrollYProgress} total={total} />}
          <div ref={stackRef} className="flex flex-col gap-[14vh] pb-[8svh]">
            {PROJECTS.map((project, i) => (
              <StackCard
                key={project.id}
                index={i}
                total={total}
                progress={scrollYProgress}
              >
                <ProjectCardContent project={project} />
              </StackCard>
            ))}
            <StackCard index={total - 1} total={total} progress={scrollYProgress}>
              <ArchiveCardContent index={pad(total)} />
            </StackCard>
          </div>
        </div>
      </div>
    </section>
  );
}
