import type { Intent } from "@/types";
import { PROFILE } from "@/lib/profile";

/**
 * Local knowledge base for "Nova", the portfolio's AI assistant.
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
      "Navdeep Bhanderi is a software engineer based in Junagadh, Gujarat, India, currently working as a Software Developer at Softrefine Technology. He builds user-friendly applications end to end across Next.js, React, Angular, and Node.js, and is going deeper into applied AI. He cares about clean architecture, thoughtful UX, and shipping high-quality products.",
    related: ["What's his work experience?", "Why should I hire him?"],
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
    actions: ["github"],
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
    actions: ["case-ai-travel"],
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
    actions: ["case-ai-travel", "case-attendance"],
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
      "Navdeep earned a Diploma in Computer Engineering (2020–2023) from Dr. Subhash Technical Campus, then a B.Tech in Information Technology (2023–2026) from Dr. Subhash University — completing the degree while already working in the industry at Softrefine Technology.",
    related: ["What's his work experience?", "Why should I hire him?"],
    actions: ["resume"],
  },
  {
    id: "experience",
    keywords: [
      "experience",
      "work experience",
      "job",
      "company",
      "employer",
      "softrefine",
      "current role",
      "where does he work",
      "working",
      "career",
      "internship",
      "professional",
      "years",
    ],
    answer:
      "Navdeep is a Software Developer at Softrefine Technology Pvt. Ltd., where he's been since July 2024 — he joined the core team after a six-month internship there (January–June 2024). He builds and ships full-stack web applications in production, and completed his B.Tech while working. His resume has the full picture.",
    related: ["What projects has he built?", "Why should I hire him?"],
    actions: ["resume", "linkedin"],
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
      "Hire Navdeep if you want an engineer who blends product thinking with technical depth. He has professional experience shipping production software at Softrefine Technology, builds user-friendly applications across the full stack (Next.js, React, Angular, Node.js), and brings AI capabilities into real features. He cares about quality, clean architecture, and great user experience — and he's pragmatic about delivering results.",
    related: ["What's his work experience?", "How can I contact him?"],
    actions: ["resume", "email"],
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
    actions: ["email", "linkedin"],
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
  "What's his work experience?",
  "What technologies does he specialize in?",
  "Why should I hire him?",
  "How can I contact him?",
];

/** The assistant's name — referenced everywhere, change it here only. */
export const ASSISTANT_NAME = "Nova";

export const GREETING_MESSAGE = `Hi — I'm ${ASSISTANT_NAME}, ${PROFILE.firstName}'s AI assistant. Ask me anything about his work, skills, or how to reach him.`;
