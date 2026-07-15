"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "next-view-transitions";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowUp, ArrowUpRight, RefreshCw } from "lucide-react";
import { SUGGESTED_QUESTIONS, GREETING_MESSAGE, ASSISTANT_NAME } from "@/lib/ai/knowledge";
import {
  ACTION_TOKEN_RE,
  ALLOWED_ACTION_HREFS,
  type ChatAction,
} from "@/lib/ai/actions";
import { useLenis } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  /** Follow-up question chips (local knowledge-base answers only). */
  related?: string[];
  /** Tappable action buttons — validated against the fixed catalog. */
  actions?: ChatAction[];
};

/** Strip complete [[label|href]] tokens plus any half-streamed one at the end. */
function stripActionTokens(text: string): string {
  return text
    .replace(ACTION_TOKEN_RE, "")
    .replace(/\[\[[^\]]*$/, "")
    .trimEnd();
}

/** Parse Gemini's trailing tokens, keeping only catalog-approved hrefs. */
function parseActionTokens(text: string): ChatAction[] {
  const actions: ChatAction[] = [];
  for (const m of text.matchAll(ACTION_TOKEN_RE)) {
    const [, label, href] = m;
    if (ALLOWED_ACTION_HREFS.has(href) && !actions.some((a) => a.href === href)) {
      actions.push({ label: label.trim(), href });
    }
  }
  return actions.slice(0, 3);
}

const OPEN_EVENT = "navdeep:open-chat";
const STORAGE_KEY = "navdeep-chat-v1";
const GREETING: Message = { id: 0, role: "assistant", content: GREETING_MESSAGE };

const LINK_RE = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+\w)/g;

/** Inline pass: **bold** plus auto-linked URLs and email addresses. */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).flatMap((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return [<strong key={i}>{part.slice(2, -2)}</strong>];
    }
    // split with a capture group: captured links land at odd indices
    return part.split(LINK_RE).map((seg, j) => {
      if (j % 2 === 0) return seg;
      const href = seg.includes("@") && !seg.startsWith("http") ? `mailto:${seg}` : seg;
      return (
        <a
          key={`${i}-${j}`}
          href={href}
          target={href.startsWith("mailto:") ? undefined : "_blank"}
          rel="noopener noreferrer"
          className="underline decoration-foreground/40 underline-offset-2 hover:decoration-foreground"
        >
          {seg}
        </a>
      );
    });
  });
}

type Block = { type: "p"; text: string } | { type: "ul"; items: string[] };

function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of content.replace(/\r/g, "").split("\n")) {
    const bullet = raw.match(/^\s*[*•-]\s+(.*)/);
    if (bullet) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.items.push(bullet[1]);
      else blocks.push({ type: "ul", items: [bullet[1]] });
      continue;
    }
    const line = raw.replace(/^#{1,4}\s+/, "").trim();
    if (line) blocks.push({ type: "p", text: line });
  }
  return blocks;
}

/**
 * Streaming words: index-keyed spans so React preserves already-mounted
 * words across re-renders — only the newly appended word mounts and plays
 * its fade-in. Whitespace (incl. newlines) is passed through untouched.
 */
function StreamWords({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((token, i) =>
        /^\s*$/.test(token) ? (
          token
        ) : (
          <span key={i} className="chat-word-in">
            {token}
          </span>
        )
      )}
    </>
  );
}

/**
 * Markdown-lite renderer: models drift into markdown no matter what the
 * prompt says, so render bold / bullets / links instead of raw asterisks.
 * While streaming, words render as fading spans (inline markdown is applied
 * once the reply completes) and the caret rides after the last character.
 */
