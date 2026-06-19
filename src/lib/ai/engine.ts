import { INTENTS, FALLBACK_ANSWER } from "./knowledge";
import type { Intent } from "@/types";

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "do", "does", "did", "of", "to", "in",
  "on", "for", "and", "or", "his", "her", "he", "she", "him", "you", "your", "me", "i",
  "what", "whats", "tell", "about", "can", "could", "would", "should", "please", "with",
  "this", "that", "it", "be", "have", "has", "had",
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s.+#]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

export type MatchResult = {
  intent: Intent | null;
  answer: string;
  related: string[];
  confidence: number;
};

/**
 * Scores the query against every intent using a blend of:
 *  - phrase matching (a keyword phrase appearing verbatim is a strong signal)
 *  - token overlap (individual significant words shared with a keyword)
 * Returns the best intent above a confidence threshold, else a graceful fallback.
 */
export function matchIntent(query: string): MatchResult {
  const normalizedQuery = normalize(query);
  const queryTokens = new Set(tokenize(query));

  if (queryTokens.size === 0 && normalizedQuery.length === 0) {
    return { intent: null, answer: FALLBACK_ANSWER, related: [], confidence: 0 };
  }

  let best: Intent | null = null;
  let bestScore = 0;

  for (const intent of INTENTS) {
    let score = 0;

    for (const keyword of intent.keywords) {
      const kw = normalize(keyword);
      const kwTokens = kw.split(" ").filter(Boolean);

      // Strong signal: multi-word keyword phrase present verbatim.
      if (kwTokens.length > 1 && normalizedQuery.includes(kw)) {
        score += 6;
        continue;
      }

      // Single keyword token appears as a query token (or as a prefix, e.g. "technolog").
      for (const token of queryTokens) {
        if (token === kw) {
          score += 3;
        } else if (kw.length >= 4 && (token.startsWith(kw) || kw.startsWith(token))) {
          score += 2;
        } else if (token.includes(kw) && kw.length >= 4) {
          score += 1;
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = intent;
    }
  }

  // Threshold guards against weak/irrelevant matches.
  if (!best || bestScore < 2) {
    return { intent: null, answer: FALLBACK_ANSWER, related: [], confidence: 0 };
  }

  return {
    intent: best,
    answer: best.answer,
    related: best.related ?? [],
    confidence: Math.min(1, bestScore / 8),
  };
}
