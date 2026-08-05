import type { TimelineItem } from "@/types";

export const TIMELINE: TimelineItem[] = [
  {
    id: "diploma",
    period: "",
    stage: "Start",
    title: "Diploma in Computer Engineering",
    subtitle: "Dr. Subhash Technical Campus",
    description:
      "Built the fundamentals — programming, systems, and the engineering principles that still shape how I work.",
    status: "past",
    aside: { label: "Foundation", value: "Programming · Systems" },
  },
  {
    id: "btech",
    period: "",
    stage: "Education",
    title: "B.Tech, Information Technology",
    subtitle: "Dr. Subhash University",
    description:
      "Deepened into modern software engineering and full-stack development — completed while already working in the industry.",
    status: "past",
    aside: { label: "Alongside", value: "Studied while working full-time" },
  },
  {
    id: "internship",
    period: "",
    stage: "Industry",
    title: "Software Developer Intern",
    subtitle: "Softrefine Technology Pvt. Ltd.",
    description:
      "First real industry work — moved from coursework to shipping production code on live client projects across the stack.",
    status: "past",
    aside: { label: "Turning point", value: "Coursework → production" },
  },
  {
    id: "softrefine",
    period: "Present",
    stage: "Present",
    title: "Senior Frontend Engineer",
    subtitle: "Softrefine Technology Pvt. Ltd.",
    description:
      "Leading the frontend side of a client build — starting from the full requirement, splitting delivery across the team, and shipping my own share of it end to end, backend work included where it's needed.",
    status: "present",
    aside: { label: "Scope", value: "Requirement → architecture → release" },
    stack: ["Angular", "TypeScript", "Node.js"],
  },
];
