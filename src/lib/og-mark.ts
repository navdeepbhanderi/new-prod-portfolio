/**
 * The N-mark as a data URI, for surfaces that can't use the React component:
 * OG images (satori renders it as an `<img>`, no SVG-element dependency) and
 * anywhere else outside the DOM. Colours are literal because neither satori nor
 * an email client can resolve CSS custom properties.
 */
const MARK_SVG = (stroke: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"><path d="M15 34V14l14 20V14" stroke="${stroke}" stroke-width="2.8" stroke-linecap="square" stroke-linejoin="miter"/><circle cx="33.5" cy="32.5" r="2.6" fill="${stroke}"/></svg>`;

export function markDataUri(stroke = "#fafafa"): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(MARK_SVG(stroke))}`;
}

/** Light mark for the near-black OG canvas. */
export const OG_MARK_SRC = markDataUri("#fafafa");
