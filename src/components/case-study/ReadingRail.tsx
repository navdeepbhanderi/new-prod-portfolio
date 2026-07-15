"use client";

import { useActiveSection } from "@/hooks/use-active-section";
import { useLenis } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { id: "cs-overview", label: "Overview" },
  { id: "cs-problem", label: "Problem" },
  { id: "cs-approach", label: "Approach" },
  { id: "cs-features", label: "Features" },
  { id: "cs-outcome", label: "Outcome" },
] as const;

const SECTION_IDS = SECTIONS.map((s) => s.id);

/**
 * Reading rail for case studies: a fixed dot-per-section indicator on the
 * right edge (xl and up). The active dot stretches into a bar with its label;
 * clicking jumps to the section. Motion in service of scanning — a recruiter
 * sees the shape of the case study and can jump straight to Outcome.
 */
export function ReadingRail() {
  const active = useActiveSection(SECTION_IDS);
  const lenis = useLenis();

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -110 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav
      aria-label="Case study sections"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex"
    >
      {SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => jump(section.id)}
            aria-current={isActive ? "true" : undefined}
            className="group flex items-center gap-2.5 py-0.5"
          >
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300",
                isActive
                  ? "text-foreground opacity-100"
                  : "text-muted-foreground opacity-0 group-hover:opacity-70 group-focus-visible:opacity-70"
              )}
            >
              {section.label}
            </span>
            <span
              aria-hidden
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                isActive
                  ? "w-6 bg-foreground"
                  : "w-1.5 bg-foreground/30 group-hover:bg-foreground/60"
              )}
            />
          </button>
        );
      })}
    </nav>
  );
}
