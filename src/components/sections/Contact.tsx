"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, FileText } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { EMAIL, SOCIALS } from "@/data/socials";
import { BRAND_ICONS } from "@/components/icons";
import { TextReveal } from "@/components/ui/TextReveal";
import { BlurReveal } from "@/components/ui/BlurReveal";
import { ParallaxNumeral } from "@/components/ui/ParallaxNumeral";
import { ContactForm } from "@/components/sections/ContactForm";
import { DUR } from "@/lib/motion";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
      {children}
    </span>
  );
}

/** One hairline row of the ledger: label column, content column. */
function Row({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid gap-3 border-t border-border py-5 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5 ${className}`}
    >
      <Label>{label}</Label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-32"
    >
      <ParallaxNumeral value="04" className="right-2 top-8" />
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-lines opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="absolute bottom-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 translate-y-1/3 rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--accent)/0.14),transparent_65%)] blur-3xl" />
      </div>

      <div className="container-px">
        <BlurReveal>
          <span className="inline-flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-muted-foreground">
            <span aria-hidden className="h-px w-5 bg-foreground/30" />
            Contact
          </span>
        </BlurReveal>

        <div data-cursor="invert">
          <TextReveal
            as="h2"
            text="Let's build something *meaningful*"
            stagger={0.05}
            className="mt-6 max-w-5xl text-[clamp(2.5rem,6.2vw,5.5rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
          />
        </div>

        <BlurReveal delay={0.1}>
          <p className="mt-7 max-w-xl text-fluid-lead leading-relaxed text-muted-foreground">
            Have a project, a role, or an idea worth building? Tell me what
            you&rsquo;re working on — I reply to everything within 24 hours.
          </p>
        </BlurReveal>

        {/* rows: auto + 1fr so the tall form panel can't stretch the ledger's
            first row and open a hole under the email. */}
        <div className="mt-14 flex flex-col gap-10 lg:mt-16 lg:grid lg:grid-cols-[0.92fr_1.08fr] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8 xl:gap-x-20">
          {/* ---------- the direct channel, as a ledger ---------- */}
          <BlurReveal delay={0.15} className="lg:col-start-1 lg:row-start-1">
            <div className="flex flex-col gap-3.5 pb-1">
              <Label>Email</Label>
              <div className="flex flex-wrap items-center gap-3.5">
                <a
                  href={`mailto:${EMAIL}`}
                  className="border-b border-foreground/20 pb-1 text-[clamp(1.0625rem,2.4vw,1.625rem)] tracking-[-0.02em] text-foreground transition-colors hover:border-foreground/70"
                >
                  {EMAIL}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label="Copy email address"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={copied ? "copied" : "copy"}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: DUR.micro }}
                    >
                      {copied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
                <Label>{copied ? "Copied" : "Copy"}</Label>
              </div>
            </div>
          </BlurReveal>

          {/* On phones the form outranks the rest of the ledger. */}
          <div className="order-last flex flex-col lg:order-none lg:col-start-1 lg:row-start-2 lg:self-start">
            <BlurReveal delay={0.2}>
              <Row label="Elsewhere" className="mt-6 lg:mt-0">
                <div className="flex flex-col">
                  {SOCIALS.map((social) => {
                    const Icon = BRAND_ICONS[social.icon];
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-4 py-2 text-[15px] text-foreground/85 transition-colors hover:text-foreground"
                      >
                        <span className="inline-flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          {social.label}
                        </span>
                        <span className="truncate font-mono text-[11px] text-muted-foreground">
                          {social.handle}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </Row>
            </BlurReveal>

            <BlurReveal delay={0.25}>
              <Row label="Open to">
                <div className="flex flex-wrap gap-2">
                  {PROFILE.availability.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-border bg-foreground/[0.04] px-3 py-1.5 text-xs text-foreground/85"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Row>
            </BlurReveal>

            <BlurReveal delay={0.3}>
              <Row label="Based" className="border-b">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="text-[15px] text-foreground/85">
                    {PROFILE.locationShort} · {PROFILE.timezone} · Remote-friendly
                  </span>
                  <a
                    href={PROFILE.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex shrink-0 items-center gap-2.5 rounded-full border border-border px-4 py-2 text-[13.5px] text-foreground/85 transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    <FileText className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                    View resume
                  </a>
                </div>
              </Row>
            </BlurReveal>
          </div>

          {/* ---------- the form, as the primary panel ---------- */}
          <BlurReveal delay={0.2} className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <ContactForm />
          </BlurReveal>
        </div>
      </div>
    </section>
  );
}
