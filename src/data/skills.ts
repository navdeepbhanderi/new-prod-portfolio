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
    id: "databases",
    label: "Databases",
    skills: ["SQL", "PostgreSQL", "MongoDB", "Firebase"],
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
    skills: ["Git", "GitHub", "VS Code", "Postman", "Figma", "Linear", "npm"],
  },
];

// Flat marquee list for the moving technology landscape.
// Ordered by group: frameworks → languages → styling → backend → databases → AI → tools.
export const SKILL_MARQUEE: string[] = [
  "Next.js",
  "React",
  "Angular",
  "TypeScript",
  "JavaScript",
  "Java",
  "C++",
  "TailwindCSS",
  "Node.js",
  "NestJS",
  "Express.js",
  "PHP",
  "PostgreSQL",
  "MongoDB",
  "Firebase",
  "Generative AI",
  "LLM Tools",
  "Git",
  "GitHub",
  "VS Code",
  "Postman",
  "Figma",
  "Linear",
  "npm",
];
