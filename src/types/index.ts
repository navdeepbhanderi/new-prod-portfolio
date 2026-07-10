import type { LucideIcon } from "lucide-react";

export type ExpertiseCategory = {
  id: string;
  label: string;
  blurb: string;
  icon: LucideIcon;
  technologies: string[];
};

export type Project = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  year: string;
  role: string;
  description: string;
  highlights: string[];
  stack: string[];
  accent: string; // gradient classes for the visual
  /** Optional proof links — buttons render only when provided. */
  links?: { live?: string; repo?: string };
  /** Long-form content for the /projects/[slug] case study page. */
  caseStudy: {
    problem: string;
    approach: { title: string; detail: string }[];
    outcome: string;
  };
};

export type TimelineItem = {
  id: string;
  period: string;
  title: string;
  subtitle: string;
  description: string;
  status: "past" | "present" | "future";
};

export type SkillGroup = {
  id: string;
  label: string;
  skills: string[];
};

export type Social = {
  label: string;
  href: string;
  handle: string;
  icon: "github" | "linkedin" | "x";
};

export type Intent = {
  id: string;
  keywords: string[];
  answer: string;
  related?: string[];
};
