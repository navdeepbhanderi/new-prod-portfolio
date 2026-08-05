import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/MagneticButton";
import { SwapText } from "@/components/ui/SwapText";
import { Starfield } from "@/components/ui/Starfield";
import { SECTIONS } from "@/data/navigation";
import { PROJECTS } from "@/data/projects";

export const metadata: Metadata = {
  title: "404 — Page not found",
  robots: { index: false },
};

const RESCUE = SECTIONS.filter((s) => s.id !== "hero");

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-32">
      {/* Lost in space — stars only; the global footer right below this
          section already carries the horizon, so a second earth here would
          stack two rims on screen. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Starfield density={0.0001} className="opacity-80" />
      </div>

      {/* Registration marks, as in the intro — this is still the same frame. */}
      {[
        "left-5 top-5 border-l border-t sm:left-10 sm:top-10",
        "right-5 top-5 border-r border-t sm:right-10 sm:top-10",
        "bottom-5 left-5 border-b border-l sm:bottom-10 sm:left-10",
        "bottom-5 right-5 border-b border-r sm:bottom-10 sm:right-10",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`absolute h-3 w-3 border-foreground/20 ${pos}`}
        />
      ))}

      <div className="container-px flex flex-col items-start">
        <span className="inline-flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.28em] text-muted-foreground">
          <span aria-hidden className="h-px w-5 bg-foreground/30" />
          Error — lost in space
        </span>

        <h1
          aria-label="404 — page not found"
          className="text-stroke-strong mt-6 select-none font-mono text-[clamp(5rem,22vw,15rem)] font-bold leading-[0.85] tracking-tight"
        >
          404
        </h1>

        <p className="mt-8 font-mono text-sm text-muted-foreground">
          cat: page: no such file or directory
        </p>
        <p className="mt-3 max-w-md text-fluid-lead leading-relaxed text-muted-foreground">
          This page drifted off the map. Everything else is exactly where it
          should be.
        </p>

        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Magnetic className="w-full sm:w-auto">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-x-0.5" />
                <SwapText>Back home</SwapText>
              </Link>
            </Button>
          </Magnetic>
          <Magnetic className="w-full sm:w-auto">
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <Link href="/#projects">
                <FolderKanban className="h-4 w-4" />
                <SwapText>View projects</SwapText>
              </Link>
            </Button>
          </Magnetic>
        </div>

        {/* Somebody who landed here wanted something — give them the map. */}
        <div className="mt-14 grid w-full gap-8 border-t border-border pt-7 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
            Jump to
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {RESCUE.map((section) => (
              <Link
                key={section.id}
                href={`/${section.hash}`}
                className="text-[15px] text-foreground/65 transition-colors hover:text-foreground"
              >
                {section.label}
              </Link>
            ))}
            {PROJECTS.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group inline-flex items-center gap-1.5 text-[15px] text-foreground/65 transition-colors hover:text-foreground"
              >
                {project.title}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
