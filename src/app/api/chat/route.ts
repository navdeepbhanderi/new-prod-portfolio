import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai/context";
import { matchIntent } from "@/lib/ai/engine";
import { resolveActions, type ChatAction } from "@/lib/ai/actions";
import { createRateLimiter, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// Keep the payload — and therefore Gemini spend — bounded.
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 1000;
const UPSTREAM_TIMEOUT_MS = 25_000;

// 30 messages/hour/IP is generous for a human conversation.
const rateLimited = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 30 });

function localReply(messages: ChatMessage[]): {
  answer: string;
  related: string[];
  actions: ChatAction[];
} {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return {
      answer: "Hi! Ask me anything about Navdeep — his skills, projects, or how to reach him.",
      related: [],
      actions: [],
    };
  }
  const match = matchIntent(lastUser.content);
  return {
    answer: match.answer,
    related: match.related,
    actions: resolveActions(match.intent?.actions),
  };
}

// The widget reads the body as a plain-text stream; `x-chat-source` says
// which brain answered (gemini | local | local-fallback), `x-chat-related`
// carries follow-up question chips and `x-chat-actions` tappable action
// buttons for local answers (Gemini emits actions as trailing tokens).
function textResponse(
  text: string,
  source: string,
  related: string[] = [],
  actions: ChatAction[] = []
): Response {
  const headers: Record<string, string> = {
    "Content-Type": "text/plain; charset=utf-8",
    "X-Chat-Source": source,
  };
  if (related.length > 0) {
    headers["X-Chat-Related"] = encodeURIComponent(JSON.stringify(related.slice(0, 3)));
  }
  if (actions.length > 0) {
    headers["X-Chat-Actions"] = encodeURIComponent(JSON.stringify(actions.slice(0, 3)));
  }
  return new Response(text, { headers });
}

/**
 * Re-emit Gemini's SSE stream as a plain text stream of answer chunks.
 * If the stream dies before producing anything, fall back to the local
 * knowledge base so the visitor always gets an answer.
 */
function geminiTextStream(upstream: ReadableStream<Uint8Array>, fallback: () => string): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.getReader();
      let buffer = "";
      let sent = false;

      const emit = (line: string) => {
        if (!line.startsWith("data:")) return;
        const json = line.slice(5).trim();
        if (!json || json === "[DONE]") return;
        try {
          const data = JSON.parse(json);
          const text: string = (data?.candidates?.[0]?.content?.parts ?? [])
            .map((p: { text?: string }) => p.text ?? "")
            .join("");
          if (text) {
            controller.enqueue(encoder.encode(text));
            sent = true;
          }
        } catch {
          /* skip malformed SSE chunk */
        }
      };

      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) emit(line);
        }
        emit(buffer);
      } catch (err) {
        console.error("Gemini stream interrupted:", err);
      } finally {
        if (!sent) controller.enqueue(encoder.encode(fallback()));
        controller.close();
      }
    },
  });
}

export async function POST(req: Request) {
  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const trimmed: ChatMessage[] = messages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim() !== ""
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

  if (trimmed.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { error: "That's a lot of questions! Please take a short break and try again in a while." },
      { status: 429 }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // No key configured → use the built-in knowledge base so the widget still works.
  if (!apiKey) {
    const { answer, related, actions } = localReply(trimmed);
    return textResponse(answer, "local", related, actions);
  }

  const payload = JSON.stringify({
    system_instruction: { parts: [{ text: buildSystemPrompt() }] },
    contents: trimmed.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      temperature: 0.6,
      maxOutputTokens: 600,
      topP: 0.95,
      // Disable extended "thinking" — this is a simple Q&A bot, so keep
      // responses fast and token-cheap. (Supported on Gemini 2.5 models.)
      thinkingConfig: { thinkingBudget: 0 },
    },
  });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`;

  try {
    // One timeout covers connection + the whole stream; 600 output tokens
    // finish well inside it. Retry a couple of times on transient
    // overload/rate errors before falling back.
    const signal = AbortSignal.timeout(UPSTREAM_TIMEOUT_MS);
    let res: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Header, not `?key=` — query strings leak into logs and traces.
          "x-goog-api-key": apiKey,
        },
        body: payload,
        signal,
      });
      if (res.ok) break;
      if (res.status !== 429 && res.status !== 503) break;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }

    if (!res || !res.ok || !res.body) {
      const detail = res ? await res.text() : "no response";
      console.error("Gemini API error:", res?.status, detail);
      // Fall back to local so the user always gets an answer.
      const { answer, related, actions } = localReply(trimmed);
      return textResponse(answer, "local-fallback", related, actions);
    }

    return new Response(geminiTextStream(res.body, () => localReply(trimmed).answer), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Chat-Source": "gemini",
      },
    });
  } catch (err) {
    console.error("Chat route error:", err);
    const { answer, related, actions } = localReply(trimmed);
    return textResponse(answer, "local-fallback", related, actions);
  }
}
