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
  /** Real product screenshot; when set it replaces the stylised mock. */
  image?: { src: string; alt: string; width: number; height: number };
  /**
   * NDA-friendly alternative to a screenshot: a layered architecture flow plus
   * a few honest metrics. Takes precedence over `visual`, below `image`.
   */
  diagram?: {
    /** Eyebrow label naming the scope you owned, e.g. "Frontend I built". */
    scope?: string;
    /** The layers you actually built, left → right. */
    flow: string[];
    /** External system you integrate with (rendered dashed — consumed, not built). */
    consumes?: string;
    note?: string;
    metrics?: { value: string; label: string }[];
  };
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
  /** Keys into CHAT_ACTIONS — tappable buttons attached to the answer. */
  actions?: string[];
};
