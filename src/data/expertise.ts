import { Boxes, Braces, Cpu, Layers, Sparkles, Wrench } from "lucide-react";
import type { ExpertiseCategory } from "@/types";

export const EXPERTISE: ExpertiseCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    blurb: "Interfaces that feel fast, intentional, and alive.",
    icon: Layers,
    technologies: ["Angular", "React", "Next.js", "JavaScript", "TypeScript", "TailwindCSS"],
  },
  {
    id: "backend",
    label: "Backend",
    blurb: "APIs and services built to scale cleanly.",
    icon: Boxes,
    technologies: ["Node.js", "NestJS", "Express.js", "PHP"],
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
    blurb: "Bringing intelligence into everyday products.",
    icon: Sparkles,
    technologies: ["Generative AI", "LLM Tools", "AI Workflows"],
  },
  {
    id: "emerging",
    label: "Emerging Tech",
    blurb: "Exploring the next wave of the web.",
    icon: Cpu,
    technologies: ["Blockchain", "Web3", "Smart Contracts"],
  },
  {
    id: "tools",
    label: "Tools",
    blurb: "The everyday tools that keep delivery sharp.",
    icon: Wrench,
    technologies: ["Git", "GitHub", "TailwindCSS"],
  },
];
