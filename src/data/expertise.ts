import { Boxes, Braces, Database, Layers, Sparkles, Wrench } from "lucide-react";
import type { ExpertiseCategory } from "@/types";

export const EXPERTISE: ExpertiseCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    blurb: "Where most of the day-to-day work happens.",
    icon: Layers,
    technologies: ["Angular", "React", "Next.js", "JavaScript", "TypeScript", "TailwindCSS"],
  },
  {
    id: "backend",
    label: "Backend",
    blurb: "Enough to reason about the whole system, not just the UI.",
    icon: Boxes,
    technologies: ["Node.js", "NestJS", "Express.js", "PHP"],
  },
  {
    id: "databases",
    label: "Databases",
    blurb: "Relational and document stores behind the products I build.",
    icon: Database,
    technologies: ["SQL", "PostgreSQL", "MongoDB", "Firebase"],
  },
  {
    id: "languages",
    label: "Languages",
    blurb: "The languages I think and build in.",
    icon: Braces,
    technologies: ["JavaScript", "TypeScript", "Java", "C++"],
  },
  {
    id: "ai",
    label: "AI",
    blurb: "Used where it actually earns a place in the product.",
    icon: Sparkles,
    technologies: ["Generative AI", "LLM Tools", "AI Workflows"],
  },
  {
    id: "tools",
    label: "Tools",
    blurb: "The everyday tools that keep delivery sharp.",
    icon: Wrench,
    technologies: ["Git", "GitHub", "VS Code", "Postman", "Figma", "Linear", "npm"],
  },
];
