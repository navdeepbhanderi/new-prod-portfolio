"use client";

import { useRef } from "react";
import { Link } from "next-view-transitions";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Code2 } from "lucide-react";
import type { Project } from "@/types";
import { PROJECTS } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { CharReveal } from "@/components/ui/CharReveal";
import { ProductMock } from "@/components/ui/ProductMock";
import { ReadingRail } from "@/components/case-study/ReadingRail";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.26em] text-muted-foreground">
      <span className="h-px w-5 bg-foreground/30" aria-hidden />
      {children}
    </span>
  );
}

function Block({
  id,
  eyebrow,
  children,
  divided = true,
}: {
  /** Anchor for the reading rail. */
  id: string;
  eyebrow: string;
  children: React.ReactNode;
  divided?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-28", divided && "border-t border-border/60 pt-9")}
    >
      <BlurReveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </BlurReveal>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function FactsRail({ project }: { project: Project }) {
  const hasLinks = Boolean(project.links?.live || project.links?.repo);
  return (
    <BlurReveal>
      <dl className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-1">
          <div>
            <dt className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
              Year
            </dt>
            <dd className="mt-2 text-[15px] text-foreground/85">{project.year}</dd>
          </div>
          <div>
            <dt className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
              Role
            </dt>
            <dd className="mt-2 text-[15px] text-foreground/85">{project.role}</dd>
          </div>
        </div>
        <div>
          <dt className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
            Stack
          </dt>
          <dd className="mt-2.5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </dd>
        </div>

        {/* Desktop only — on phones these live in the sticky bar at the foot. */}
        {hasLinks && (
          <div className="hidden flex-col gap-2.5 border-t border-border pt-6 lg:flex">
            {project.links?.live && (
              <Button asChild>
                <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                  Live demo
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                </a>
              </Button>
            )}
            {project.links?.repo && (
              <Button asChild variant="outline">
                <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
                  <Code2 className="h-4 w-4" />
                  View code
                </a>
              </Button>
            )}
          </div>
        )}
      </dl>
    </BlurReveal>
  );
}

export function CaseStudy({
  project,
  next,
}: {
  project: Project;
  next: Project;
}) {
  const { caseStudy } = project;
  const bannerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const position = PROJECTS.findIndex((p) => p.id === project.id) + 1;
  const hasLinks = Boolean(project.links?.live || project.links?.repo);

  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ["start start", "end start"],
  });
  const mockY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <article className="relative">
      <ReadingRail />

      {/* ---------- cinematic banner, title set into it ---------- */}
      <header
        ref={bannerRef}
        className="relative h-[clamp(21rem,52svh,37.5rem)] overflow-hidden"
        // Shared element: the deck card's visual morphs into this banner.
        style={{ viewTransitionName: `project-${project.id}` }}
      >
        <div
          aria-hidden
          className={cn("absolute inset-0 bg-gradient-to-br", project.accent)}
        />
        <div aria-hidden className="absolute inset-0 bg-grid-lines opacity-70" />

        <motion.div
          aria-hidden
          style={reduced ? undefined : { y: mockY }}
          className="absolute right-14 top-[9.5rem] hidden w-[32.5rem] lg:block"
        >
          <ProductMock project={project} size="lg" className="max-w-none" />
        </motion.div>

        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-background via-background/60 to-transparent"
        />

        <div className="container-px absolute inset-x-0 top-24 flex items-center justify-between gap-4 sm:top-28">
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2.5 rounded-full border border-foreground/[0.16] bg-background/40 px-4 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-foreground/85 backdrop-blur-md transition-colors hover:border-foreground/35 hover:text-foreground lg:border-transparent lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            All projects
          </Link>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
            Case study {pad(position)} / {pad(PROJECTS.length)}
          </span>
        </div>

        <div className="container-px absolute inset-x-0 bottom-9 z-[1] sm:bottom-11">
          <BlurReveal>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-foreground/70">
              <span className="text-foreground">{project.index}</span>
              <span aria-hidden className="h-px w-4 bg-foreground/25" />
              <span>{project.year}</span>
              <span aria-hidden className="h-px w-4 bg-foreground/25" />
              <span>{project.role}</span>
            </div>
          </BlurReveal>
          <div data-cursor="invert">
            <CharReveal
              as="h1"
              text={project.title}
              trigger="mount"
              stagger={0.015}
              className="mt-4 max-w-4xl text-[clamp(2.125rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.032em]"
            />
          </div>
          <BlurReveal delay={0.15}>
            <p className="mt-3.5 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
              {project.tagline}
            </p>
          </BlurReveal>
        </div>
      </header>

      {/* ---------- body: facts rail + a single measure of narrative ---------- */}
      <div className="container-px grid gap-11 py-14 sm:py-20 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <FactsRail project={project} />
        </aside>

        <div className="flex min-w-0 flex-col gap-11">
          <Block id="cs-overview" eyebrow="Overview" divided={false}>
            <BlurReveal delay={0.05}>
              <p className="max-w-3xl text-[clamp(1.125rem,1.9vw,1.5rem)] font-medium leading-[1.5] text-foreground/90">
                {project.description}
              </p>
            </BlurReveal>
          </Block>

          <Block id="cs-problem" eyebrow="The problem">
            <BlurReveal delay={0.05}>
              <p className="max-w-3xl leading-[1.7] text-muted-foreground sm:text-[17px]">
                {caseStudy.problem}
              </p>
            </BlurReveal>
          </Block>

          <Block id="cs-approach" eyebrow="The approach">
            <div className="flex flex-col">
              {caseStudy.approach.map((step, i) => (
                <BlurReveal key={step.title} delay={i * 0.06}>
                  <div
                    className={cn(
                      "grid gap-2 py-6 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-6",
                      i > 0 && "border-t border-border/50"
                    )}
                  >
                    <span className="font-mono text-sm text-foreground/45">
                      {pad(i + 1)}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-2.5 max-w-2xl leading-[1.65] text-muted-foreground">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </BlurReveal>
              ))}
            </div>
          </Block>

          <Block id="cs-features" eyebrow="Key features">
            <ul className="grid gap-3 sm:grid-cols-2">
              {project.highlights.map((highlight, i) => (
                <BlurReveal key={highlight} delay={i * 0.05} as="li">
                  <div className="flex h-full items-start gap-3 rounded-2xl border border-border bg-foreground/[0.02] p-4">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-foreground/10">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/85">
                      {highlight}
                    </span>
                  </div>
                </BlurReveal>
              ))}
            </ul>
          </Block>

          <Block id="cs-outcome" eyebrow="The outcome">
            <BlurReveal delay={0.05}>
              <blockquote className="max-w-3xl rounded-3xl border border-foreground/[0.09] bg-gradient-to-br from-foreground/[0.05] to-foreground/[0.015] p-6 sm:p-8">
                <p className="font-display text-[clamp(1.3rem,2.3vw,1.7rem)] leading-[1.42] text-foreground/95">
                  {caseStudy.outcome}
                </p>
              </blockquote>
            </BlurReveal>
          </Block>
        </div>
      </div>

      {/* ---------- next case study ---------- */}
      <div className="border-t border-border/60">
        <Link
          href={`/projects/${next.id}`}
          className="group container-px block py-14 sm:py-20"
        >
          <Eyebrow>Next case study</Eyebrow>
          <div className="mt-5 flex items-end justify-between gap-6">
            <span className="text-[clamp(1.75rem,4.5vw,3.5rem)] font-semibold leading-tight tracking-tight text-foreground/85 transition-colors duration-300 group-hover:text-foreground">
              {next.title}
            </span>
            <span className="mb-1 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:border-foreground/30 group-hover:bg-foreground group-hover:text-background sm:h-14 sm:w-14">
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
          <p className="mt-2.5 max-w-xl text-sm text-muted-foreground">
            {next.tagline}
          </p>
        </Link>
      </div>

      {/* ---------- mobile action bar ---------- */}
      {hasLinks && (
        <div className="sticky bottom-0 z-30 flex gap-2.5 border-t border-border bg-background/85 px-6 py-4 backdrop-blur-md lg:hidden">
          {project.links?.live && (
            <Button asChild size="lg" className="flex-1">
              <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                Live demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.links?.repo && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className={cn(project.links?.live ? "w-14 shrink-0 px-0" : "flex-1")}
            >
              <a
                href={project.links.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} — view the code`}
              >
                <Code2 className="h-4 w-4" />
                {!project.links?.live && "View code"}
              </a>
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
