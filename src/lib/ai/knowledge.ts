import type { Intent } from "@/types";
import { PROFILE } from "@/lib/profile";

/**
 * Local knowledge base for "Ask Navdeep AI".
 * Each intent is matched by keyword/synonym overlap in engine.ts — no API, no cost,
 * deterministic answers grounded in Navdeep's real profile.
 */
export const INTENTS: Intent[] = [
  {
    id: "who",
    keywords: [
      "who",
      "about",
      "introduce",
      "introduction",
      "tell me about navdeep",
      "yourself",
      "bio",
      "background",
      "summary",
    ],
    answer:
      "Navdeep Bhanderi is a software developer based in Junagadh, Gujarat, India. He builds scalable, user-friendly applications as a full-stack developer, working across Next.js, React, Angular, and Node.js, while actively expanding into Artificial Intelligence and Blockchain. He cares about clean architecture, thoughtful UX, and shipping high-quality products.",
    related: ["What technologies does he specialize in?", "Why should I hire him?"],
  },
  {
    id: "skills",
    keywords: [
      "technolog",
      "tech stack",
      "stack",
      "skills",
      "specialize",
      "specialise",
      "expertise",
      "languages",
      "frameworks",
      "tools",
      "what does he know",
      "what can he do",
    ],
    answer:
      "Navdeep specializes in modern full-stack development. On the frontend: Angular, React, Next.js, TypeScript, JavaScript, and TailwindCSS. On the backend: Node.js, NestJS, Express.js, and PHP. He also works with Generative AI and LLM tooling, and explores Blockchain, Web3, and smart contracts. Core languages include TypeScript, JavaScript, Java, and C++.",
    related: ["Tell me about his AI experience.", "What projects has he built?"],
  },
  {
    id: "ai",
    keywords: [
      "ai",
      "artificial intelligence",
      "generative",
      "gen ai",
      "llm",
      "machine learning",
      "ml",
      "ai experience",
      "ai work",
      "intelligent",
    ],
    answer:
      "AI is central to how Navdeep builds. He works with Generative AI and LLM tools to design AI workflows and bring intelligence into real products — most notably an AI-powered travel platform that generates complete, personalized travel packages (flights, hotels, activities, transfers, and itineraries) from a single prompt. He's focused on building practical, production-ready AI features.",
    related: ["Tell me about the AI travel app.", "What technologies does he use?"],
  },
  {
    id: "projects",
    keywords: [
      "project",
      "projects",
      "built",
      "build",
      "work",
      "portfolio",
      "case study",
      "case studies",
      "what has he made",
      "travel",
      "attendance",
      "app",
      "hackathon",
    ],
    answer:
      "Two featured projects: (1) AI-Powered Travel App — an AI platform that generates personalized travel packages including flights, hotels, activities, transfers, and itineraries, with dynamic recommendations and a polished, responsive UX. (2) Remote-Based Student Attendance System — a hackathon project that validates attendance through college WiFi, with real-time live-lecture tracking, student/teacher/timetable management, and an admin dashboard.",
    related: ["Tell me about his AI experience.", "How can I contact him?"],
  },
  {
    id: "education",
    keywords: [
      "education",
      "study",
      "studied",
      "degree",
      "college",
      "university",
      "qualification",
      "btech",
      "b.tech",
      "diploma",
      "academic",
      "school",
    ],
    answer:
      "Navdeep earned a Diploma in Computer Engineering (2020) from Dr. Subhash Technical Campus, followed by a B.Tech in Information Technology (2023) from Dr. Subhash University. Today he's building modern software products and exploring AI and blockchain — with a focus on building scalable, modern software and intelligent product features.",
    related: ["What is he working on now?", "Why should I hire him?"],
  },
  {
    id: "hire",
    keywords: [
      "hire",
      "why hire",
      "why should",
      "recruit",
      "good fit",
      "strengths",
      "value",
      "stand out",
      "reason to hire",
      "convince",
    ],
    answer:
      "Hire Navdeep if you want an engineer who blends product thinking with technical depth. He ships scalable, user-friendly applications across the full stack (Next.js, React, Angular, Node.js), brings AI capabilities into real features, and learns fast — already extending into AI and blockchain. He cares about quality, clean architecture, and great user experience, and he's pragmatic about delivering results.",
    related: ["What's his experience with AI?", "How can I contact him?"],
  },
  {
    id: "contact",
    keywords: [
      "contact",
      "reach",
      "email",
      "hire him now",
      "get in touch",
      "connect",
      "linkedin",
      "github",
      "twitter",
      "social",
      "message",
      "talk",
      "available",
      "availability",
    ],
    answer: `The fastest way to reach Navdeep is email: ${PROFILE.email}. You can also connect on LinkedIn (in/navdeepbhanderi), GitHub (@navdeepbhanderi), or X (@navdeepbhanderi). He's open to full-time opportunities, freelance projects, startup collaborations, and product engineering roles.`,
    related: ["Why should I hire him?", "What does he specialize in?"],
  },
  {
    id: "location",
    keywords: ["where", "location", "based", "live", "country", "city", "india", "remote"],
    answer:
      "Navdeep is based in Junagadh, Gujarat, India, and works comfortably with remote and distributed teams.",
    related: ["How can I contact him?", "Is he available for work?"],
  },
  {
    id: "interests",
    keywords: [
      "interest",
      "interests",
      "passion",
      "hobby",
      "future",
      "goals",
      "exploring",
      "learning",
      "next",
      "vision",
    ],
    answer:
      "Navdeep is passionate about building scalable, user-friendly products and exploring the next wave of technology. Right now that means going deeper into applied AI, generative AI workflows, and blockchain/Web3 — with a long-term focus on advanced, intelligent systems that scale.",
    related: ["Tell me about his AI experience.", "What does he specialize in?"],
  },
  {
    id: "greeting",
    keywords: ["hi", "hello", "hey", "yo", "greetings", "what's up", "sup"],
    answer:
      "Hey! I'm Navdeep's portfolio assistant. Ask me anything about his skills, projects, AI experience, education, or how to get in touch.",
    related: ["Who is Navdeep?", "What technologies does he specialize in?"],
  },
];

export const FALLBACK_ANSWER =
  "I'm focused on Navdeep — his skills, projects, AI experience, education, and contact details. Try asking something like “What technologies does he specialize in?”, “Tell me about his AI experience,” or “Why should I hire him?”";

export const SUGGESTED_QUESTIONS: string[] = [
  "Who is Navdeep?",
  "What technologies does he specialize in?",
  "Tell me about his AI experience.",
  "Why should I hire him?",
  "How can I contact him?",
];

export const GREETING_MESSAGE = `Hi — I'm ${PROFILE.firstName}'s AI assistant. Ask me anything about his work, skills, or how to reach him.`;
