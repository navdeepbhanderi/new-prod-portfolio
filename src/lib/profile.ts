import { EMAIL, SOCIALS } from "@/data/socials";

export const PROFILE = {
  name: "Navdeep Bhanderi",
  firstName: "Navdeep",
  title: "Software Developer",
  headline: "Full-stack engineer building modern, scalable web applications.",
  location: "Junagadh, Gujarat, India",
  email: EMAIL,
  tagline:
    "Building AI-powered products, modern web applications, and scalable digital experiences.",
  summary:
    "Software developer passionate about building scalable, user-friendly applications and exploring the next wave of technologies. Core expertise in modern web development, delivering efficient, high-quality solutions with Node.js, Next.js, React, and Angular while actively expanding into Artificial Intelligence and Blockchain technologies.",
  availability: [
    "Full-time opportunities",
    "Freelance projects",
    "Startup collaborations",
    "Product engineering roles",
  ],
} as const;

export const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  jobTitle: "Software Engineer",
  description: PROFILE.summary,
  email: `mailto:${PROFILE.email}`,
  url: "https://navdeepbhanderi.vercel.app",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Junagadh",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  sameAs: SOCIALS.map((s) => s.href),
  knowsAbout: [
    "Software Engineering",
    "Next.js",
    "React",
    "Angular",
    "Node.js",
    "TypeScript",
    "Generative AI",
    "Blockchain",
    "Web3",
  ],
};
