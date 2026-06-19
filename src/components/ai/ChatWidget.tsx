"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowUp, RefreshCw } from "lucide-react";
import { SUGGESTED_QUESTIONS, GREETING_MESSAGE } from "@/lib/ai/knowledge";
import { cn } from "@/lib/utils";

type Message = { id: number; role: "user" | "assistant"; content: string };

const OPEN_EVENT = "navdeep:open-chat";
const STORAGE_KEY = "navdeep-chat-v1";
const GREETING: Message = { id: 0, role: "assistant", content: GREETING_MESSAGE };

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
  const [hydrated, setHydrated] = useState(false);
  const idRef = useRef(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Allow other components (e.g. the navbar) to open the chat.
  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [open, messages, loading]);

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
      const data = await res.json();
      const reply =
        data?.reply ??
        "Sorry, I couldn't reach the assistant just now. You can email Navdeep at navdeepbhanderi1@gmail.com.";
      setMessages((prev) => [...prev, { id: idRef.current++, role: "assistant", content: reply }]);
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
    }
  };

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
              Ask Navdeep AI
            </motion.span>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : "Ask Navdeep AI"}
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
              role="dialog"
              aria-label="Ask Navdeep AI"
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
                    <span className="text-sm font-semibold">Navdeep AI</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Ask me about Navdeep
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
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn("flex gap-2.5", m.role === "user" ? "flex-row-reverse" : "flex-row")}
                  >
                    {m.role === "assistant" && (
                      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-foreground text-background">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div
                      className={cn(
                        "max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        m.role === "user"
                          ? "rounded-tr-sm bg-foreground text-background"
                          : "rounded-tl-sm border border-border bg-background/50 text-foreground/90"
                      )}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

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
                  placeholder="Ask anything about Navdeep…"
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
