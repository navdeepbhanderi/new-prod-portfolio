import { EMAIL, SOCIALS } from "@/data/socials";
import { SITE_URL } from "@/lib/site";

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

/**
 * One @graph with cross-referenced Person, WebSite, and ProfilePage nodes —
 * richer for search engines than a lone Person, and rendered once in layout.
 */
export const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PROFILE.name,
      givenName: PROFILE.firstName,
      jobTitle: "Software Engineer",
      description: PROFILE.summary,
      email: `mailto:${PROFILE.email}`,
      url: SITE_URL,
      image: `${SITE_URL}/navdeep.webp`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Junagadh",
        addressRegion: "Gujarat",
        addressCountry: "IN",
      },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "Dr. Subhash University" },
        { "@type": "CollegeOrUniversity", name: "Dr. Subhash Technical Campus" },
      ],
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
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${PROFILE.name} — Portfolio`,
      description: PROFILE.tagline,
      publisher: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      name: `${PROFILE.name} — ${PROFILE.title}`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
    },
  ],
};
