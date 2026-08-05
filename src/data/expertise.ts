import { Boxes, Braces, Database, Layers, Sparkles, Wrench } from "lucide-react";
import type { ExpertiseCategory } from "@/types";

/**
 * `weight` drives the layout, not the order: one `primary` domain becomes the
 * tall hero panel, `utility` becomes the strip along the bottom, and the rest
 * are compact cards. Six equal cards said every domain mattered equally —
 * this says frontend is the specialty and the rest is range.
 */
export const EXPERTISE: ExpertiseCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    blurb:
      "Where most of the day-to-day work happens — architecture, state, performance, and the last 10% that makes an interface feel finished.",
    icon: Layers,
    technologies: ["Angular", "React", "Next.js", "JavaScript", "TypeScript", "TailwindCSS"],
    weight: "primary",
  },
  {
    id: "backend",
    label: "Backend",
    blurb: "Enough to reason about the whole system, not just the UI.",
    icon: Boxes,
    technologies: ["Node.js", "NestJS", "Express.js", "PHP"],
    weight: "standard",
  },
  {
    id: "databases",
    label: "Databases",
    blurb: "Relational and document stores behind the products I build.",
    icon: Database,
    technologies: ["SQL", "PostgreSQL", "MongoDB", "Firebase"],
    weight: "standard",
  },
  {
    id: "languages",
    label: "Languages",
    blurb: "The languages I think and build in.",
    icon: Braces,
    technologies: ["JavaScript", "TypeScript", "Java", "C++"],
    weight: "standard",
  },
  {
    id: "ai",
    label: "AI",
    blurb: "Used where it actually earns a place in the product.",
    icon: Sparkles,
    technologies: ["Generative AI", "LLM Tools", "AI Workflows"],
    weight: "standard",
  },
  {
    id: "tools",
    label: "Tools",
    blurb: "The everyday tools that keep delivery sharp.",
    icon: Wrench,
    technologies: ["Git", "GitHub", "VS Code", "Postman", "Figma", "Linear", "npm"],
    weight: "utility",
  },
];

/** Totals for the section's meta line — derived, never hand-counted. */
export const EXPERTISE_TOTALS = {
  domains: EXPERTISE.length,
  technologies: new Set(EXPERTISE.flatMap((c) => c.technologies)).size,
};
