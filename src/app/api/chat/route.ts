import { NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/ai/context";
import { matchIntent } from "@/lib/ai/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function localReply(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) return "Hi! Ask me anything about Navdeep — his skills, projects, or how to reach him.";
  return matchIntent(lastUser.content).answer;
}

export async function POST(req: Request) {
  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Keep the payload bounded.
  const trimmed = messages
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .slice(-12);

  if (trimmed.length === 0) {
    return NextResponse.json({ error: "No message provided." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // No key configured → use the built-in knowledge base so the widget still works.
  if (!apiKey) {
    return NextResponse.json({ reply: localReply(trimmed), source: "local" });
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  try {
    // Retry a couple of times on transient overload/rate errors before falling back.
    let res: Response | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
      if (res.ok) break;
      if (res.status !== 429 && res.status !== 503) break;
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }

    if (!res || !res.ok) {
      const detail = res ? await res.text() : "no response";
      console.error("Gemini API error:", res?.status, detail);
      // Fall back to local so the user always gets an answer.
      return NextResponse.json({ reply: localReply(trimmed), source: "local-fallback" });
    }

    const data = await res.json();
    const reply: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("")
      .trim();

    if (!reply) {
      return NextResponse.json({ reply: localReply(trimmed), source: "local-fallback" });
    }

    return NextResponse.json({ reply, source: "gemini" });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ reply: localReply(trimmed), source: "local-fallback" });
  }
}
