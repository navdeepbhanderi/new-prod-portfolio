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
  },
];
