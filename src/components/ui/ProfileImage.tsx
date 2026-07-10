"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Renders Navdeep's portrait from /navdeep.webp via next/image (AVIF/WebP,
 * responsive sizes, preloaded when priority — the hero portrait is an LCP
 * candidate). If the file is missing, it gracefully falls back to an "NB"
 * monogram so the layout never breaks.
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
    <Image
      src="/navdeep.webp"
      alt="Portrait of Navdeep Bhanderi, software engineer"
      fill
      sizes="(min-width: 1024px) 24rem, 90vw"
      priority={priority}
      onError={() => setFailed(true)}
      className={cn("object-cover object-center", className)}
    />
  );
}
