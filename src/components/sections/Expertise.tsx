"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EXPERTISE } from "@/data/expertise";
import { SKILL_MARQUEE } from "@/data/skills";
import type { ExpertiseCategory } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { VelocityMarquee } from "@/components/ui/VelocityMarquee";
import { ParallaxNumeral } from "@/components/ui/ParallaxNumeral";
import { DUR, EASE_OUT } from "@/lib/motion";
import { useIsTouch, usePrefersReducedMotion } from "@/hooks/use-media-query";

type ConstellationLine = { x1: number; y1: number; x2: number; y2: number };

function DomainCard({
  category,
  index,
}: {
  category: ExpertiseCategory;
  index: number;
}) {
  const Icon = category.icon;

  return (
    <GlassCard className="h-full rounded-3xl p-6 sm:p-7">
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between">
          <span
            data-node={category.id}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-foreground/5 text-foreground/70 transition-colors duration-300 group-hover:border-foreground/20 group-hover:bg-foreground group-hover:text-background"
          >
            <Icon className="h-5 w-5" />
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")} · {category.technologies.length}{" "}
            tools
          </span>
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight">
          {category.label}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {category.blurb}
        </p>

        <div className="mt-5 flex flex-wrap gap-2 pt-px">
          {category.technologies.map((tech) => (
            <span
              key={tech}
              className="flex items-center gap-1.5 rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs font-medium text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <span className="h-1 w-1 rounded-full bg-foreground/40" />
              {tech}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

export function Expertise() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<ConstellationLine[]>([]);
  const isTouch = useIsTouch();
  const reduced = usePrefersReducedMotion();
  const constellation = !isTouch && !reduced;

  // "A connected ecosystem" — literally: hovering a domain draws hairlines
  // from its icon to every other domain's icon. Positions are measured on
  // hover (6 rects, cheap) so resize/layout changes never go stale.
  const connect = (id: string) => {
    const root = gridRef.current;
    if (!constellation || !root) return;
    const rootRect = root.getBoundingClientRect();
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-node]"));
    const from = nodes.find((n) => n.dataset.node === id);
    if (!from) return;
    const center = (el: HTMLElement) => {
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - rootRect.left,
        y: r.top + r.height / 2 - rootRect.top,
      };
    };
    const f = center(from);
    setLines(
      nodes
        .filter((n) => n !== from)
        .map((n) => {
          const t = center(n);
          return { x1: f.x, y1: f.y, x2: t.x, y2: t.y };
        })
    );
  };

  return (
    <section
      id="expertise"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <ParallaxNumeral value="01" className="right-2 top-10" />
      <div className="container-px">
        <SectionHeading
          eyebrow="Expertise"
          title="A connected ecosystem of skills"
          description="Every domain and the technologies behind it — visible at a glance, no digging required."
        />

        <div
          ref={gridRef}
          onMouseLeave={() => setLines([])}
          className="relative mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        >
          {EXPERTISE.map((cat, i) => (
            <BlurReveal key={cat.id} delay={i * 0.07} className="h-full">
              <div onMouseEnter={() => connect(cat.id)} className="h-full">
                <DomainCard category={cat} index={i} />
              </div>
            </BlurReveal>
          ))}

          {constellation && (
            <svg
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
            >
              <AnimatePresence>
                {lines.map((l, i) => (
                  <motion.line
                    key={`${l.x2}-${l.y2}`}
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y2}
                    stroke="hsl(0 0% 98% / 0.16)"
                    strokeWidth={1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: DUR.base,
                      ease: EASE_OUT,
                      delay: i * 0.045,
                      opacity: { duration: DUR.fast },
                    }}
                  />
                ))}
              </AnimatePresence>
            </svg>
          )}
        </div>
      </div>

      {/* full-bleed technology marquee — speed reacts to scroll velocity */}
      <div className="mt-16 flex flex-col gap-3">
        <VelocityMarquee items={SKILL_MARQUEE.slice(0, Math.ceil(SKILL_MARQUEE.length / 2))} />
        <VelocityMarquee items={SKILL_MARQUEE.slice(Math.ceil(SKILL_MARQUEE.length / 2))} reverse />
      </div>
    </section>
  );
}
