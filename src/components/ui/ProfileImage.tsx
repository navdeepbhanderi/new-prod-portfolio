"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Renders Navdeep's portrait from /navdeep.jpg.
 * If the file is missing, it gracefully falls back to an "NB" monogram so the
 * layout never breaks (and no image-optimizer errors are logged). Place the
 * photo at /public/navdeep.webp to use it.
 */
export function ProfileImage({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "grid h-full w-full place-items-center bg-gradient-to-br from-muted to-background",
          className
        )}
      >
        <span className="font-mono text-6xl font-semibold tracking-tight text-foreground/80">
          NB
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/navdeep.webp"
      alt="Navdeep Bhanderi"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={cn("h-full w-full object-cover object-center", className)}
    />
  );
}
