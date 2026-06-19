"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

function ProjectVisual({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <div ref={ref} className="relative">
      <GlassCard className="aspect-[4/3] p-0">
        <div className={cn("absolute inset-0 bg-gradient-to-br", project.accent)} />
        <motion.div style={{ y }} className="absolute inset-0 flex items-center justify-center p-8">
          {/* Stylised product mock */}
          <div className="glass-strong w-full max-w-md rounded-xl p-3 shadow-2xl shadow-black/40">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
              <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                {project.id}.app
              </span>
            </div>
            <div className="space-y-2.5">
              <div className="h-3 w-2/3 rounded-full bg-foreground/15" />
              <div className="h-3 w-full rounded-full bg-foreground/10" />
              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="h-12 rounded-lg bg-foreground/10" />
                <div className="h-12 rounded-lg bg-foreground/[0.07]" />
                <div className="h-12 rounded-lg bg-foreground/10" />
              </div>
              <div className="h-3 w-1/2 rounded-full bg-foreground/10" />
            </div>
          </div>
        </motion.div>
        <span className="absolute right-5 top-4 font-mono text-7xl font-bold text-foreground/[0.06]">
          {project.index}
        </span>
      </GlassCard>
    </div>
  );
}

function ProjectRow({ project, reversed }: { project: Project; reversed: boolean }) {
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
      <BlurReveal className={cn(reversed && "lg:order-2")}>
        <ProjectVisual project={project} />
      </BlurReveal>

      <div className={cn("flex flex-col gap-5", reversed && "lg:order-1")}>
        <BlurReveal>
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-foreground/80">{project.index}</span>
            <span className="h-px w-6 bg-border" />
            <span>{project.year}</span>
            <span className="h-px w-6 bg-border" />
            <span>{project.role}</span>
          </div>
        </BlurReveal>

        <BlurReveal delay={0.05}>
          <h3 className="text-fluid-h3 font-semibold tracking-tight">{project.title}</h3>
          <p className="mt-1 text-lg text-muted-foreground">{project.tagline}</p>
        </BlurReveal>

        <BlurReveal delay={0.1}>
          <p className="leading-relaxed text-muted-foreground">{project.description}</p>
        </BlurReveal>

        <BlurReveal delay={0.15}>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2.5 text-sm text-foreground/85">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-foreground/10">
                  <Check className="h-2.5 w-2.5" />
                </span>
                {h}
              </li>
            ))}
          </ul>
        </BlurReveal>

        <BlurReveal delay={0.2}>
          <div className="mt-1 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </BlurReveal>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-px">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Selected Work"
            title="Projects built like products"
            description="Each one is a small case study — the problem, the approach, and what makes it work."
          />
          <BlurReveal>
            <span className="hidden items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline-flex">
              <ArrowUpRight className="h-4 w-4" /> 02 featured
            </span>
          </BlurReveal>
        </div>

        <div className="mt-16 flex flex-col gap-24 lg:gap-32">
          {PROJECTS.map((project, i) => (
            <ProjectRow key={project.id} project={project} reversed={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