function MessageContent({ content, caret = false }: { content: string; caret?: boolean }) {
  const blocks = parseBlocks(content);
  const caretEl = caret ? (
    <span
      aria-hidden
      className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse bg-foreground/70 align-middle"
    />
  ) : null;

  if (blocks.length === 0) return <div>{caretEl}</div>;

  // While streaming, words fade in; the finished message swaps to the full
  // inline treatment (bold, links) — same text, so the swap is invisible.
  const renderText = (text: string) => (caret ? <StreamWords text={text} /> : renderInline(text));

  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        const isLast = i === blocks.length - 1;
        if (block.type === "ul") {
          return (
            <ul key={i} className="ml-4 list-disc space-y-1">
              {block.items.map((item, j) => (
                <li key={j}>
                  {renderText(item)}
                  {isLast && j === block.items.length - 1 && caretEl}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {renderText(block.text)}
            {isLast && caretEl}
          </p>
        );
      })}
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5">
      <motion.span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-foreground text-background"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles className="h-3.5 w-3.5" />
      </motion.span>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-background/50 px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full bg-foreground/60"
            animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<number | null>(null);
  const [hydrated, setHydrated] = useState(false);
  // A question handed over by another surface (e.g. the terminal's `ask`).
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const lenis = useLenis();

  // Section actions ("/#contact") can't rely on plain hash links: on the home
  // page Lenis owns scrolling, and on case-study pages the section doesn't
  // exist — route home to it instead (same pattern as navbar/palette).
  const goToSection = (href: string) => {
    const id = href.slice(2);
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) {
      window.location.href = href;
      return;
    }
    setTimeout(() => {
      if (lenis) lenis.scrollTo(el, { offset: -88 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  // Restore history from localStorage on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Message[];
        if (Array.isArray(saved) && saved.length) {
          setMessages(saved);
          idRef.current = Math.max(...saved.map((m) => m.id)) + 1;
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist history whenever it changes (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [messages, hydrated]);

  // Allow other components (navbar, palette, terminal) to open the chat —
  // optionally with a question to submit on arrival (CustomEvent detail).
  useEffect(() => {
    const handler = (e: Event) => {
      setOpen(true);
      const q = (e as CustomEvent).detail?.question;
      if (typeof q === "string" && q.trim()) setPendingQuestion(q.trim());
    };
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Return focus to the launcher when the dialog closes.
  useEffect(() => {
    if (wasOpen.current && !open) launcherRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  // Keep Tab cycling inside the dialog while it's open.
  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const root = dialogRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const scrollToBottom = (smooth: boolean) => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    });
  };

  // Focus the input once per open — not on every message update.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Follow the conversation. While a reply streams, stick to the bottom
  // instantly — re-triggering a smooth scroll on every chunk makes the
  // viewport rubber-band.
  useEffect(() => {
    if (open) scrollToBottom(streamingId === null);
  }, [open, messages, loading, streamingId]);

  const resetChat = () => {
    setMessages([GREETING]);
    idRef.current = 1;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    const userMsg: Message = { id: idRef.current++, role: "user", content };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });

      // Errors (rate limit, bad request) come back as JSON with an `error`.
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        const reply =
          data?.error ??
          "Sorry, I couldn't reach the assistant just now. You can email Navdeep at navdeepbhanderi1@gmail.com.";
        setMessages((prev) => [...prev, { id: idRef.current++, role: "assistant", content: reply }]);
        return;
      }

      // Follow-up chips + action buttons ride along as headers on local answers.
      let related: string[] | undefined;
      let headerActions: ChatAction[] | undefined;
      try {
        const rawRelated = res.headers.get("x-chat-related");
        if (rawRelated) related = JSON.parse(decodeURIComponent(rawRelated));
        const rawActions = res.headers.get("x-chat-actions");
        if (rawActions) {
          headerActions = (JSON.parse(decodeURIComponent(rawActions)) as ChatAction[]).filter(
            (a) => a && typeof a.href === "string" && ALLOWED_ACTION_HREFS.has(a.href)
          );
        }
      } catch {
        /* malformed header — skip chips/actions */
      }

      // The reply streams as plain text, but upstream chunks arrive in big
      // multi-sentence bursts. Buffer them and reveal at a smooth typewriter
      // rate instead — the pace adapts to how far behind the buffer we are,
      // so it never lags the stream yet never jumps whole paragraphs.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantId: number | null = null;
      let acc = "";

      const render = (text: string) => {
        if (assistantId === null) {
          assistantId = idRef.current++;
          setLoading(false);
          setStreamingId(assistantId);
          const id = assistantId;
          setMessages((prev) => [...prev, { id, role: "assistant", content: text }]);
        } else {
          const id = assistantId;
          setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: text } : m)));
        }
      };

      await new Promise<void>((resolve) => {
        let shown = 0;
        let streamDone = false;
        let last: number | null = null;

        let lastSlice = "";
        const drain = (now: number) => {
          const dt = last === null ? 0.016 : Math.min((now - last) / 1000, 0.1);
          last = now;
          const visible = stripActionTokens(acc);
          const backlog = visible.length - shown;
          if (backlog > 0) {
            // Deliberate, time-based pace (~50 chars/sec baseline, hard-capped
            // boost for long backlogs) revealed at WORD granularity — each new
            // word mounts with a fade-in (see MessageContent), which is what
            // makes professional chatbots feel like flowing ink instead of a
            // fast typewriter. A typical reply reads out over ~3 seconds.
            const rate = 50 + Math.min(250, backlog * 0.3);
            shown = Math.min(visible.length, shown + rate * dt);
            // Snap forward to the end of the current word — whole words only.
            let cut = Math.floor(shown);
            if (cut > 0 && cut < visible.length) {
              const rel = visible.slice(cut).search(/\s/);
              cut = rel === -1 ? visible.length : cut + rel;
            }
            const slice = visible.slice(0, cut);
            if (slice !== lastSlice && slice.trim()) {
              lastSlice = slice;
              render(slice);
            }
          }
          if (streamDone && shown >= stripActionTokens(acc).length) {
            resolve();
            return;
          }
          requestAnimationFrame(drain);
        };
        requestAnimationFrame(drain);

        (async () => {
          try {
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              acc += decoder.decode(value, { stream: true });
            }
            acc += decoder.decode();
          } catch {
            /* stream interrupted — reveal whatever arrived */
          }
          streamDone = true;
        })();
      });

      const finalText = stripActionTokens(acc);
      if (finalText.trim()) render(finalText);

      // Gemini emits actions as trailing tokens; local sends them as a header.
      const actions = headerActions?.length ? headerActions : parseActionTokens(acc);

      if (assistantId !== null && (related?.length || actions.length)) {
        const id = assistantId;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id
              ? { ...m, related, actions: actions.length ? actions : undefined }
              : m
          )
        );
      }

      if (assistantId === null) {
        setMessages((prev) => [
          ...prev,
          {
            id: idRef.current++,
            role: "assistant",
            content:
              "Sorry, I couldn't reach the assistant just now. You can email Navdeep at navdeepbhanderi1@gmail.com.",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: idRef.current++,
          role: "assistant",
          content:
            "Sorry, something went wrong reaching the assistant. You can email Navdeep at navdeepbhanderi1@gmail.com.",
        },
      ]);
    } finally {
      setLoading(false);
      setStreamingId(null);
    }
  };

  // Submit a handed-over question once the dialog is open and idle.
  useEffect(() => {
    if (open && pendingQuestion && !loading) {
      const q = pendingQuestion;
      setPendingQuestion(null);
      send(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pendingQuestion, loading]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const showStarters = messages.length <= 1 && !loading;

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-[90] flex items-center gap-3">
        {/* hover label (desktop) */}
        <AnimatePresence>
          {!open && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="pointer-events-none hidden rounded-full border border-border bg-background/80 px-3 py-1.5 text-xs font-medium text-foreground/90 backdrop-blur-md md:block"
            >
              Ask {ASSISTANT_NAME}
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          ref={launcherRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : `Ask ${ASSISTANT_NAME} — Navdeep's AI assistant`}
          aria-expanded={open}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, type: "spring", stiffness: 260, damping: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.93 }}
          className="group relative grid h-14 w-14 place-items-center rounded-full border border-white/10 bg-gradient-to-b from-zinc-800 to-zinc-950 text-foreground shadow-lg shadow-black/50 transition-colors hover:border-white/20"
        >
          {/* soft accent glow */}
          <span className="absolute -inset-2 -z-10 rounded-full bg-[radial-gradient(circle,hsl(230_65%_55%/0.30),transparent_70%)] blur-md transition-opacity duration-300 group-hover:opacity-80" />
          {/* subtle top sheen */}
          <span className="pointer-events-none absolute inset-px rounded-full bg-gradient-to-b from-white/10 to-transparent" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.18 }}
            >
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Sparkles className="h-[1.3rem] w-[1.3rem] drop-shadow-[0_0_6px_hsl(230_70%_70%/0.5)]" />
              )}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {/* mobile backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-[88] bg-black/50 backdrop-blur-sm sm:hidden"
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${ASSISTANT_NAME} — Navdeep's AI assistant`}
              onKeyDown={trapFocus}
              data-cursor="hidden"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "bottom right" }}
              className={cn(
                "glass-strong fixed z-[89] flex flex-col overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/50",
                "inset-x-3 bottom-24 top-20 sm:inset-x-auto sm:top-auto",
                "sm:bottom-24 sm:right-6 sm:h-[600px] sm:max-h-[calc(100dvh-7rem)] sm:w-[400px]"
              )}
            >
              {/* header */}
              <div className="flex shrink-0 items-center justify-between border-b border-border/60 bg-background/40 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{ASSISTANT_NAME}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Navdeep&rsquo;s AI assistant
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {messages.length > 1 && (
                    <button
                      type="button"
                      onClick={resetChat}
                      aria-label="Clear chat"
                      title="Clear chat"
                      className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close chat"
                    className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* messages — min-h-0 lets this flex child shrink so overflow scrolls;
                  data-lenis-prevent stops the page's smooth-scroll from eating wheel events */}
              <div
                ref={scrollRef}
                data-lenis-prevent
                className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-5"
              >
                {messages.map((m, mi) => {
                  const isLast = mi === messages.length - 1;
                  return (
                    <div key={m.id} className="flex flex-col gap-2.5">
                      <div
                        className={cn(
                          "flex gap-2.5",
                          m.role === "user" ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        {m.role === "assistant" && (
                          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-foreground text-background">
                            <Sparkles className="h-3.5 w-3.5" />
                          </span>
                        )}
                        <div
                          className={cn(
                            "max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                            m.role === "user"
                              ? "rounded-tr-sm bg-foreground text-background"
                              : "rounded-tl-sm border border-border bg-background/50 text-foreground/90"
                          )}
                        >
                          <MessageContent content={m.content} caret={m.id === streamingId} />
                        </div>
                      </div>

                      {/* Action buttons — the assistant as navigator. */}
                      {m.role === "assistant" && !!m.actions?.length && (
                        <div className="flex flex-wrap gap-2 pl-9">
                          {m.actions.map((action) => {
                            const isExternal =
                              action.href.startsWith("http") ||
                              action.href.startsWith("mailto:");
                            const isSection = action.href.startsWith("/#");
                            const buttonClasses =
                              "inline-flex items-center gap-1.5 rounded-full border border-foreground/20 bg-foreground/10 px-3.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-foreground/35 hover:bg-foreground/15";
                            if (isExternal) {
                              return (
                                <a
                                  key={action.href}
                                  href={action.href}
                                  target={action.href.startsWith("mailto:") ? undefined : "_blank"}
                                  rel="noopener noreferrer"
                                  className={buttonClasses}
                                >
                                  {action.label}
                                  <ArrowUpRight className="h-3 w-3" />
                                </a>
                              );
                            }
                            if (isSection) {
                              return (
                                <a
                                  key={action.href}
                                  href={action.href}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    goToSection(action.href);
                                  }}
                                  className={buttonClasses}
                                >
                                  {action.label}
                                  <ArrowUpRight className="h-3 w-3" />
                                </a>
                              );
                            }
                            return (
                              <Link
                                key={action.href}
                                href={action.href}
                                onClick={() => setOpen(false)}
                                className={buttonClasses}
                              >
                                {action.label}
                                <ArrowUpRight className="h-3 w-3" />
                              </Link>
                            );
                          })}
                        </div>
                      )}

                      {/* Follow-up chips under the latest answer. */}
                      {m.role === "assistant" &&
                        isLast &&
                        !loading &&
                        m.id !== streamingId &&
                        !!m.related?.length && (
                          <div className="flex flex-wrap gap-2 pl-9">
                            {m.related.map((q) => (
                              <button
                                key={q}
                                type="button"
                                onClick={() => send(q)}
                                className="rounded-full border border-border bg-foreground/[0.03] px-3 py-1 text-left text-xs text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  );
                })}

                {loading && <TypingIndicator />}

                {showStarters && (
                  <div className="flex flex-col gap-2 pt-1">
                    {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        className="self-start rounded-full border border-border bg-foreground/[0.03] px-3.5 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* input */}
              <form
                onSubmit={onSubmit}
                className="flex shrink-0 items-center gap-2 border-t border-border/60 bg-background/40 p-3"
              >
                <label htmlFor="chat-input" className="sr-only">
                  Ask a question about Navdeep
                </label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Navdeep…"
                  autoComplete="off"
                  className="h-10 w-full rounded-full border border-border bg-background/60 px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground/30"
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!input.trim() || loading}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
