import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Stylised, per-project product mocks — placeholders until real screenshots
 * land in public/projects/. Each variant sketches the actual product's shape
 * (an itinerary planner, a live attendance roster) so the two projects read
 * as different apps, not the same skeleton twice. Monochrome tokens only.
 */

function ChromeBar({ id, lg }: { id: string; lg?: boolean }) {
  return (
    <div className={cn("flex items-center gap-1.5", lg ? "mb-4" : "mb-3")}>
      <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
      <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
      <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
      <span className="ml-2 font-mono text-[10px] text-muted-foreground">{id}.app</span>
    </div>
  );
}

/** NDA-friendly visual: a layered architecture flow + honest metric tiles.
    Reveals system thinking without exposing any client UI. */
function ArchitectureBody({
  diagram,
  lg,
  metrics = true,
}: {
  diagram: NonNullable<Project["diagram"]>;
  lg?: boolean;
  metrics?: boolean;
}) {
  // Owned layers render solid; the consumed external system renders dashed and
  // dimmed so the boundary of what was actually built is unmistakable.
  const nodes = [
    ...diagram.flow.map((label) => ({ label, external: false })),
    ...(diagram.consumes ? [{ label: diagram.consumes, external: true }] : []),
  ];

  return (
    <div className={cn("flex flex-col", lg ? "gap-3" : "gap-2.5")}>
      {diagram.scope && (
        <span
          className={cn(
            "flex items-center gap-1.5 font-mono uppercase tracking-[0.18em] text-muted-foreground",
            lg ? "text-[10px]" : "text-[8px]"
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/50" aria-hidden />
          {diagram.scope}
        </span>
      )}

      {/* Layered flow: owned layers → consumed backend boundary. On phones the
          arrows would be a pixel wide, so the layers stack into a grid and the
          arrows drop out — the boundary still reads from the dashed node. */}
      <div
        className={cn(
          "grid grid-cols-2 items-stretch sm:flex",
          lg ? "gap-1.5" : "gap-1"
        )}
      >
        {nodes.map((node, i) => (
          <div key={node.label} className={cn("flex items-center sm:flex-1", lg ? "gap-1.5" : "gap-1")}>
            <span
              className={cn(
                "flex flex-1 items-center justify-center rounded-lg text-center font-mono leading-tight",
                lg ? "min-h-[3.25rem] px-2 text-[10px]" : "min-h-[2.5rem] px-1 text-[8px]",
                node.external
                  ? "border border-dashed border-border bg-transparent text-muted-foreground"
                  : "border border-border bg-foreground/[0.05] text-foreground/70"
              )}
            >
              {node.label}
            </span>
            {i < nodes.length - 1 && (
              <ArrowRight
                aria-hidden
                className={cn(
                  "hidden shrink-0 text-foreground/30 sm:block",
                  lg ? "h-3.5 w-3.5" : "h-2.5 w-2.5"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {diagram.note && (
        <p className={cn("leading-snug text-muted-foreground", lg ? "text-xs" : "text-[10px]")}>
          {diagram.note}
        </p>
      )}

      {metrics && diagram.metrics && diagram.metrics.length > 0 && (
        <div className={cn("flex", lg ? "gap-2" : "gap-1.5")}>
          {diagram.metrics.map((m) => (
            <div
              key={m.label}
              className={cn(
                "flex-1 rounded-lg bg-foreground/[0.05] text-center",
                lg ? "p-2.5" : "p-2"
              )}
            >
              <div className={cn("font-semibold tracking-tight text-foreground", lg ? "text-lg" : "text-sm")}>
                {m.value}
              </div>
              <div className={cn("leading-tight text-muted-foreground", lg ? "text-[10px]" : "text-[8px]")}>
                {m.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Fallback skeleton for projects without a dedicated variant. */
function GenericBody({ lg }: { lg?: boolean }) {
  return (
    <div className={cn(lg ? "space-y-3" : "space-y-2.5")}>
      <div className={cn("w-2/3 rounded-full bg-foreground/15", lg ? "h-3.5" : "h-3")} />
      <div className={cn("w-full rounded-full bg-foreground/10", lg ? "h-3.5" : "h-3")} />
      <div className={cn("grid gap-2 pt-1", lg ? "grid-cols-4 gap-2.5" : "grid-cols-3")}>
        <div className={cn("rounded-lg bg-foreground/10", lg ? "h-16 rounded-xl" : "h-12")} />
        <div className={cn("rounded-lg bg-foreground/[0.07]", lg ? "h-16 rounded-xl" : "h-12")} />
        <div className={cn("rounded-lg bg-foreground/10", lg ? "h-16 rounded-xl" : "h-12")} />
        {lg && <div className="h-16 rounded-xl bg-foreground/[0.07]" />}
      </div>
      <div className={cn("w-1/2 rounded-full bg-foreground/10", lg ? "h-3.5" : "h-3")} />
    </div>
  );
}

export function ProductMock({
  project,
  size = "sm",
  className,
  metrics = true,
}: {
  project: Project;
  size?: "sm" | "lg";
  /** Lets a card override the max-width so the mock can bleed to its edge. */
  className?: string;
  /** Off where the surrounding card already states the numbers. */
  metrics?: boolean;
}) {
  const lg = size === "lg";

  return (
    <div
      aria-hidden
      className={cn(
        // Deliberately NOT .glass-strong: the mock always sits on an opaque
        // gradient, so the backdrop blur bought nothing visually and cost a
        // full re-raster every frame the deck card scaled under it.
        "w-full border border-white/[0.08] bg-[hsl(240_6%_8%/0.92)] shadow-2xl shadow-black/40",
        lg ? "max-w-2xl rounded-2xl p-4" : "max-w-md rounded-xl p-3",
        className
      )}
    >
      <ChromeBar id={project.id} lg={lg} />
      {project.image ? (
        <div className={cn("overflow-hidden border border-foreground/10", lg ? "rounded-xl" : "rounded-lg")}>
          <Image
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            sizes={lg ? "(max-width: 1024px) 90vw, 640px" : "(max-width: 768px) 90vw, 420px"}
            className="h-auto w-full"
          />
        </div>
      ) : project.diagram ? (
        <ArchitectureBody diagram={project.diagram} lg={lg} metrics={metrics} />
      ) : (
        <GenericBody lg={lg} />
      )}
    </div>
  );
}
