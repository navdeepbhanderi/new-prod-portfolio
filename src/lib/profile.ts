import { EMAIL, SOCIALS } from "@/data/socials";
import { SITE_URL } from "@/lib/site";

export const PROFILE = {
  name: "Navdeep Bhanderi",
  firstName: "Navdeep",
  surname: "Bhanderi",
  title: "Software Engineer",
  headline: "Full-stack engineer building AI-powered products and modern web experiences.",
  location: "Junagadh, Gujarat, India",
  email: EMAIL,
  tagline:
    "Building AI-powered products and modern web applications — end to end, from idea to production.",
  summary:
    "Software engineer who builds products end to end — from the database to the last pixel. Core expertise across Node.js, Next.js, React, and Angular, with a focus on interfaces that feel fast and systems that hold up in production. Currently going deeper into applied AI.",
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
