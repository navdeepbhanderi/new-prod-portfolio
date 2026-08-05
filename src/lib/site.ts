/**
 * Canonical production origin — single source of truth for all SEO surfaces
 * (metadata, JSON-LD, sitemap, robots, OG images) and for absolute links in
 * the contact emails.
 *
 * `NEXT_PUBLIC_` is deliberate. `profile.ts` imports this and is itself
 * imported by client components, so the constant ends up in the browser bundle;
 * a server-only var would be `undefined` there and silently fall back, leaving
 * client and server disagreeing about the origin. The public prefix is inlined
 * into both at build time, so there is exactly one value.
 *
 * Unset, it stays the custom domain. Set it when deploying anywhere else — a
 * *.vercel.app URL, a staging host — or every canonical tag, sitemap entry and
 * OG image will point at a domain that deployment does not serve.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://navdeepbhanderi.dev"
).replace(/\/+$/, "");
