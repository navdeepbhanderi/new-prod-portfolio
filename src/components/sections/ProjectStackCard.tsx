"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Check, Code2 } from "lucide-react";
import type { Project } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { Tilt } from "@/components/ui/Tilt";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/use-media-query";

function ProjectVisual({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <Link
      ref={ref}
      href={`/projects/${project.id}`}
      aria-label={`${project.title} — read the case study`}
      className="relative z-20 block"
      data-cursor="view"
      data-cursor-label="Open"
    >
      <Tilt max={5} className="rounded-2xl">
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
      </Tilt>
    </Link>
  );
}

type StackCardProps = {
  index: number;
  total: number;
  /** 0→1 progress of the whole stack container. */
  progress: MotionValue<number>;
  children: React.ReactNode;
  className?: string;
};

/**
 * One card of the sticky stacking deck. Cards pin at the top of the viewport
 * and each is gently scaled + dimmed as the next one slides over it.
 */
export function StackCard({ index, total, progress, children, className }: StackCardProps) {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Card i settles at a slightly smaller scale the deeper it sits in the deck.
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const dim = useTransform(
    progress,
    [index / total, 1],
    [0, index === total - 1 ? 0 : 0.5]
  );

  const scrub = isDesktop && !reduced;

  return (
    <div
      className={cn(reduced ? "relative" : "sticky", className)}
      style={reduced ? undefined : { top: `calc(9svh + ${index * 1.75}rem)` }}
    >
      <motion.div
        style={scrub ? { scale, transformOrigin: "center top" } : undefined}
        className="relative overflow-hidden rounded-[2rem] border border-border bg-background"
      >
        {/* Opaque base tint so stacked cards never bleed through each other. */}
        <div aria-hidden className="absolute inset-0 bg-foreground/[0.02]" />
        {children}
        <motion.div
          aria-hidden
          style={scrub ? { opacity: dim } : { opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-10 bg-background"
        />
      </motion.div>
    </div>
  );
}

/** The full project card content — visual + copy, two columns on desktop. */
export function ProjectCardContent({
  project,
  reversed,
}: {
  project: Project;
  reversed: boolean;
}) {
  return (
    <div className="relative grid min-h-[70svh] grid-cols-1 content-center items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
      <div className={cn(reversed && "lg:order-2")}>
        <ProjectVisual project={project} />
      </div>

      <div className={cn("flex flex-col gap-5", reversed && "lg:order-1")}>
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="text-foreground/80">{project.index}</span>
          <span className="h-px w-6 bg-border" />
          <span>{project.year}</span>
          <span className="h-px w-6 bg-border" />
          <span>{project.role}</span>
        </div>

        <div>
          <h3 className="text-fluid-h3 font-semibold tracking-tight">{project.title}</h3>
          <p className="mt-1 text-lg text-muted-foreground">{project.tagline}</p>
        </div>

        <p className="leading-relaxed text-muted-foreground">{project.description}</p>

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

        {/* Explicit z: interactive elements must win hit-testing inside the
            scaled card shell (its transform reorders paint layers). */}
        <div className="relative z-20 mt-2 flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link href={`/projects/${project.id}`}>
              Read case study
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
          {project.links?.live && (
            <Button asChild size="sm" variant="outline">
              <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                Live demo
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          {project.links?.repo && (
            <Button asChild size="sm" variant="outline">
              <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
                <Code2 className="h-3.5 w-3.5" />
                View code
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
