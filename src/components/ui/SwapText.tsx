"use client";

/**
 * Hover text swap: two stacked copies slide up together on group hover /
 * focus. Pure CSS transforms — the global reduced-motion kill covers it.
 * Requires a `group/btn` ancestor (Button adds one).
 */
export function SwapText({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={className ?? "relative block overflow-hidden"}>
      <span className="block transition-transform duration-300 ease-out-quart group-hover/btn:-translate-y-full group-focus-visible/btn:-translate-y-full">
        {children}
      </span>
      <span
        aria-hidden
        className="absolute left-0 top-full block transition-transform duration-300 ease-out-quart group-hover/btn:-translate-y-full group-focus-visible/btn:-translate-y-full"
      >
        {children}
      </span>
    </span>
  );
}
