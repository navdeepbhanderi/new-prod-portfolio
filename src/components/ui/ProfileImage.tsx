"use client";

import { useState } from "react";
import Image from "next/image";
import { NMark } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

/**
 * Portrait via next/image; falls back to the N-mark if the file is missing.
 * `objectPosition` sets the crop per layout; `tone` applies a slight
 * grayscale grade.
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
      quality={90}
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
