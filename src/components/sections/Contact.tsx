"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { EMAIL, SOCIALS } from "@/data/socials";
import { BRAND_ICONS } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { TextReveal } from "@/components/ui/TextReveal";
import { BlurReveal } from "@/components/ui/BlurReveal";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — mailto link still works */
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-28 sm:py-36">
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute bottom-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 translate-y-1/3 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(230_60%_50%/0.12),transparent_65%)] blur-3xl" />
      </div>

      <div className="container-px flex flex-col items-center text-center">
        <BlurReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Available for work
          </span>
        </BlurReveal>

        <TextReveal
          as="h2"
          text="Let's build something meaningful"
          className="mt-8 max-w-4xl text-fluid-h2 font-semibold leading-[1.02] tracking-tight text-foreground"
        />

        <BlurReveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-fluid-lead leading-relaxed text-muted-foreground">
            Have a project, a role, or an idea worth building? I’d love to hear about it.
          </p>
        </BlurReveal>

        <BlurReveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Magnetic>
              <Button asChild size="lg">
                <a href={`mailto:${EMAIL}`}>
                  <Mail className="h-4 w-4" />
                  {EMAIL}
                </a>
              </Button>
            </Magnetic>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        </BlurReveal>

        {/* socials */}
        <BlurReveal delay={0.2}>
          <div className="mt-12 flex items-center gap-3">
            {SOCIALS.map((social) => {
              const Icon = BRAND_ICONS[social.icon];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm text-muted-foreground transition-all hover:border-foreground/30 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{social.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              );
            })}
          </div>
        </BlurReveal>

        {/* availability */}
        <BlurReveal delay={0.25}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
            <span className="font-mono text-xs uppercase tracking-[0.2em]">Open to</span>
            {PROFILE.availability.map((item, i) => (
              <span key={item} className="flex items-center gap-3">
                {i > 0 && <span className="h-1 w-1 rounded-full bg-border" />}
                <span className="text-foreground/75">{item}</span>
              </span>
            ))}
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
