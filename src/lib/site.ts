/**
 * Canonical production origin for SEO surfaces (metadata, JSON-LD, sitemap,
 * robots, OG images) and absolute links in emails. NEXT_PUBLIC_ so the value
 * is inlined into both server and client bundles. Set NEXT_PUBLIC_SITE_URL
 * when deploying anywhere other than the custom domain.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://navdeepbhanderi.dev"
).replace(/\/+$/, "");
