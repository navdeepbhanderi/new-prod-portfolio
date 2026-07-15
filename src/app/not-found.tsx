import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Starfield } from "@/components/ui/Starfield";

export const metadata: Metadata = {
  title: "404 — Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
      {/* Lost in space — stars only; the global footer right below this
          section already carries the horizon, so a second earth here would
          stack two rims on screen. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <Starfield density={0.0001} className="opacity-80" />
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Error — lost in space
      </p>

      <h1
        aria-label="404 — page not found"
        className="text-stroke-strong mt-4 select-none font-mono text-[clamp(6rem,24vw,15rem)] font-bold leading-none"
      >
        404
      </h1>

      <p className="mt-6 font-mono text-sm text-muted-foreground">
        cat: page: no such file — try &ldquo;ls&rdquo;
      </p>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-muted-foreground">
        This page drifted off the map. Everything else is exactly where it
        should be.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-x-0.5" />
            Back home
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/#projects">
            <FolderKanban className="h-4 w-4" />
            View projects
          </Link>
        </Button>
      </div>
    </section>
  );
}
