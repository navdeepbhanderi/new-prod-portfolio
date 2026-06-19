"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { SOCIALS } from "@/data/socials";
import { BRAND_ICONS } from "@/components/icons";

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 py-12">
      <div className="container-px flex flex-col items-center justify-between gap-8 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <span className="font-mono text-sm font-medium">{PROFILE.name}</span>
          <span className="text-xs text-muted-foreground">
            {PROFILE.headline}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {SOCIALS.map((social) => {
            const Icon = BRAND_ICONS[social.icon];
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="container-px mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Navdeep Bhanderi. Built with Next.js.</p>
        <Link
          href="#hero"
          scroll={false}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
        >
          Back to top <ArrowUp className="h-3.5 w-3.5" />
        </Link>
      </div>
    </footer>
  );
}
