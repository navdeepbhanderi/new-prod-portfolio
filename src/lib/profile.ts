import { EMAIL, SOCIALS } from "@/data/socials";
import { SITE_URL } from "@/lib/site";

export const PROFILE = {
  name: "Navdeep Bhanderi",
  firstName: "Navdeep",
  surname: "Bhanderi",
  title: "Senior Frontend Engineer",
  headline: "Frontend engineer with full-stack range.",
  location: "Junagadh, Gujarat, India",
  /** Compact form for meta rows, ledgers and the nav sheet. */
  locationShort: "Junagadh, IN",
  timezone: "IST",
  email: EMAIL,
  tagline:
    "Own frontend delivery end to end — requirement to release, backend included when needed.",
  /**
   * The hero's claim. `*asterisks*` mark the one Instrument Serif emphasis
   * phrase — `TextReveal` strips them from the rendered text and the aria-label.
   */
  claim: "Frontend built like *product*, not like tickets.",
  /** Follows the claim: who is saying it, and what it means in practice. */
  byline:
    "I own delivery from the requirement through to release, backend included when the work needs it.",
  /** Hero fact ledger — what I'm doing now and what I reach for. */
  currently: "Leading the frontend of a client build",
  coreStack: ["Angular", "React", "Next.js", "Node.js"],
  summary:
    "Frontend engineer who reads a requirement all the way through before writing code, then builds and delivers it end to end. Comfortable enough on the backend (Node.js) to build and reason about the system behind the UI, not just consume it. Also bring team-leadership experience — coordinating delivery and keeping the team on track.",
  company: "Softrefine Technology Pvt. Ltd.",
  /** Conversational form, for running copy where the legal suffix reads stiff. */
  companyShort: "Softrefine",
  resume: "/resume.pdf",
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
      jobTitle: "Senior Frontend Engineer",
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
      worksFor: {
        "@type": "Organization",
        name: PROFILE.company,
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
