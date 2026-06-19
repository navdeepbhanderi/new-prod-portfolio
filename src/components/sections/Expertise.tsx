"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { EXPERTISE } from "@/data/expertise";
import { SKILL_MARQUEE } from "@/data/skills";
import type { ExpertiseCategory } from "@/types";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { cn } from "@/lib/utils";

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="mask-x flex overflow-hidden">
      <div
        className={cn(
          "flex shrink-0 gap-3 pr-3",
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        )}
        style={{ ["--marquee-duration" as string]: "40s" }}
      >
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-foreground/[0.02] px-5 py-2.5 text-sm text-foreground/75"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function TechChips({ technologies }: { technologies: string[] }) {
  return (
    <motion.div
      className="flex flex-wrap gap-2.5"
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.04 }}
    >
      {technologies.map((tech) => (
        <motion.span
          key={tech}
          variants={{
            hidden: { opacity: 0, scale: 0.9, y: 8 },
            visible: { opacity: 1, scale: 1, y: 0 },
          }}
          className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-4 py-2 text-sm font-medium text-foreground/85 transition-colors hover:border-foreground/25 hover:text-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/40" />
          {tech}
        </motion.span>
      ))}
    </motion.div>
  );
}

/* ---------- Desktop: vertical list + animated detail panel ---------- */
function DesktopEcosystem() {
  const [active, setActive] = useState(EXPERTISE[0].id);
  const category = EXPERTISE.find((c) => c.id === active) ?? EXPERTISE[0];
  const Icon = category.icon;

  return (
    <div className="hidden gap-10 lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      {/* selector */}
      <div className="flex flex-col gap-3">
        {EXPERTISE.map((cat) => {
          const CatIcon = cat.icon;
          const isActive = cat.id === active;
          return (
            <button
              key={cat.id}
              type="button"
              onMouseEnter={() => setActive(cat.id)}
              onFocus={() => setActive(cat.id)}
              onClick={() => setActive(cat.id)}
              aria-pressed={isActive}
              className={cn(
                "group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300",
                isActive
                  ? "border-foreground/20 bg-foreground/[0.04]"
                  : "border-border hover:border-foreground/15"
              )}
            >
              <span
                className={cn(
                  "absolute left-0 top-0 h-full w-[3px] origin-top bg-foreground transition-transform duration-300",
                  isActive ? "scale-y-100" : "scale-y-0"
                )}
              />
              <span
                className={cn(
                  "grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-colors",
                  isActive
                    ? "border-foreground/20 bg-foreground text-background"
                    : "border-border bg-foreground/5 text-foreground/70"
                )}
              >
                <CatIcon className="h-5 w-5" />
              </span>
              <span className="flex flex-col gap-1">
                <span className="flex items-center gap-2 font-medium">
                  {cat.label}
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(cat.technologies.length).padStart(2, "0")}
                  </span>
                </span>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {cat.blurb}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* detail panel */}
      <div className="relative h-full min-h-[360px] overflow-hidden rounded-3xl border border-border bg-foreground/[0.02]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(circle,black,transparent_70%)]">
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/[0.06]" />
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/[0.05]" />
            <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/[0.04]" />
          </div>
          <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,hsl(230_60%_50%/0.12),transparent_70%)] blur-2xl" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full flex-col p-9"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-foreground/15 bg-foreground text-background">
                <Icon className="h-6 w-6" />
              </span>
              <div className="flex flex-col">
                <span className="flex items-center gap-2 text-xl font-semibold tracking-tight">
                  {category.label}
                  <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                    {category.technologies.length} tools
                  </span>
                </span>
                <span className="text-sm text-muted-foreground">{category.blurb}</span>
              </div>
            </div>

            <div className="my-6 h-px w-full bg-border/60" />
            <TechChips technologies={category.technologies} />

            <div className="mt-auto pt-8">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {String(EXPERTISE.findIndex((c) => c.id === active) + 1).padStart(2, "0")} /{" "}
                {String(EXPERTISE.length).padStart(2, "0")} domains
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Mobile / tablet: accordion ---------- */
function AccordionItem({ category, isOpen, onToggle }: {
  category: ExpertiseCategory;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const Icon = category.icon;
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border transition-colors",
        isOpen ? "border-foreground/20 bg-foreground/[0.04]" : "border-border"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
      >
        <span
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition-colors",
            isOpen
              ? "border-foreground/20 bg-foreground text-background"
              : "border-border bg-foreground/5 text-foreground/70"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-center gap-2 font-medium">
            {category.label}
            <span className="font-mono text-xs text-muted-foreground">
              {String(category.technologies.length).padStart(2, "0")}
            </span>
          </span>
          <span className="truncate text-sm text-muted-foreground">{category.blurb}</span>
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pt-1 sm:px-5">
              <TechChips technologies={category.technologies} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileEcosystem() {
  const [openId, setOpenId] = useState<string | null>(EXPERTISE[0].id);
  return (
    <div className="flex flex-col gap-3 lg:hidden">
      {EXPERTISE.map((cat) => (
        <AccordionItem
          key={cat.id}
          category={cat}
          isOpen={openId === cat.id}
          onToggle={() => setOpenId((cur) => (cur === cat.id ? null : cat.id))}
        />
      ))}
    </div>
  );
}

export function Expertise() {
  return (
    <section id="expertise" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-px">
        <SectionHeading
          eyebrow="Expertise"
          title="A connected ecosystem of skills"
          description="Not a list of logos — a living map of how the pieces fit together. Explore each domain to see the technologies behind it."
        />

        <div className="mt-14">
          <DesktopEcosystem />
          <MobileEcosystem />
        </div>
      </div>

      {/* full-bleed technology marquee */}
      <div className="mt-16 flex flex-col gap-3">
        <MarqueeRow items={SKILL_MARQUEE.slice(0, Math.ceil(SKILL_MARQUEE.length / 2))} />
        <MarqueeRow items={SKILL_MARQUEE.slice(Math.ceil(SKILL_MARQUEE.length / 2))} reverse />
      </div>
    </section>
  );
}
