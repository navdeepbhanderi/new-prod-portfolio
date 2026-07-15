"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Check,
  Copy,
  FileText,
  FolderKanban,
  Home,
  Layers,
  Mail,
  Milestone,
  Search,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import { EMAIL, SOCIALS } from "@/data/socials";
import { PROFILE } from "@/lib/profile";
import { BRAND_ICONS } from "@/components/icons";
import { useLenis } from "@/components/layout/SmoothScroll";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export const OPEN_PALETTE_EVENT = "navdeep:open-palette";

type Command = {
  id: string;
  group: "Navigate" | "Actions" | "Connect";
  label: string;
  hint?: string;
  keywords: string;
  icon: LucideIcon | (typeof BRAND_ICONS)[keyof typeof BRAND_ICONS];
  /** Stay open after running (e.g. copy feedback). */
  keepOpen?: boolean;
  perform: () => void;
};

function scrollToSection(lenis: ReturnType<typeof useLenis>, id: string) {
  const el = document.getElementById(id);
  // On sub-pages (case studies) the section doesn't exist — route home to it.
  if (!el) {
    window.location.href = `/#${id}`;
    return;
  }
  if (lenis) lenis.scrollTo(el, { offset: -88 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const lenis = useLenis();

  const close = useCallback(() => {
    setOpen(false);
    restoreFocusRef.current?.focus?.();
  }, []);

  const commands = useMemo<Command[]>(() => {
    const nav: Array<{ id: string; label: string; icon: LucideIcon }> = [
      { id: "hero", label: "Home", icon: Home },
      { id: "about", label: "About", icon: User },
      { id: "expertise", label: "Expertise", icon: Layers },
      { id: "projects", label: "Projects", icon: FolderKanban },
      { id: "journey", label: "Experience", icon: Milestone },
      { id: "contact", label: "Contact", icon: Mail },
    ];
    return [
      ...nav.map<Command>(({ id, label, icon }) => ({
        id: `nav-${id}`,
        group: "Navigate",
        label,
        hint: "Jump to section",
        keywords: `${label} section go jump ${id}`,
        icon,
        perform: () => scrollToSection(lenis, id),
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: copied ? "Email copied!" : "Copy email address",
        hint: EMAIL,
        keywords: "copy email address mail clipboard contact",
        icon: copied ? Check : Copy,
        keepOpen: true,
        perform: () => {
          navigator.clipboard?.writeText(EMAIL).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          });
        },
      },
      {
        id: "email",
        group: "Actions",
        label: "Send an email",
        hint: EMAIL,
        keywords: "send email mail compose message hire",
        icon: Mail,
        perform: () => {
          window.location.href = `mailto:${EMAIL}`;
        },
      },
      {
        id: "resume",
        group: "Actions",
        label: "View resume",
        hint: "resume.pdf",
        keywords: "resume cv download pdf curriculum vitae hire experience",
        icon: FileText,
        perform: () => {
          window.open(PROFILE.resume, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "ask-ai",
        group: "Actions",
        label: "Ask Nova",
        hint: "Navdeep's AI assistant",
        keywords: "ask ai chat assistant bot question nova gemini",
        icon: Sparkles,
        perform: () => {
          window.dispatchEvent(new Event("navdeep:open-chat"));
        },
      },
      {
        id: "top",
        group: "Actions",
        label: "Back to top",
        keywords: "back to top scroll up start beginning",
        icon: ArrowUp,
        perform: () => scrollToSection(lenis, "hero"),
      },
      ...SOCIALS.map<Command>((s) => ({
        id: `social-${s.icon}`,
        group: "Connect",
        label: `Open ${s.label}`,
        hint: s.handle,
        keywords: `open ${s.label} ${s.handle} social profile link`,
        icon: BRAND_ICONS[s.icon],
        perform: () => {
          window.open(s.href, "_blank", "noopener,noreferrer");
        },
      })),
    ];
  }, [lenis, copied]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => c.keywords.toLowerCase().includes(q));
  }, [commands, query]);

  const groups = useMemo(() => {
    const order: Command["group"][] = ["Navigate", "Actions", "Connect"];
    return order
      .map((g) => ({ name: g, items: filtered.filter((c) => c.group === g) }))
      .filter((g) => g.items.length > 0);
  }, [filtered]);

  // Global shortcut: ⌘K / Ctrl+K toggles, Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => {
          if (!v) restoreFocusRef.current = document.activeElement as HTMLElement;
          return !v;
        });
      } else if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    const onOpenEvent = () => {
      restoreFocusRef.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    window.addEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    };
  }, [open, close]);

  // Reset + focus + scroll lock while open.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelected(0);
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, lenis]);

  useEffect(() => setSelected(0), [query]);

  // Keep the selected row visible.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${selected}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  const run = useCallback(
    (cmd: Command) => {
      if (cmd.keepOpen) {
        cmd.perform();
        return;
      }
      // Close first: the open-state cleanup restarts Lenis, and a stopped
      // Lenis silently ignores scrollTo. Act on the next tick.
      close();
      window.setTimeout(() => cmd.perform(), 50);
    },
    [close]
  );

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected((s) => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected((s) => Math.max(s - 1, 0));
    } else if (e.key === "Home") {
      e.preventDefault();
      setSelected(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setSelected(filtered.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[selected];
      if (cmd) run(cmd);
    } else if (e.key === "Tab") {
      // Single-control dialog — keep focus on the input.
      e.preventDefault();
    }
  };

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85]" data-cursor="hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Flex-centered wrapper: framer writes inline transforms, which
              would clobber a -translate-x-1/2 centering class. */}
          <div className="pointer-events-none absolute inset-x-0 top-[16svh] flex justify-center px-4">
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: 14, scale: 0.98, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(6px)" }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
            className="glass-strong pointer-events-auto w-full max-w-[560px] overflow-hidden rounded-2xl border border-border shadow-2xl shadow-black/60"
          >
            <div className="flex items-center gap-3 border-b border-border/60 px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Type a command or search…"
                aria-label="Search commands"
                className="w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded-md border border-border bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                esc
              </kbd>
            </div>

            <div
              ref={listRef}
              data-lenis-prevent
              className="max-h-[46svh] overflow-y-auto p-2"
            >
              {groups.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No results for “{query}”
                </p>
              )}
              {groups.map((group) => (
                <div key={group.name} className="mb-1">
                  <p className="px-3 pb-1.5 pt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {group.name}
                  </p>
                  {group.items.map((cmd) => {
                    flatIndex += 1;
                    const index = flatIndex;
                    const Icon = cmd.icon;
                    const active = index === selected;
                    return (
                      <button
                        key={cmd.id}
                        type="button"
                        data-index={index}
                        onClick={() => run(cmd)}
                        onMouseMove={() => setSelected(index)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                          active
                            ? "bg-foreground/[0.08] text-foreground"
                            : "text-foreground/75"
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition-colors",
                            active
                              ? "border-foreground/20 bg-foreground text-background"
                              : "border-border bg-foreground/5 text-foreground/70"
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1 truncate font-medium">
                          {cmd.label}
                        </span>
                        {cmd.hint && (
                          <span className="hidden truncate font-mono text-[11px] text-muted-foreground sm:block">
                            {cmd.hint}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              <span className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
              </span>
              <span>Navdeep Bhanderi</span>
            </div>
          </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
