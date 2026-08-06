"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTransitionRouter } from "next-view-transitions";
import {
  ArrowUp,
  Check,
  ChevronRight,
  Code2,
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
import { PROJECTS } from "@/data/projects";
import { EXPERTISE } from "@/data/expertise";
import { PROFILE } from "@/lib/profile";
import { SECTIONS } from "@/data/navigation";
import { BRAND_ICONS } from "@/components/icons";
import { useLenis } from "@/components/layout/SmoothScroll";
import { holdScroll } from "@/lib/scroll-lock";
import { EASE_OUT, DUR } from "@/lib/motion";
import { OPEN_CHAT_EVENT, OPEN_PALETTE_EVENT } from "@/lib/events";
import { cn } from "@/lib/utils";

type Group = "Navigate" | "Projects" | "Expertise" | "Actions" | "Connect";

type Command = {
  id: string;
  group: Group;
  label: string;
  hint?: string;
  /** Right-aligned mono tag — a stack name or a keyboard shortcut. */
  tag?: string;
  keywords: string;
  icon?: LucideIcon | (typeof BRAND_ICONS)[keyof typeof BRAND_ICONS];
  /** Rendered instead of an icon (project index chips). */
  badge?: string;
  /** Stay open after running (e.g. copy feedback). */
  keepOpen?: boolean;
  perform: () => void;
};

const SECTION_ICONS: Record<string, LucideIcon> = {
  hero: Home,
  about: User,
  expertise: Layers,
  projects: FolderKanban,
  journey: Milestone,
  contact: Mail,
};

const GROUP_ORDER: Group[] = [
  "Navigate",
  "Projects",
  "Expertise",
  "Actions",
  "Connect",
];

/** Every technology, with the domain it belongs to — the searchable index. */
const TECHNOLOGIES = Array.from(
  EXPERTISE.reduce((map, category) => {
    category.technologies.forEach((tech) => {
      if (!map.has(tech)) map.set(tech, category);
    });
    return map;
  }, new Map<string, (typeof EXPERTISE)[number]>())
);

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const lenis = useLenis();
  const router = useTransitionRouter();

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      // On sub-pages (case studies) the section doesn't exist — route home.
      if (!el) {
        router.push(`/#${id}`);
        return;
      }
      if (lenis) lenis.scrollTo(el, { offset: -88 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [lenis, router]
  );

  const close = useCallback(() => {
    setOpen(false);
    restoreFocusRef.current?.focus?.();
  }, []);

  const copyEmail = useCallback(() => {
    navigator.clipboard?.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, []);

  const askAi = useCallback(() => {
    window.dispatchEvent(new Event(OPEN_CHAT_EVENT));
  }, []);

  const commands = useMemo<Command[]>(() => {
    return [
      ...SECTIONS.map<Command>(({ id, label }) => ({
        id: `nav-${id}`,
        group: "Navigate",
        label,
        hint: "Jump to section",
        keywords: `${label} section go jump ${id}`,
        icon: SECTION_ICONS[id],
        perform: () => scrollToSection(id),
      })),

      ...PROJECTS.map<Command>((project) => ({
        id: `project-${project.id}`,
        group: "Projects",
        label: project.title,
        badge: project.index,
        tag: project.stack[0],
        keywords: `${project.title} ${project.tagline} ${project.role} ${project.year} ${project.stack.join(" ")} case study project`,
        // Client-side navigation keeps the view transition and the prefetch
        // warmed by RoutePrefetch.
        perform: () => router.push(`/projects/${project.id}`),
      })),

      ...TECHNOLOGIES.map<Command>(([tech, category]) => ({
        id: `tech-${tech}`,
        group: "Expertise",
        label: tech,
        hint: `${category.label}, ${category.technologies.length} technologies`,
        keywords: `${tech} ${category.label} technology stack skill`,
        icon: Code2,
        perform: () => scrollToSection("expertise"),
      })),

      {
        id: "ask-ai",
        group: "Actions",
        label: `Ask ${PROFILE.firstName}'s AI about my work`,
        tag: "⌘I",
        keywords: "ask ai chat assistant bot question nova gemini",
        icon: Sparkles,
        perform: askAi,
      },
      {
        id: "copy-email",
        group: "Actions",
        label: copied ? "Email copied!" : "Copy email address",
        hint: EMAIL,
        tag: "⌘E",
        keywords: "copy email address mail clipboard contact",
        icon: copied ? Check : Copy,
        keepOpen: true,
        perform: copyEmail,
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
        hint: "PDF",
        keywords: "resume cv download pdf curriculum vitae hire experience",
        icon: FileText,
        perform: () => {
          window.open(PROFILE.resume, "_blank", "noopener,noreferrer");
        },
      },
      {
        id: "top",
        group: "Actions",
        label: "Back to top",
        keywords: "back to top scroll up start beginning",
        icon: ArrowUp,
        perform: () => scrollToSection("hero"),
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
  }, [router, scrollToSection, copied, copyEmail, askAi]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    // The long technology index only shows once you search.
    if (!q) return commands.filter((c) => c.group !== "Expertise");
    return commands.filter((c) =>
      `${c.label} ${c.keywords}`.toLowerCase().includes(q)
    );
  }, [commands, query]);

  const groups = useMemo(
    () =>
      GROUP_ORDER.map((name) => ({
        name,
        items: filtered.filter((c) => c.group === name),
      })).filter((g) => g.items.length > 0),
    [filtered]
  );

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

  // Flag the document while open so stacked overlays (chat) leave Escape to us.
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.dataset.paletteOpen = "true";
    else delete root.dataset.paletteOpen;
    return () => {
      delete root.dataset.paletteOpen;
    };
  }, [open]);

  // Reset + focus while open; scroll lock is ref-counted (see scroll-lock.ts).
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSelected(0);
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const release = holdScroll(lenis);
    return () => {
      clearTimeout(t);
      release();
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
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "i") {
      e.preventDefault();
      close();
      window.setTimeout(askAi, 50);
    } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "e") {
      e.preventDefault();
      copyEmail();
    } else if (e.key === "ArrowDown") {
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

  const activeId = filtered[selected]?.id;
  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85]" data-cursor="hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.micro }}
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={close}
          />

          {/* Flex-centered wrapper: framer writes inline transforms, which
              would clobber a -translate-x-1/2 centering class. */}
          <div className="pointer-events-none absolute inset-x-0 top-[12svh] flex justify-center px-4 sm:top-[16svh]">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: 14, scale: 0.98, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(6px)" }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="glass-strong pointer-events-auto w-full max-w-[38rem] overflow-hidden rounded-3xl border border-border shadow-2xl shadow-black/60"
            >
              <div className="flex items-center gap-3 border-b border-border/60 px-4">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onInputKeyDown}
                  placeholder="Search projects, skills, actions…"
                  aria-label="Search commands"
                  role="combobox"
                  aria-expanded
                  aria-controls="palette-list"
                  aria-activedescendant={activeId}
                  autoComplete="off"
                  // text-base below sm — sub-16px fonts make iOS zoom on focus.
                  className="w-full bg-transparent py-4 text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-[15px]"
                />
                <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:block">
                  esc to close
                </span>
              </div>

              <div
                ref={listRef}
                id="palette-list"
                role="listbox"
                aria-label="Results"
                data-lenis-prevent
                className="max-h-[52svh] overflow-y-auto p-2"
              >
                {groups.length === 0 && (
                  <p className="px-3 py-10 text-center text-sm text-muted-foreground">
                    No results for “{query}”
                  </p>
                )}
                {groups.map((group) => (
                  <div key={group.name} className="mb-1">
                    <p className="px-3 pb-1.5 pt-2 font-mono text-[9px] uppercase tracking-[0.26em] text-muted-foreground">
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
                          id={cmd.id}
                          role="option"
                          aria-selected={active}
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
                          {cmd.badge ? (
                            <span
                              className={cn(
                                "grid h-7 w-7 shrink-0 place-items-center rounded-lg font-mono text-[10px] transition-colors",
                                active
                                  ? "bg-foreground text-background"
                                  : "bg-foreground/[0.06] text-foreground/70"
                              )}
                            >
                              {cmd.badge}
                            </span>
                          ) : (
                            Icon && (
                              <span
                                className={cn(
                                  "grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-colors",
                                  active
                                    ? "border-foreground/20 bg-foreground text-background"
                                    : "border-border bg-foreground/5 text-foreground/70"
                                )}
                              >
                                <Icon className="h-3.5 w-3.5" />
                              </span>
                            )
                          )}
                          <span className="min-w-0 flex-1 truncate font-medium">
                            {cmd.label}
                            {cmd.hint && (
                              <span className="ml-2 font-normal text-muted-foreground">
                                {cmd.hint}
                              </span>
                            )}
                          </span>
                          {cmd.tag && (
                            <span
                              className={cn(
                                "shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10.5px]",
                                cmd.tag.startsWith("⌘")
                                  ? "bg-foreground/[0.07] text-muted-foreground"
                                  : "text-muted-foreground"
                              )}
                            >
                              {cmd.tag}
                            </span>
                          )}
                          {active && (
                            <ChevronRight
                              aria-hidden
                              className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-border/60 bg-foreground/[0.02] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <span className="flex items-center gap-4">
                  <span>↑↓ navigate</span>
                  <span>↵ open</span>
                </span>
                <span>
                  {filtered.length} result{filtered.length === 1 ? "" : "s"}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
