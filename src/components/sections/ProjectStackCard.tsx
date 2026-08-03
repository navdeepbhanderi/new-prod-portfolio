"use client";

import { useRef } from "react";
import { Link } from "next-view-transitions";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Code2 } from "lucide-react";
import type { Project } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProductMock } from "@/components/ui/ProductMock";
import { Tilt } from "@/components/ui/Tilt";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

function ProjectVisual({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  // Numeral drifts opposite the mock — two depths inside one card.
  const numeralY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <Link
      ref={ref}
      href={`/projects/${project.id}`}
      aria-label={`${project.title} — read the case study`}
      className="relative z-20 block"
      data-cursor="view"
      data-cursor-label="Open"
      // Shared element: morphs into the case-study hero visual on navigation.
      style={{ viewTransitionName: `project-${project.id}` }}
    >
      <Tilt max={5} className="rounded-2xl">
        {/* Height follows the mock so nothing clips on any screen; a min keeps
            short mocks card-like. Padding leaves room for the parallax drift. */}
        <GlassCard className="grid min-h-[13rem] place-items-center p-0 sm:min-h-[20rem]">
        <div aria-hidden className={cn("absolute inset-0 bg-gradient-to-br", project.accent)} />
        <motion.span
          style={{ y: numeralY }}
          className="absolute right-5 top-4 font-mono text-7xl font-bold text-foreground/[0.06]"
        >
          {project.index}
        </motion.span>
        <motion.div style={{ y }} className="relative flex items-center justify-center p-6 sm:p-8">
          <ProductMock project={project} size="sm" />
        </motion.div>
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

  // Card i settles at a slightly smaller scale the deeper it sits in the deck.
  const targetScale = 1 - (total - 1 - index) * 0.04;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const dim = useTransform(
    progress,
    [index / total, 1],
    [0, index === total - 1 ? 0 : 0.5]
  );

  // Sticky stacking + scale/dim scrub is the deck's signature on every screen.
  // The scale/dim is what makes the overlap read as an intentional stack; it
  // must run on mobile too, not just desktop. Reduced motion → plain flow.
  const scrub = !reduced;

  return (
    <div
      className={cn(scrub ? "sticky" : "relative", className)}
      style={scrub ? { top: `calc(9svh + ${index * 1.75}rem)` } : undefined}
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
    <div className="relative grid min-h-[86svh] grid-cols-1 content-center items-center gap-5 p-5 sm:min-h-[70svh] sm:gap-8 sm:p-10 lg:grid-cols-2 lg:gap-16 lg:p-14">
      <div className={cn(reversed && "lg:order-2")}>
        <ProjectVisual project={project} />
      </div>

      <div className={cn("flex flex-col gap-4 sm:gap-5", reversed && "lg:order-1")}>
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

        {/* Overview only — a short teaser. The full description, highlights,
            approach, and outcome all live in the case study. */}
        <p className="line-clamp-3 leading-relaxed text-muted-foreground">
          {project.description}
        </p>

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
