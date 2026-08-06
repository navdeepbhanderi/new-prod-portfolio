import type { LucideIcon } from "lucide-react";

export type ExpertiseCategory = {
  id: string;
  label: string;
  blurb: string;
  icon: LucideIcon;
  technologies: string[];
  /**
   * Drives the weighted grid: `primary` renders as the tall hero panel,
   * `utility` as the full-width strip at the bottom, the rest as compact cards.
   */
  weight: "primary" | "standard" | "utility";
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
  /** NDA-friendly alternative to a screenshot: an architecture flow + metrics. */
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
  /** Rail label — the phase of the journey rather than a year. */
  stage: "Start" | "Education" | "Industry" | "Present";
  /** Right-hand meta column. */
  aside?: { label: string; value: string };
  /** "Working in" chips — the present role's panel only. */
  stack?: string[];
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
