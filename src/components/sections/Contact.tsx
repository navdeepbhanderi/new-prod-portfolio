"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Mail } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { EMAIL, SOCIALS } from "@/data/socials";
import { BRAND_ICONS } from "@/components/icons";
import { CharReveal } from "@/components/ui/CharReveal";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ParallaxNumeral } from "@/components/ui/ParallaxNumeral";
import { ContactForm } from "@/components/sections/ContactForm";

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
      <ParallaxNumeral value="04" className="right-2 top-8" />
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute bottom-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 translate-y-1/3 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(230_60%_50%/0.12),transparent_65%)] blur-3xl" />
      </div>

      <div className="container-px flex flex-col items-center text-center">
        <BlurReveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Open to opportunities
          </span>
        </BlurReveal>

        <div data-cursor="invert">
          <CharReveal
            as="h2"
            text="Let's build something meaningful"
            stagger={0.015}
            className="mt-8 max-w-4xl justify-center text-[clamp(2.5rem,6.5vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-foreground"
          />
        </div>

        <BlurReveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-xl text-fluid-lead leading-relaxed text-muted-foreground">
            Have a project, a role, or an idea worth building? I’d love to hear about it.
          </p>
        </BlurReveal>

        {/* Form + direct contact — compact, side by side on desktop */}
        <div className="mt-12 grid w-full max-w-4xl gap-10 text-left lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          {/* Direct channel */}
          <div className="flex flex-col gap-7">
            <BlurReveal delay={0.15}>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Prefer direct?
              </p>
              <div className="mt-3 flex items-center gap-2">
                <a
                  href={`mailto:${EMAIL}`}
                  className="group inline-flex items-center gap-2.5 text-sm font-medium text-foreground/85 transition-colors hover:text-foreground"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-foreground/5 text-foreground/70 transition-colors group-hover:border-foreground/25 group-hover:text-foreground">
                    <Mail className="h-4 w-4" />
                  </span>
                  {EMAIL}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "copied" : "copy"}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
            </BlurReveal>

            <BlurReveal delay={0.2}>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Elsewhere
              </p>
              <div className="mt-3 flex items-center gap-2">
                {SOCIALS.map((social) => {
                  const Icon = BRAND_ICONS[social.icon];
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </BlurReveal>

            <BlurReveal delay={0.25}>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                Open to
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/70">
                {PROFILE.availability.join(" · ")}
              </p>
            </BlurReveal>
          </div>

          {/* The form */}
          <BlurReveal delay={0.2}>
            <ContactForm />
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}
