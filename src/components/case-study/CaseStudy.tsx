"use client";

import { useRef } from "react";
import { Link } from "next-view-transitions";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Code2 } from "lucide-react";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { CharReveal } from "@/components/ui/CharReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { ProductMock } from "@/components/ui/ProductMock";
import { ReadingRail } from "@/components/case-study/ReadingRail";
import { cn } from "@/lib/utils";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
      <span className="h-px w-6 bg-foreground/30" aria-hidden />
      {children}
    </span>
  );
}

function Block({
  id,
  eyebrow,
  children,
}: {
  /** Anchor for the reading rail. */
  id: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28 border-t border-border/60 pt-10">
      <BlurReveal>
        <Eyebrow>{eyebrow}</Eyebrow>
      </BlurReveal>
      <div className="mt-6">{children}</div>
    </div>
  );
}

/** The stylised product mock, scaled up as the case-study hero visual. */
function HeroVisual({ project }: { project: Project }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <div
      ref={ref}
      className="relative"
      // Shared element: the deck card's visual morphs into this hero.
      style={{ viewTransitionName: `project-${project.id}` }}
    >
      <GlassCard className="aspect-[16/8] rounded-[2rem] p-0 sm:aspect-[16/7]">
        <div className={cn("absolute inset-0 bg-gradient-to-br", project.accent)} />
        <motion.div
          style={{ y }}
          className="absolute inset-0 flex items-center justify-center p-8"
        >
          <ProductMock project={project} size="lg" />
        </motion.div>
        <span
          aria-hidden
          className="absolute right-8 top-6 font-mono text-8xl font-bold text-foreground/[0.06]"
        >
          {project.index}
        </span>
      </GlassCard>
    </div>
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

  return (
    <article className="relative">
      <ReadingRail />
      {/* ---------- Hero ---------- */}
      <header className="container-px pt-32 sm:pt-36">
        <BlurReveal>
          <Link
            href="/#projects"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            All projects
          </Link>
        </BlurReveal>

        <BlurReveal delay={0.05}>
          <div className="mt-10 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="text-foreground/80">{project.index}</span>
            <span className="h-px w-6 bg-border" />
            <span>{project.year}</span>
            <span className="h-px w-6 bg-border" />
            <span>{project.role}</span>
          </div>
        </BlurReveal>

        <div data-cursor="invert">
          <CharReveal
            as="h1"
            text={project.title}
            trigger="mount"
            stagger={0.015}
            className="mt-5 max-w-5xl text-[clamp(2.4rem,5.5vw,4.75rem)] font-semibold leading-[1.02] tracking-tight"
          />
        </div>

        <BlurReveal delay={0.2}>
          <p className="mt-5 max-w-2xl text-fluid-lead leading-relaxed text-muted-foreground">
            {project.tagline}
          </p>
        </BlurReveal>

        {(project.links?.live || project.links?.repo) && (
          <BlurReveal delay={0.25}>
            <div className="mt-8 flex flex-wrap gap-3">
              {project.links.live && (
                <Magnetic>
                  <Button asChild size="lg">
                    <a href={project.links.live} target="_blank" rel="noopener noreferrer">
                      Live demo
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Button>
                </Magnetic>
              )}
              {project.links.repo && (
                <Button asChild size="lg" variant="outline">
                  <a href={project.links.repo} target="_blank" rel="noopener noreferrer">
                    <Code2 className="h-4 w-4" />
                    View code
                  </a>
                </Button>
              )}
            </div>
          </BlurReveal>
        )}
      </header>

      {/* ---------- Visual band ---------- */}
      <div className="container-px mt-14 sm:mt-16">
        <BlurReveal>
          <HeroVisual project={project} />
        </BlurReveal>
      </div>

      {/* ---------- Body ---------- */}
      <div className="container-px grid gap-14 py-20 sm:py-24 lg:grid-cols-[0.3fr_1fr] lg:gap-20">
        {/* Sticky facts rail */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <BlurReveal>
            <dl className="flex flex-col gap-7">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Year
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground/85">
                  {project.year}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Role
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground/85">
                  {project.role}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Stack
                </dt>
                <dd className="mt-2.5 flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </BlurReveal>
        </aside>

        {/* Narrative */}
        <div className="flex min-w-0 flex-col gap-14">
          <Block id="cs-overview" eyebrow="Overview">
            <BlurReveal delay={0.05}>
              <p className="max-w-3xl text-[clamp(1.15rem,1.8vw,1.45rem)] font-medium leading-relaxed text-foreground/90">
                {project.description}
              </p>
            </BlurReveal>
          </Block>

          <Block id="cs-problem" eyebrow="The problem">
            <BlurReveal delay={0.05}>
              <p className="max-w-3xl leading-relaxed text-muted-foreground">
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
                      "grid gap-3 py-7 sm:grid-cols-[4rem_1fr] sm:gap-6",
                      i > 0 && "border-t border-border/50"
                    )}
                  >
                    <span className="font-mono text-sm text-foreground/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight">
                        {step.title}
                      </h3>
                      <p className="mt-2 max-w-2xl leading-relaxed text-muted-foreground">
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
              {project.highlights.map((h, i) => (
                <BlurReveal key={h} delay={i * 0.05} as="li">
                  <div className="flex h-full items-start gap-3 rounded-2xl border border-border bg-foreground/[0.02] p-4">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-foreground/10">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-sm leading-relaxed text-foreground/85">{h}</span>
                  </div>
                </BlurReveal>
              ))}
            </ul>
          </Block>

          <Block id="cs-outcome" eyebrow="The outcome">
            <BlurReveal delay={0.05}>
              <div className="relative max-w-3xl rounded-2xl border border-border bg-foreground/[0.02] p-6 sm:p-8">
                <span
                  aria-hidden
                  className="absolute left-0 top-6 h-[calc(100%-3rem)] w-[3px] rounded-full bg-foreground/60"
                />
                <p className="leading-relaxed text-foreground/90">{caseStudy.outcome}</p>
              </div>
            </BlurReveal>
          </Block>
        </div>
      </div>

      {/* ---------- Next project ---------- */}
      <div className="border-t border-border/60">
        <Link
          href={`/projects/${next.id}`}
          className="group container-px block py-16 sm:py-20"
        >
          <Eyebrow>Next case study</Eyebrow>
          <div className="mt-5 flex items-end justify-between gap-6">
            <span className="text-[clamp(1.9rem,4.5vw,3.75rem)] font-semibold leading-tight tracking-tight text-foreground/85 transition-colors duration-300 group-hover:text-foreground">
              {next.title}
            </span>
            <span className="mb-2 grid h-12 w-12 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:border-foreground/30 group-hover:bg-foreground group-hover:text-background sm:h-14 sm:w-14">
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{next.tagline}</p>
        </Link>
      </div>
    </article>
  );
}
