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

/** Travel app: map pane with a plotted route + day-by-day itinerary rows.
    On card hover the destination pings and the days cascade — the plan
    "re-computes". */
function ItineraryBody({ lg }: { lg?: boolean }) {
  const days = lg ? ["D1", "D2", "D3", "D4"] : ["D1", "D2", "D3"];
  return (
    <div className={cn("grid grid-cols-[1fr_1.15fr]", lg ? "gap-3" : "gap-2.5")}>
      {/* Map pane */}
      <div className="relative overflow-hidden rounded-lg bg-foreground/[0.05]">
        <div className="absolute inset-0 bg-grid opacity-80" />
        {/* route: origin → destination over a dashed path */}
        <span className="absolute left-[18%] top-[26%] h-2 w-2 rounded-full bg-foreground/80" />
        <span className="absolute left-[21%] top-[31%] h-px w-[62%] origin-left rotate-[26deg] border-t border-dashed border-foreground/40" />
        <span className="absolute bottom-[22%] right-[16%] grid h-4 w-4 place-items-center rounded-full bg-foreground/15">
          <span className="absolute h-4 w-4 animate-ping rounded-full bg-foreground/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <span className="h-1.5 w-1.5 rounded-full bg-foreground/90" />
        </span>
        <span className="absolute bottom-[10%] left-[14%] h-2 w-1/3 rounded-full bg-foreground/10" />
      </div>
      {/* Itinerary rows */}
      <div className={cn("flex flex-col", lg ? "gap-2.5" : "gap-2")}>
        {days.map((d, i) => (
          <div
            key={d}
            style={{ transitionDelay: `${i * 70}ms` }}
            className={cn(
              "flex items-center gap-2.5 rounded-lg bg-foreground/[0.05] transition-transform duration-500 ease-out-quart group-hover:translate-x-1.5",
              lg ? "p-2.5" : "p-2"
            )}
          >
            <span
              className={cn(
                "grid shrink-0 place-items-center rounded-md bg-foreground/10 font-mono text-muted-foreground",
                lg ? "h-8 w-8 text-[10px]" : "h-6 w-6 text-[8px]"
              )}
            >
              {d}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <span className={cn("h-2 rounded-full bg-foreground/15", i % 2 ? "w-1/2" : "w-2/3")} />
              <span className="h-2 w-5/6 rounded-full bg-foreground/[0.07]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Attendance app: live-lecture header + roster rows with presence dots. */
function RosterBody({ lg }: { lg?: boolean }) {
  const rows = lg ? [0, 1, 2, 3] : [0, 1, 2];
  return (
    <div className={cn("flex flex-col", lg ? "gap-2.5" : "gap-2")}>
      {/* live lecture header */}
      <div
        className={cn(
          "flex items-center justify-between rounded-lg bg-foreground/[0.05]",
          lg ? "p-2.5" : "p-2"
        )}
      >
        <span className={cn("h-2 rounded-full bg-foreground/15", lg ? "w-1/3" : "w-2/5")} />
        <span className="flex items-center gap-1.5 rounded-full bg-foreground/10 px-2 py-0.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground/90" />
          </span>
          <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground">
            Live
          </span>
        </span>
      </div>
      {/* roster rows — presence verified, one still connecting */}
      {rows.map((i) => (
        <div
          key={i}
          className={cn(
            "flex items-center gap-2.5 rounded-lg bg-foreground/[0.05]",
            lg ? "p-2.5" : "p-2"
          )}
        >
          <span className={cn("shrink-0 rounded-full bg-foreground/15", lg ? "h-6 w-6" : "h-5 w-5")} />
          <span
            className={cn("h-2 flex-1 rounded-full bg-foreground/10", i % 2 ? "max-w-[45%]" : "max-w-[60%]")}
          />
          <span className="ml-auto flex items-center gap-1.5">
            <span className="h-1.5 w-6 rounded-full bg-foreground/[0.07]" />
            {/* the last student is still connecting — on hover, they check in */}
            <span
              className={cn(
                "h-2 w-2 rounded-full transition-colors duration-500",
                i === rows.length - 1
                  ? "border border-foreground/40 bg-transparent group-hover:border-transparent group-hover:bg-foreground/80"
                  : "bg-foreground/80"
              )}
            />
          </span>
        </div>
      ))}
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
}: {
  project: Project;
  size?: "sm" | "lg";
}) {
  const lg = size === "lg";
  const Body =
    project.visual === "itinerary"
      ? ItineraryBody
      : project.visual === "roster"
        ? RosterBody
        : GenericBody;

  return (
    <div
      aria-hidden
      className={cn(
        "glass-strong w-full shadow-2xl shadow-black/40",
        lg ? "max-w-2xl rounded-2xl p-4" : "max-w-md rounded-xl p-3"
      )}
    >
      <ChromeBar id={project.id} lg={lg} />
      <Body lg={lg} />
    </div>
  );
}
