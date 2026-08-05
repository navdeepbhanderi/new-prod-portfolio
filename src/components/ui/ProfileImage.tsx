"use client";

import { useState } from "react";
import Image from "next/image";
import { NMark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

/**
 * Renders Navdeep's portrait from /navdeep.webp via next/image (AVIF/WebP,
 * responsive sizes, preloaded when priority — the hero portrait is an LCP
 * candidate). If the file is missing, it gracefully falls back to the N-mark
 * so the layout never breaks.
 *
 * `objectPosition` exists because the hero uses one asset in three very
 * different frames (floor-to-ceiling column, narrow tablet column, mobile top
 * band) and each needs its own crop. `tone` applies the editorial grade — a
 * touch of grayscale so the portrait sits behind the type instead of competing.
 */
export function ProfileImage({
  className,
  priority = false,
  sizes = "(min-width: 1280px) 28rem, (min-width: 1024px) 24rem, 90vw",
  objectPosition = "50% 20%",
  tone = false,
}: {
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectPosition?: string;
  tone?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "grid h-full w-full place-items-center bg-gradient-to-br from-muted to-background text-foreground/70",
          className
        )}
      >
        <NMark size={72} strokeWidth={2.4} />
      </div>
    );
  }

  return (
    <Image
      src="/navdeep.webp"
      alt="Portrait of Navdeep Bhanderi, software engineer"
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
      style={{ objectPosition }}
      className={cn(
        "object-cover",
        tone && "[filter:grayscale(0.35)_contrast(1.06)_brightness(0.9)]",
        className
      )}
    />
  );
}
