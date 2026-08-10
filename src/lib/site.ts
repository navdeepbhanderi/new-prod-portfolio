/**
 * Canonical production origin for SEO surfaces (metadata, JSON-LD, sitemap,
 * robots, OG images) and absolute links in emails. NEXT_PUBLIC_ so the value
 * is inlined into both server and client bundles. Set NEXT_PUBLIC_SITE_URL
 * when deploying anywhere other than the custom domain.
 */
const raw = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://navdeepbhanderi.dev"
).replace(/\/+$/, "");

// Force https on public origins: an http:// value here poisons every
// canonical tag, sitemap entry, OG url, and JSON-LD id — search engines then
// see the https pages declaring a different (http) canonical and refuse to
// consolidate. Local/LAN dev origins keep their scheme.
export const SITE_URL = /^http:\/\/(localhost|127\.|192\.168\.|10\.)/.test(raw)
  ? raw
  : raw.replace(/^http:\/\//, "https://");
