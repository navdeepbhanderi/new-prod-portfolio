"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EXPERTISE, EXPERTISE_TOTALS } from "@/data/expertise";
import { SKILL_MARQUEE } from "@/data/skills";
import type { ExpertiseCategory } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { VelocityMarquee } from "@/components/ui/VelocityMarquee";
import { ParallaxNumeral } from "@/components/ui/ParallaxNumeral";
import { DUR, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

const PRIMARY = EXPERTISE.find((c) => c.weight === "primary")!;
const STANDARD = EXPERTISE.filter((c) => c.weight === "standard");
const UTILITY = EXPERTISE.find((c) => c.weight === "utility")!;

/** Position in the section's numbering - the data's order, one-based. */
const indexOf = (category: ExpertiseCategory) =>
  String(EXPERTISE.indexOf(category) + 1).padStart(2, "0");

function Meta({ category }: { category: ExpertiseCategory }) {
  return (
    <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
      {indexOf(category)} · {category.technologies.length} tools
    </span>
  );
}

function Chips({
  technologies,
  emphasis = false,
}: {
  technologies: string[];
  emphasis?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <span
          key={tech}
          className={cn(
            "whitespace-nowrap rounded-full border transition-colors",
            emphasis
              ? "border-foreground/25 bg-foreground/[0.07] px-4 py-2 text-sm text-foreground hover:border-foreground/40"
              : "border-border bg-foreground/[0.03] px-3 py-1.5 text-xs text-foreground/80 hover:border-foreground/30 hover:text-foreground"
          )}
        >
          {tech}
        </span>
      ))}
    </div>
  );
}

function PrimaryPanel({ className }: { className?: string }) {
  return (
    <GlassCard
      className={cn(
        "flex flex-col rounded-3xl bg-gradient-to-b from-foreground/[0.055] to-foreground/[0.02] p-6 sm:p-7 lg:p-8",
        className
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="whitespace-nowrap rounded-full bg-foreground px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-background">
          Primary domain
        </span>
        <Meta category={PRIMARY} />
      </div>
      <h3 className="mt-7 text-[clamp(1.75rem,3.4vw,2.5rem)] font-semibold tracking-tight lg:mt-8">
        {PRIMARY.label}
      </h3>
      <p className="mt-3.5 max-w-md leading-relaxed text-muted-foreground">
        {PRIMARY.blurb}
      </p>
      <div className="mt-auto pt-8">
        <Chips technologies={PRIMARY.technologies} emphasis />
      </div>
    </GlassCard>
  );
}

function CompactCard({ category }: { category: ExpertiseCategory }) {
  return (
    <GlassCard className="flex h-full flex-col rounded-3xl p-6">
      <Meta category={category} />
      <h3 className="mt-4 text-[1.4rem] font-semibold tracking-tight">
        {category.label}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {category.blurb}
      </p>
      <div className="mt-auto pt-6">
        <Chips technologies={category.technologies} />
      </div>
    </GlassCard>
  );
}

function ToolsStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid gap-5 rounded-3xl border border-border bg-foreground/[0.02] p-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-center lg:gap-8 lg:px-7",
        className
      )}
    >
      <div className="flex flex-col gap-1.5">
        <Meta category={UTILITY} />
        <span className="text-xl font-semibold tracking-tight">{UTILITY.label}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <Chips technologies={UTILITY.technologies} />
        <span className="hidden whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground xl:block">
          Everyday delivery
        </span>
      </div>
    </div>
  );
}

/** Below md the grid collapses to an accordion ledger. */
function AccordionRow({
  category,
  defaultOpen = false,
}: {
  category: ExpertiseCategory;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `exp-panel-${category.id}`;

  return (
    <div className="border-t border-border last:border-b">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="flex items-baseline gap-3">
          <span className="font-mono text-[11px] text-muted-foreground">
            {indexOf(category)}
          </span>
          <span className="text-xl font-semibold tracking-tight">{category.label}</span>
        </span>
        <span className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-muted-foreground">
            {category.technologies.length}
          </span>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground">
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 transition-transform duration-300",
                open && "rotate-180"
              )}
            />
          </span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: DUR.base, ease: EASE_OUT }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 pb-5">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {category.blurb}
              </p>
              <Chips technologies={category.technologies} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Expertise() {
  return (
    <section
      id="expertise"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <ParallaxNumeral value="01" className="right-2 top-10" />
      <div className="container-px">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <SectionHeading
            eyebrow="Expertise"
            title="Deep in the frontend, *fluent* across the stack"
          />
          <BlurReveal delay={0.1}>
            <p className="max-w-sm leading-relaxed text-muted-foreground lg:text-right">
              {EXPERTISE_TOTALS.domains} domains,{" "}
              {EXPERTISE_TOTALS.technologies} technologies - arranged by how much
              of the delivery actually leans on them.
            </p>
          </BlurReveal>
        </div>

        {/* ---------- md+: weighted grid ---------- */}
        <div className="mt-12 hidden md:block lg:mt-14">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1.32fr_1fr_1fr] lg:gap-[18px]">
            <BlurReveal className="md:col-span-2 lg:col-span-1 lg:row-span-2">
              <PrimaryPanel className="h-full" />
            </BlurReveal>
            {STANDARD.map((category, i) => (
              <BlurReveal key={category.id} delay={0.06 + i * 0.07} className="h-full">
                <CompactCard category={category} />
              </BlurReveal>
            ))}
          </div>
          <BlurReveal delay={0.1}>
            <ToolsStrip className="mt-4 lg:mt-[18px]" />
          </BlurReveal>
        </div>

        {/* ---------- below md: panel + ledger ---------- */}
        <div className="mt-10 md:hidden">
          <BlurReveal>
            <PrimaryPanel />
          </BlurReveal>
          <BlurReveal delay={0.08}>
            <div className="mt-8 flex flex-col">
              {STANDARD.map((category, i) => (
                <AccordionRow
                  key={category.id}
                  category={category}
                  defaultOpen={i === 0}
                />
              ))}
              <AccordionRow category={UTILITY} />
            </div>
          </BlurReveal>
        </div>
      </div>

      {/* full-bleed technology marquee - speed reacts to scroll velocity */}
      <div className="mt-16 flex flex-col gap-3">
        <VelocityMarquee items={SKILL_MARQUEE.slice(0, Math.ceil(SKILL_MARQUEE.length / 2))} />
        <VelocityMarquee items={SKILL_MARQUEE.slice(Math.ceil(SKILL_MARQUEE.length / 2))} reverse />
      </div>
    </section>
  );
}
