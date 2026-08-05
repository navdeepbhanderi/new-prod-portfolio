import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's built-in font-size scale, so it filed
 * the custom `text-fluid-*` sizes under *text colour* — which meant a trailing
 * `text-foreground` in the same class string silently deleted the size and
 * every SectionHeading rendered at the inherited 16px instead of its clamp.
 * Teaching the merger about the scale in tailwind.config.ts fixes it globally.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["fluid-hero", "fluid-h2", "fluid-h3", "fluid-lead"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
