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

/** The visual bleeds to the card's edge and clips at the bottom. */
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
      className="group relative z-20 block min-h-[10rem] overflow-hidden sm:min-h-[17rem] lg:min-h-[28.5rem]"
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
        className="absolute inset-x-4 top-5 sm:inset-x-9 sm:top-10 lg:left-[3.25rem] lg:right-12 lg:top-[3.25rem]"
      >
        <ProductMock
          project={project}
          // The card already states the metrics on its own strip.
          metrics={false}
          className="max-w-none transition-transform duration-700 ease-out-quart group-hover:scale-[1.02]"
        />
      </motion.div>
    </Link>
  );
}

function Metrics({ project }: { project: Project }) {
  const metrics = project.diagram?.metrics;
  if (!metrics?.length) return null;
  return (
    <div className="mt-3.5 grid grid-cols-3 gap-4 border-y border-border py-3 sm:mt-6 sm:gap-5 sm:py-5">
      {metrics.map((metric) => (
        <div key={metric.label} className="flex flex-col gap-1.5">
          <span className="text-[17px] font-semibold tracking-tight sm:text-[1.375rem]">
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
      // The per-card offset is a depth cue for the wide deck; below lg every
      // card pins at the same 9svh so the CTA stays on screen.
      className={cn(
        scrub ? "sticky top-[9svh] lg:top-[var(--stack-top)]" : "relative",
        className
      )}
      style={
        scrub
          ? ({ "--stack-top": `calc(9svh + ${index * 1.75}rem)` } as React.CSSProperties)
          : undefined
      }
    >
      <motion.div
        // Framer only sets will-change for running animations, not
        // scroll-linked values — without the hint the card re-rasterises
        // every frame instead of compositing.
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

      {/* Compact below sm: the card pins under the deck's sticky top, so on a
          phone everything above the CTA has to fit inside one short viewport.
          The description and stack chips only render from sm up — the tagline
          carries the hook and the stack lives in the case study. */}
      <div className="relative z-20 flex flex-col p-4 sm:p-8 lg:p-[3.25rem]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
          <span className="text-foreground/85">{project.index}</span>
          <span aria-hidden className="h-px w-5 bg-border" />
          <span>{project.year}</span>
          <span aria-hidden className="h-px w-5 bg-border" />
          <span>{project.role}</span>
        </div>

        <h3 className="mt-3 text-2xl font-semibold leading-[1.1] tracking-tight sm:mt-5 sm:text-[clamp(1.75rem,3.4vw,2.625rem)] sm:leading-[1.06]">
          {project.title}
        </h3>
        <p className="mt-2 text-[15px] text-foreground/75 sm:mt-3 sm:text-lg">
          {project.tagline}
        </p>

        {/* Overview only — the full story lives in the case study. */}
        <p className="hidden text-base leading-relaxed text-muted-foreground sm:mt-5 sm:line-clamp-4 sm:block">
          {project.description}
        </p>

        <Metrics project={project} />

        <div className="hidden flex-wrap gap-2 sm:mt-5 sm:flex">
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
        <div className="relative z-20 mt-auto flex items-center gap-2.5 pt-4 sm:pt-7">
          <Button asChild size="lg" className="h-12 flex-1 sm:h-14 sm:flex-none">
            <Link href={`/projects/${project.id}`}>
              Read case study
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </Link>
          </Button>
          {project.links?.live && (
            <Button asChild size="lg" variant="outline" className="h-12 sm:h-14">
              <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                Live demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.links?.repo && (
            <Button
              asChild
              size="icon"
              variant="outline"
              className="h-12 w-12 shrink-0 sm:h-14 sm:w-14"
            >
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
