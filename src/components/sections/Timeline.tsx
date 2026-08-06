"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TIMELINE } from "@/data/timeline";
import type { TimelineItem } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParallaxNumeral } from "@/components/ui/ParallaxNumeral";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

// Newest first.
const ENTRIES = [...TIMELINE].reverse();

/**
 * The rail sits in its own grid column, so the track's x is the centre of that
 * column: 10px on mobile (20px column), 162px at sm+ (128px label + 24px gap
 * + half of the 20px column).
 */
const TRACK_X = "left-[10px] sm:left-[162px]";

function Node({ present }: { present: boolean }) {
  return (
    <span className="flex justify-center pt-1.5 sm:pt-2">
      <span
        aria-hidden
        className="tl-node grid h-[15px] w-[15px] place-items-center rounded-full bg-background"
      >
        {present ? (
          <span className="relative flex h-[9px] w-[9px]">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" />
            <span className="relative h-[9px] w-[9px] rounded-full bg-foreground" />
          </span>
        ) : (
          <span className="h-[7px] w-[7px] rounded-full border border-foreground/35 bg-background" />
        )}
      </span>
    </span>
  );
}

function Stage({ item, className }: { item: TimelineItem; className?: string }) {
  return (
    <span
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.24em]",
        item.status === "present" ? "text-foreground" : "text-muted-foreground",
        className
      )}
    >
      {item.stage}
    </span>
  );
}

function PresentEntry({ item }: { item: TimelineItem }) {
  return (
    <div className="glass grid gap-7 rounded-3xl p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-11">
      <div className="flex flex-col items-start">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/[0.12] px-3 py-1.5 font-mono text-[9.5px] uppercase tracking-[0.22em] text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Current role
        </span>
        <h3 className="mt-5 text-[clamp(1.5rem,3.2vw,2.375rem)] font-semibold leading-tight tracking-tight">
          {item.title}
        </h3>
        <span className="mt-2 text-base text-muted-foreground">{item.subtitle}</span>
        <p className="mt-4 max-w-2xl leading-relaxed text-foreground/70">
          {item.description}
        </p>
      </div>

      <div className="flex flex-col gap-5 border-t border-foreground/[0.09] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
        {item.aside && (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
              {item.aside.label}
            </span>
            <span className="text-[15px] leading-snug text-foreground/85">
              {item.aside.value}
            </span>
          </div>
        )}
        {item.stack && (
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
              Working in
            </span>
            <span className="flex flex-wrap gap-2">
              {item.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-foreground/20 bg-foreground/[0.06] px-3 py-1.5 text-xs text-foreground"
                >
                  {tech}
                </span>
              ))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function PastEntry({ item }: { item: TimelineItem }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-11">
      <div>
        <h3 className="text-xl font-semibold leading-tight tracking-tight sm:text-2xl">
          {item.title}
        </h3>
        <span className="mt-2 block text-[15px] text-muted-foreground">
          {item.subtitle}
        </span>
        <p className="mt-3.5 max-w-2xl leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
      {item.aside && (
        <div className="flex flex-col gap-2 lg:border-l lg:border-border lg:pl-8">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
            {item.aside.label}
          </span>
          <span className="text-[15px] leading-snug text-foreground/75">
            {item.aside.value}
          </span>
        </div>
      )}
    </div>
  );
}

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    const line = lineRef.current;
    if (!el || !line || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 65%",
            end: "bottom 80%",
            scrub: 0.6,
          },
        }
      );

      // Nodes pop as the drawn line reaches them.
      gsap.utils.toArray<HTMLElement>(".tl-node").forEach((node) => {
        gsap.fromTo(
          node,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.55,
            ease: "back.out(2.2)",
            scrollTrigger: { trigger: node, start: "top 78%" },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="journey"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <ParallaxNumeral value="03" className="right-2 top-10" />
      <div className="container-px">
        <SectionHeading
          eyebrow="Experience"
          title="From coursework to *owning* delivery"
          description="Education and industry, side by side — a degree completed while shipping real software."
        />

        <div ref={containerRef} className="relative mt-14 sm:mt-16">
          {/* the track, and the lit length drawn over it */}
          <div
            aria-hidden
            className={cn("absolute inset-y-3 w-px bg-border", TRACK_X)}
          />
          <div
            ref={lineRef}
            aria-hidden
            className={cn(
              "absolute inset-y-3 w-px origin-top bg-gradient-to-b from-foreground via-foreground/50 to-transparent",
              TRACK_X
            )}
            style={{ transform: "scaleY(0)" }}
          />

          <ol className="flex flex-col gap-12 sm:gap-16">
            {ENTRIES.map((item, i) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: 20, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: EASE_OUT, delay: i * 0.05 }}
                className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-5 sm:grid-cols-[8rem_1.25rem_minmax(0,1fr)] sm:gap-x-6"
              >
                <Stage
                  item={item}
                  className="hidden pt-2 text-right sm:block"
                />
                <Node present={item.status === "present"} />
                <div className="min-w-0">
                  <Stage item={item} className="mb-2.5 block sm:hidden" />
                  {item.status === "present" ? (
                    <PresentEntry item={item} />
                  ) : (
                    <PastEntry item={item} />
                  )}
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
