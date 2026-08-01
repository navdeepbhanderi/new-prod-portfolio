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
      "Navdeep Bhanderi is a software engineer based in Junagadh, Gujarat, India, currently working as a Senior Frontend Engineer at Softrefine Technology. He leads the frontend side of delivery and builds across the full stack — Next.js, React, Angular, and Node.js — when the product needs it, and is going deeper into applied AI. He cares about clean architecture, thoughtful UX, and shipping high-quality products.",
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
      "Navdeep specializes in modern full-stack development. On the frontend: Angular, React, Next.js, TypeScript, JavaScript, and TailwindCSS. On the backend: Node.js, NestJS, Express.js, and PHP, with databases across SQL, PostgreSQL, MongoDB, and Firebase. He also works with Generative AI and LLM tooling. Core languages include TypeScript, JavaScript, Java, and C++.",
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
      "AI shows up in Navdeep's work where it genuinely earns a place rather than as a headline feature. He works with Generative AI and LLM tooling to build practical, production-ready features — this portfolio's own assistant is one example — and is going deeper into applied AI and generative-AI workflows.",
    related: ["What projects has he built?", "What technologies does he use?"],
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
      "Two featured projects: (1) Travel Commerce Platform — a B2B SaaS platform where travel businesses build complete, custom travel packages (flights, hotels, activities, transfers, insurance) under their own brand, with real-time pricing, post-booking modifications, package reuse, and branded PDF generation; he also migrated it across Angular 12 to 19. (2) Attendance Admin Panel — his contribution to a team project at Smart India Hackathon, where attendance is verified through the campus WiFi network; he built the admin panel for managing faculty and student records, weekly lecture scheduling, and a live classroom dashboard pulled from the database.",
    related: ["Tell me about his experience.", "How can I contact him?"],
    actions: ["case-travel-commerce-platform", "case-attendance"],
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
      "Navdeep earned a Diploma in Computer Engineering from Dr. Subhash Technical Campus, then a B.Tech in Information Technology from Dr. Subhash University — completing the degree while already working in the industry at Softrefine Technology.",
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
      "Navdeep is a Senior Frontend Engineer at Softrefine Technology Pvt. Ltd. — he joined the core team after a six-month internship there. He leads the frontend side of client builds, taking features from requirement to release and building backend pieces when a feature needs it, and completed his B.Tech while working. His resume has the full picture.",
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
      "Hire Navdeep if you want an engineer who blends product thinking with technical depth. He has professional experience shipping production software at Softrefine Technology, leads frontend delivery across the full stack (Next.js, React, Angular, Node.js), and brings AI capabilities into real features. He cares about quality, clean architecture, and great user experience — and he's pragmatic about delivering results.",
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
      "Navdeep is passionate about building scalable, user-friendly products and going deeper into applied AI — generative AI workflows and LLM-powered features — with a long-term focus on advanced, intelligent systems that scale.",
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
