import type { Project } from "@/types";

export const PROJECTS: Project[] = [
  {
    id: "ai-travel",
    index: "01",
    title: "AI-Powered Travel App",
    tagline: "Personalized trips, generated in seconds.",
    year: "2024",
    role: "Full-stack & AI Engineering",
    description:
      "An AI-driven travel platform that composes complete, personalized travel packages — flights, hotels, activities, transfers, and day-by-day itineraries — from a single prompt. The system blends generative AI with real product constraints to deliver recommendations travelers can actually book.",
    highlights: [
      "Dynamic AI recommendations tailored to budget, dates, and taste",
      "End-to-end packages: flights, hotels, activities, transfers, itineraries",
      "Responsive, modern interfaces with a polished booking experience",
      "Scalable architecture designed for real-world usage",
    ],
    stack: ["Next.js", "TypeScript", "Node.js", "Generative AI", "TailwindCSS"],
    accent: "from-sky-500/25 via-indigo-500/15 to-transparent",
    caseStudy: {
      problem:
        "Planning a real trip means hours of tab-juggling — comparing flights, cross-checking hotels, stitching activities into a schedule that actually works. Generic packages ignore budget, dates, and taste; fully manual planning doesn't scale past a weekend getaway. The gap: turning one plain-language request into a complete, bookable plan.",
      approach: [
        {
          title: "Prompt to structured itinerary",
          detail:
            "A single natural-language request is parsed into structured travel intent — destination, dates, budget, travel style — then expanded by generative AI into a day-by-day plan instead of a wall of suggestions.",
        },
        {
          title: "AI constrained by real product rules",
          detail:
            "Recommendations are generated against real inventory constraints — flights, hotels, transfers, and activities that can actually be combined and booked — so the output is a plan, not a hallucination.",
        },
        {
          title: "A booking-grade interface",
          detail:
            "The itinerary renders as a polished, responsive booking flow: swap a hotel, stretch a day, watch the package re-price. The AI stays in the loop without ever blocking the user.",
        },
        {
          title: "Architecture built to grow",
          detail:
            "A clean Next.js + Node.js separation keeps AI orchestration, inventory logic, and UI independently scalable — designed for real-world usage from day one.",
        },
      ],
      outcome:
        "A travel platform that composes complete, personalized packages — flights, hotels, activities, transfers, and itineraries — from a single prompt, in seconds. It demonstrates end-to-end product engineering: generative AI applied with real constraints, wrapped in an experience travelers can actually book.",
    },
  },
  {
    id: "attendance",
    index: "02",
    title: "Remote-Based Student Attendance System",
    tagline: "Attendance you can trust — verified by campus WiFi.",
    year: "2023",
    role: "Hackathon · Full-stack",
    description:
      "A hackathon-built platform that validates student attendance through college WiFi, removing proxy attendance while keeping the flow effortless. It pairs secure, network-based verification with full management tooling for students, teachers, and live lectures.",
    highlights: [
      "Secure attendance validation through college WiFi",
      "Real-time live-lecture tracking and updates",
      "Student, teacher, and timetable management",
      "Admin dashboard with a clean, responsive UI",
    ],
    stack: ["React", "Node.js", "Express.js", "Real-time", "TailwindCSS"],
    accent: "from-emerald-500/25 via-teal-500/15 to-transparent",
    caseStudy: {
      problem:
        "Proxy attendance is the open secret of every campus: one student signs in for three, and manual roll calls burn lecture time while still producing unreliable records. Institutions needed attendance they could trust without adding friction for honest students — or new hardware.",
      approach: [
        {
          title: "The campus WiFi as the proof",
          detail:
            "Attendance validates only when the student's device is verifiably on the college network — no biometrics, no extra hardware, no way to check in from the hostel.",
        },
        {
          title: "Real-time lecture tracking",
          detail:
            "Live lectures stream attendance updates as they happen, so teachers see presence forming in real time instead of reconciling sheets afterwards.",
        },
        {
          title: "One platform, three roles",
          detail:
            "Students, teachers, and admins each get a focused surface — check-in, live monitoring, and full timetable/management tooling — over one shared source of truth.",
        },
        {
          title: "Shipped under hackathon pressure",
          detail:
            "Scoped, built, and demoed within a hackathon window: a working end-to-end system with a clean, responsive dashboard rather than a slide-deck concept.",
        },
      ],
      outcome:
        "A working platform that makes proxy attendance structurally impossible while making honest attendance effortless — secure network-based verification, real-time visibility, and complete management tooling, built end-to-end under competition constraints.",
    },
  },
];
