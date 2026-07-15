import type { SkillGroup } from "@/types";

export const SKILL_GROUPS: SkillGroup[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: ["Angular", "React", "Next.js", "JavaScript", "TypeScript", "TailwindCSS"],
  },
  {
    id: "backend",
    label: "Backend",
    skills: ["Node.js", "NestJS", "Express.js", "PHP"],
  },
  {
    id: "languages",
    label: "Languages",
    skills: ["JavaScript", "TypeScript", "Java", "C++"],
  },
  {
    id: "ai",
    label: "AI",
    skills: ["Generative AI Tools", "LLM Applications"],
  },
  {
    id: "tools",
    label: "Tools",
    skills: ["Git", "GitHub", "ESLint", "TailwindCSS"],
  },
];

// Flat marquee list for the moving technology landscape.
export const SKILL_MARQUEE: string[] = [
  "TypeScript",
  "Next.js",
  "React",
  "Angular",
  "Node.js",
  "NestJS",
  "Express.js",
  "TailwindCSS",
  "JavaScript",
  "Java",
  "C++",
  "PHP",
  "Generative AI",
  "LLM Tools",
  "Git",
  "GitHub",
];
