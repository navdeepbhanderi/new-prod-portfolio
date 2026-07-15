import { EMAIL, SOCIALS } from "@/data/socials";
import { PROJECTS } from "@/data/projects";

/**
 * The fixed catalog of actions the chat assistant may attach to a reply.
 * Local intents reference these by key; Gemini is given the exact tokens in
 * its system prompt. The widget only renders actions whose href appears in
 * ALLOWED_ACTION_HREFS — a hallucinated or injected link is dropped, never
 * rendered.
 */

export type ChatAction = { label: string; href: string };

const GITHUB = SOCIALS.find((s) => s.icon === "github")?.href ?? "";
const LINKEDIN = SOCIALS.find((s) => s.icon === "linkedin")?.href ?? "";

export const CHAT_ACTIONS: Record<string, ChatAction> = {
  ...Object.fromEntries(
    PROJECTS.map((p) => [
      `case-${p.id}`,
      { label: `Case study: ${p.title}`, href: `/projects/${p.id}` },
    ])
  ),
  email: { label: "Email Navdeep", href: `mailto:${EMAIL}` },
  contact: { label: "Go to the contact form", href: "/#contact" },
  github: { label: "View GitHub", href: GITHUB },
  linkedin: { label: "Open LinkedIn", href: LINKEDIN },
};

export const ALLOWED_ACTION_HREFS = new Set(
  Object.values(CHAT_ACTIONS).map((a) => a.href)
);

/** Resolve intent action keys to concrete actions, dropping unknown keys. */
export function resolveActions(keys: string[] | undefined): ChatAction[] {
  if (!keys?.length) return [];
  return keys
    .map((k) => CHAT_ACTIONS[k])
    .filter(Boolean)
    .slice(0, 3);
}

/** Gemini emits actions as trailing [[label|href]] tokens; see context.ts. */
export const ACTION_TOKEN_RE = /\[\[([^\[\]|]{1,60})\|([^\[\]|]{1,200})\]\]/g;
