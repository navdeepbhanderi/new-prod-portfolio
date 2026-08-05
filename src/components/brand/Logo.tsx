import { cn } from "@/lib/utils";
import { PROFILE } from "@/lib/profile";

/**
 * The N-mark: one continuous stroke that draws an N — a path from start to
 * finish — with the dot as the release. Stroke is `currentColor`, so the mark
 * inherits whatever foreground it sits on (nav, footer, inverted chips).
 *
 * The stroke thickens as the mark shrinks so it stays legible at favicon
 * sizes; pass `strokeWidth` to override.
 */
function strokeFor(size: number): number {
  if (size <= 18) return 3.4;
  if (size <= 26) return 3;
  if (size <= 36) return 2.8;
  return 2.6;
}

export function NMark({
  size = 30,
  framed = false,
  frameClassName,
  strokeWidth,
  className,
}: {
  size?: number;
  /** Draws the rounded container hairline (the standalone / lockup form). */
  framed?: boolean;
  /** Classes for the frame alone — lets a caller drop it at one breakpoint. */
  frameClassName?: string;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      {framed && (
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="14"
          className={cn("stroke-border", frameClassName)}
        />
      )}
      <path
        d="M15 34V14l14 20V14"
        stroke="currentColor"
        strokeWidth={strokeWidth ?? strokeFor(size)}
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <circle cx="33.5" cy="32.5" r={size <= 26 ? 2.8 : 2.6} fill="currentColor" />
    </svg>
  );
}

/**
 * Mark + name, with an optional mono role line underneath. Used in the navbar
 * at the top of the page and anywhere the full identity is needed.
 */
export function Lockup({
  size = 30,
  framed = false,
  role = false,
  nameClassName,
  className,
}: {
  size?: number;
  framed?: boolean;
  /** Adds the mono role line under the name. */
  role?: boolean;
  nameClassName?: string;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <NMark size={size} framed={framed} />
      <span className="flex flex-col gap-0.5">
        <span
          className={cn(
            "text-sm font-medium leading-none tracking-tight",
            nameClassName
          )}
        >
          {PROFILE.name}
        </span>
        {role && (
          <span className="font-mono text-[9.5px] uppercase leading-none tracking-[0.24em] text-muted-foreground">
            {PROFILE.title}
          </span>
        )}
      </span>
    </span>
  );
}
