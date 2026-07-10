"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import { SOCIALS } from "@/data/socials";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ParallaxNumeral } from "@/components/ui/ParallaxNumeral";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { SwapText } from "@/components/ui/SwapText";
import {
  StackCard,
  ProjectCardContent,
} from "@/components/sections/ProjectStackCard";

const GITHUB = SOCIALS.find((s) => s.icon === "github")?.href ?? "#";

function ArchiveCardContent({ index }: { index: string }) {
  return (
    <div className="relative flex min-h-[60svh] flex-col items-center justify-center gap-8 p-6 text-center sm:p-10 lg:p-14">
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
            eyebrow="Selected Work"
            title="Projects built like products"
            description="Each one is a small case study — the problem, the approach, and what makes it work."
          />
          <BlurReveal>
            <span className="hidden items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
              <ArrowUpRight className="h-4 w-4" /> {String(PROJECTS.length).padStart(2, "0")} featured
            </span>
          </BlurReveal>
        </div>

        <div ref={stackRef} className="mt-16 flex flex-col gap-[14vh] pb-[8svh]">
          {PROJECTS.map((project, i) => (
            <StackCard
              key={project.id}
              index={i}
              total={total}
              progress={scrollYProgress}
            >
              <ProjectCardContent project={project} reversed={i % 2 === 1} />
            </StackCard>
          ))}
          <StackCard index={total - 1} total={total} progress={scrollYProgress}>
            <ArchiveCardContent
              index={String(total).padStart(2, "0")}
            />
          </StackCard>
        </div>
      </div>
    </section>
  );
}
