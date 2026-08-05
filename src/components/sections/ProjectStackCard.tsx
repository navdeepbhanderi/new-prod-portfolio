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
import { ProductMock } from "@/components/ui/ProductMock";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/**
 * The visual bleeds to the card's edge — no inner card, no padding. The mock
 * is deliberately clipped at the bottom so it reads as a window onto a real
 * product rather than a framed thumbnail.
 */
function ProjectVisual({ project }: { project: Project }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  // Numeral drifts opposite the mock — two depths inside one card.
  const numeralY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <Link
      ref={ref}
      href={`/projects/${project.id}`}
      aria-label={`${project.title} — read the case study`}
      className="group relative z-20 block min-h-[12rem] overflow-hidden sm:min-h-[17rem] lg:min-h-[28.5rem]"
      data-cursor="view"
      data-cursor-label="Open"
      // Shared element: morphs into the case-study banner on navigation.
      style={{ viewTransitionName: `project-${project.id}` }}
    >
      <div
        aria-hidden
        className={cn("absolute inset-0 bg-gradient-to-br", project.accent)}
      />
      <motion.span
        aria-hidden
        style={reduced ? undefined : { y: numeralY }}
        className="absolute right-5 top-2 font-mono text-[clamp(3.25rem,6vw,5.125rem)] font-bold leading-none text-foreground/[0.07] sm:right-7"
      >
        {project.index}
      </motion.span>
      <motion.div
        style={reduced ? undefined : { y }}
        className="absolute inset-x-5 top-6 sm:inset-x-9 sm:top-10 lg:left-[3.25rem] lg:right-12 lg:top-[3.25rem]"
      >
        <ProductMock
          project={project}
          // The card states the metrics on its own hairline strip — repeating
          // them inside the mock says the same thing twice.
          metrics={false}
          className="max-w-none transition-transform duration-700 ease-out-quart group-hover:scale-[1.02]"
        />
      </motion.div>
    </Link>
  );
}

/** Honest numbers, on hairlines — the card's proof layer. */
function Metrics({ project }: { project: Project }) {
  const metrics = project.diagram?.metrics;
  if (!metrics?.length) return null;
  return (
    <div className="mt-6 grid grid-cols-3 gap-4 border-y border-border py-5 sm:gap-5">
      {metrics.map((metric) => (
        <div key={metric.label} className="flex flex-col gap-1.5">
          <span className="text-lg font-semibold tracking-tight sm:text-[1.375rem]">
            {metric.value}
          </span>
          <span className="font-mono text-[8.5px] uppercase leading-tight tracking-[0.18em] text-muted-foreground sm:text-[9.5px] sm:tracking-[0.2em]">
            {metric.label}
          </span>
        </div>
      ))}
    </div>
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
  // Reduced motion → plain flow.
  const scrub = !reduced;

  return (
    <div
      className={cn(scrub ? "sticky" : "relative", className)}
      style={scrub ? { top: `calc(9svh + ${index * 1.75}rem)` } : undefined}
    >
      <motion.div
        // `will-change` is normally framer's job, but it only sets it for
        // running animations — a scroll-linked motion value doesn't qualify, so
        // the card re-rasterised its whole surface every frame instead of
        // compositing. This one hint took p95 from 133ms to 50ms.
        style={
          scrub
            ? { scale, transformOrigin: "center top", willChange: "transform" }
            : undefined
        }
        className="relative overflow-hidden rounded-[1.75rem] border border-border bg-[hsl(240_6%_5%)] sm:rounded-[2rem]"
      >
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

/** The full project card — visual bleeding left, the case for it on the right. */
export function ProjectCardContent({ project }: { project: Project }) {
  return (
    <div className="grid lg:grid-cols-[1.05fr_1fr]">
      <ProjectVisual project={project} />

      <div className="relative z-20 flex flex-col p-5 sm:p-8 lg:p-[3.25rem]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
          <span className="text-foreground/85">{project.index}</span>
          <span aria-hidden className="h-px w-5 bg-border" />
          <span>{project.year}</span>
          <span aria-hidden className="h-px w-5 bg-border" />
          <span>{project.role}</span>
        </div>

        <h3 className="mt-4 text-[clamp(1.75rem,3.4vw,2.625rem)] font-semibold leading-[1.06] tracking-tight sm:mt-5">
          {project.title}
        </h3>
        <p className="mt-2.5 text-base text-foreground/75 sm:mt-3 sm:text-lg">
          {project.tagline}
        </p>

        {/* Overview only — the full story lives in the case study. */}
        <p className="mt-4 line-clamp-4 leading-relaxed text-muted-foreground sm:mt-5">
          {project.description}
        </p>

        <Metrics project={project} />

        <div className="mt-5 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Explicit z: interactive elements must win hit-testing inside the
            scaled card shell (its transform reorders paint layers). */}
        <div className="relative z-20 mt-auto flex items-center gap-2.5 pt-7">
          <Button asChild size="lg" className="flex-1 sm:flex-none">
            <Link href={`/projects/${project.id}`}>
              Read case study
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
          {project.links?.live && (
            <Button asChild size="lg" variant="outline">
              <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                Live demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.links?.repo && (
            <Button asChild size="icon" variant="outline" className="h-14 w-14 shrink-0">
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} — view the code`}
              >
                <Code2 className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
