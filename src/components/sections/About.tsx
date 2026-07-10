"use client";

import { MapPin, Sparkles, BadgeCheck } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { TextReveal } from "@/components/ui/TextReveal";

const FACTS = [
  { icon: MapPin, label: "Based in", value: PROFILE.location },
  { icon: Sparkles, label: "Focus", value: "Full-stack · AI · Web3" },
  { icon: BadgeCheck, label: "Status", value: "Open to opportunities" },
] as const;

/**
 * Manifesto strip: the one place the written bio actually appears on the
 * page. Deliberately unnumbered — it reads as a statement between the hero
 * and the numbered chapters.
 */
export function About() {
  return (
    <section id="about" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-px grid gap-10 lg:grid-cols-[0.28fr_1fr]">
        <BlurReveal>
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-px w-6 bg-foreground/30" aria-hidden />
            About
          </span>
        </BlurReveal>

        <div>
          <TextReveal
            as="p"
            text={PROFILE.summary}
            stagger={0.012}
            className="max-w-4xl text-[clamp(1.35rem,2.6vw,2.1rem)] font-medium leading-snug tracking-tight text-foreground/90"
          />

          <BlurReveal delay={0.15}>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
              {FACTS.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-foreground/5 text-foreground/70">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-foreground/85">
                      {value}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}
