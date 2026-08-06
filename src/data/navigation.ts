/**
 * The page's sections in document order - one source for the navbar, footer
 * sitemap, command palette, and 404 links.
 */
export const SECTIONS = [
  { id: "hero", label: "Home", hash: "#hero" },
  { id: "about", label: "About", hash: "#about" },
  { id: "expertise", label: "Expertise", hash: "#expertise" },
  { id: "projects", label: "Projects", hash: "#projects" },
  { id: "journey", label: "Experience", hash: "#journey" },
  { id: "contact", label: "Contact", hash: "#contact" },
] as const;

export type Section = (typeof SECTIONS)[number];

/** Navbar links: Home is the logo and Contact is the CTA, so neither is a link. */
export const NAV_SECTIONS = SECTIONS.filter(
  (s) => s.id !== "hero" && s.id !== "contact"
);

/** Everything the active-section observer watches - the ends included, so the
 *  navbar pill clears at the top and bottom of the page. */
export const SECTION_IDS = SECTIONS.map((s) => s.id);
