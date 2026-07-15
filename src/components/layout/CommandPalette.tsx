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
  FolderKanban,
  Home,
  Layers,
  Mail,
  Milestone,
  RotateCcw,
  Search,
  Sparkles,
  Terminal,
  User,
  type LucideIcon,
} from "lucide-react";
import { EMAIL, SOCIALS } from "@/data/socials";
import { PROJECTS } from "@/data/projects";
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

type TermLine = { cmd: string; out: string[]; cwd: string };

const SECTION_IDS = ["hero", "about", "expertise", "projects", "journey", "contact"];

const TERM_COMMANDS = [
  "help", "ls", "cd", "open", "ask", "neofetch", "cat", "socials", "email",
  "whoami", "pwd", "date", "echo", "history", "sudo", "clear", "reset", "exit",
];

const NEOFETCH_ART = [
  "█▄ █ ██▄",
  "█ ▀█ █▄█",
];

// The "filesystem" ls advertises — cd/open must understand the same names.
const TERM_DIRS: Record<string, string[]> = {
  sections: SECTION_IDS,
  projects: PROJECTS.map((p) => p.id),
  socials: SOCIALS.map((s) => s.icon),
};

const TERM_TARGETS = [
  ...SECTION_IDS,
  ...PROJECTS.map((p) => p.id),
  ...SOCIALS.map((s) => s.icon),
];

function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => {
    const row = new Array<number>(b.length + 1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
}

/** Closest match within 2 edits — powers "did you mean". */
function suggestClosest(word: string, pool: string[]): string | null {
  if (word.length < 2) return null;
  let best: string | null = null;
  let bestDistance = 3;
  for (const candidate of pool) {
    const d = editDistance(word, candidate);
    if (d < bestDistance) {
      bestDistance = d;
      best = candidate;
    }
  }
  return best;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);
  // Easter egg: typing ">" drops the palette into a tiny terminal.
  const [mode, setMode] = useState<"commands" | "terminal">("commands");
  const [termLines, setTermLines] = useState<TermLine[]>([]);
  // Current directory: "~" or "~/<dir>" — cd moves through it like a shell.
  const [cwd, setCwd] = useState("~");
  const cmdHistory = useRef<string[]>([]);
  const histIndex = useRef(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const lenis = useLenis();

  const close = useCallback(() => {
    setOpen(false);
    restoreFocusRef.current?.focus?.();
  }, []);

  // Entering ">" flips into terminal mode; the ">" itself is swallowed.
  useEffect(() => {
    if (mode === "commands" && query.trimStart().startsWith(">")) {
      setMode("terminal");
      setQuery("");
    }
  }, [query, mode]);

  const execTerminal = useCallback(
    (raw: string) => {
      const cmd = raw.trim();
      const push = (out: string[]) =>
        setTermLines((prev) => [...prev, { cmd, out, cwd }]);
      if (cmd) {
        cmdHistory.current.push(cmd);
        histIndex.current = -1;
      }

      const [name, ...args] = cmd.toLowerCase().split(/\s+/);
      const arg = args.join(" ");
      // Original casing for commands that echo the user's text back.
      const rawArg = cmd.slice(name.length).trim();

      const navigate = (fn: () => void, out: string[]) => {
        push(out);
        setTimeout(() => {
          close();
          setTimeout(fn, 50);
        }, 450);
      };

      // Shared resolver for open/cd/bare names. Understands the same
      // "directories" that ls prints, and suggests near-misses on typos.
      const openTarget = (rawTarget: string, verb: string) => {
        const target = rawTarget.replace(/\/$/, "");
        const social = SOCIALS.find(
          (s) =>
            s.icon === target ||
            s.label.toLowerCase() === target ||
            (target === "twitter" && s.icon === "x")
        );
        if (TERM_DIRS[target]) {
          push([
            `${target}/ is a directory — pick one:`,
            TERM_DIRS[target].join(" · "),
            `try: ${verb} ${TERM_DIRS[target][target === "sections" ? 5 : 0]}`,
          ]);
        } else if (SECTION_IDS.includes(target)) {
          navigate(() => scrollToSection(lenis, target), [`opening #${target}…`]);
        } else if (PROJECTS.some((p) => p.id === target)) {
          navigate(() => {
            window.location.href = `/projects/${target}`;
          }, [`opening /projects/${target}…`]);
        } else if (social) {
          push([`opening ${social.href}…`]);
          window.open(social.href, "_blank", "noopener,noreferrer");
        } else {
          const closest = suggestClosest(target, [
            ...TERM_TARGETS,
            ...Object.keys(TERM_DIRS),
          ]);
          push([
            target ? `${verb}: no such target: ${target}` : `usage: ${verb} <section | project | social>`,
            closest
              ? `did you mean: ${verb} ${closest}?`
              : `try: ${verb} contact · ${verb} ai-travel · ${verb} github`,
          ]);
        }
      };

      switch (name) {
        case "":
          push([]);
          break;
        case "help":
          push([
            "ls [dir]          sections & projects",
            "open · cd <t>     section · project · github/linkedin/x",
            "ask <question>    hand the question to nova — real AI answer",
            "neofetch          about this machine",
            "cat resume        the resume",
            "socials · email   reach navdeep",
            "whoami · pwd · date · echo · history",
            "sudo hire navdeep",
            "clear · reset · exit — tab completes commands",
          ]);
          break;
        case "ls": {
          const listDir = (d: string): string[] | null => {
            if (d === "projects") return PROJECTS.map((p) => `${p.id.padEnd(12)} ${p.title}`);
            if (d === "sections") return SECTION_IDS;
            if (d === "socials") return SOCIALS.map((s) => `${s.icon.padEnd(12)} ${s.href}`);
            return null;
          };
          const dir = arg.replace(/\/$/, "") || (cwd === "~" ? "" : cwd.slice(2));
          if (dir) {
            const out = listDir(dir);
            push(out ?? [`ls: cannot access '${dir}': no such directory`]);
          } else {
            push([
              `sections/   ${SECTION_IDS.join(" ")}`,
              `projects/   ${PROJECTS.map((p) => p.id).join(" ")}`,
              `socials/    ${SOCIALS.map((s) => s.icon).join(" ")}`,
            ]);
          }
          break;
        }
        case "cd": {
          const target = arg.replace(/\/$/, "");
          if (!target || target === "~" || target === "..") {
            setCwd("~");
            push([]);
          } else if (TERM_DIRS[target]) {
            setCwd(`~/${target}`);
            push([]);
          } else {
            // Leaf targets (hero, ai-travel, github) still navigate the site.
            openTarget(target, "cd");
          }
          break;
        }
        case "open":
          openTarget(arg, "open");
          break;
        case "ask":
          if (!arg) {
            push(["usage: ask <question>", "try: ask why should i hire navdeep"]);
          } else {
            // Hand off to Nova — the chat opens with the question submitted
            // and answers with real AI (streamed, with action buttons).
            navigate(() => {
              window.dispatchEvent(
                new CustomEvent("navdeep:open-chat", { detail: { question: rawArg } })
              );
            }, [`asking nova: "${rawArg}"`, "connecting…"]);
          }
          break;
        case "neofetch":
          push([
            ...NEOFETCH_ART,
            "",
            `guest@navdeepbhanderi.dev`,
            `─────────────────────────`,
            `name      ${PROFILE.name}`,
            `role      ${PROFILE.title}`,
            `location  Junagadh, IN`,
            `stack     Next.js · React · Angular · Node.js`,
            `focus     Full-stack · Applied AI`,
            `status    Open to opportunities`,
            `contact   ${EMAIL}`,
          ]);
          break;
        case "whoami":
          push([
            "guest@navdeepbhanderi.dev",
            "you found the terminal — most visitors never do.",
          ]);
          break;
        case "pwd":
          push([`/home/guest/navdeepbhanderi.dev${cwd === "~" ? "" : `/${cwd.slice(2)}`}`]);
          break;
        case "date":
          push([
            `${new Date().toLocaleString("en-IN", {
              dateStyle: "full",
              timeStyle: "short",
              timeZone: "Asia/Kolkata",
            })} IST`,
          ]);
          break;
        case "echo":
          push([rawArg || ""]);
          break;
        case "history":
          push(
            cmdHistory.current.length
              ? cmdHistory.current.map((c, i) => `${String(i + 1).padStart(3)}  ${c}`)
              : ["history: empty"]
          );
          break;
        case "email":
          navigate(() => {
            window.location.href = `mailto:${EMAIL}`;
          }, [`drafting email to ${EMAIL}…`]);
          break;
        case "cat":
          if (arg === "resume" || arg === "resume.pdf") {
            push([
              "resume.pdf: not published yet.",
              `email ${EMAIL} for the latest copy.`,
            ]);
          } else {
            push([`cat: ${arg || "?"}: no such file`]);
          }
          break;
        case "socials":
          push([
            ...SOCIALS.map((s) => `${s.label.toLowerCase().padEnd(12)} ${s.href}`),
            `email        ${EMAIL}`,
          ]);
          break;
        case "sudo":
          if (arg === "hire navdeep") {
            navigate(() => scrollToSection(lenis, "contact"), [
              "[sudo] password for guest: ********",
              "permission granted ✓ — opening the contact form…",
            ]);
          } else {
            push(["guest is not in the sudoers file. this incident will be reported."]);
          }
          break;
        case "clear":
          setTermLines([]);
          break;
        case "reset":
          setTermLines([]);
          setCwd("~");
          cmdHistory.current = [];
          histIndex.current = -1;
          break;
        case "exit":
          // Back to the palette — the session stays; ">" returns to it.
          setMode("commands");
          break;
        default: {
          // Bare target names just work — `contact`, `ai-travel`, `github`,
          // even `sections` (lists the directory), like a shell with AUTO_CD.
          const bare = name.replace(/\/$/, "");
          if (!arg && TERM_DIRS[bare]) {
            // AUTO_CD: a bare directory name enters it.
            setCwd(`~/${bare}`);
            push([]);
            break;
          }
          if (!arg && TERM_TARGETS.includes(bare)) {
            openTarget(bare, "open");
            break;
          }
          const closest = suggestClosest(name, [
            ...TERM_COMMANDS,
            ...TERM_TARGETS,
            ...Object.keys(TERM_DIRS),
          ]);
          push([
            `command not found: ${name}`,
            closest ? `did you mean: ${closest}?` : `try "help"`,
          ]);
        }
      }
    },
    [lenis, close, cwd]
  );

  const commands = useMemo<Command[]>(() => {
    const nav: Array<{ id: string; label: string; icon: LucideIcon }> = [
      { id: "hero", label: "Home", icon: Home },
      { id: "about", label: "About", icon: User },
      { id: "expertise", label: "Expertise", icon: Layers },
      { id: "projects", label: "Projects", icon: FolderKanban },
      { id: "journey", label: "Journey", icon: Milestone },
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
        id: "ask-ai",
        group: "Actions",
        label: "Ask Nova",
        hint: "Navdeep's AI assistant",
        keywords: "ask ai chat assistant bot question gemini",
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
        // Step out gradually: terminal → palette search → closed.
        if (mode === "terminal") setMode("commands");
        else close();
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
  }, [open, close, mode]);

  // Reset + focus + scroll lock while open. Terminal state (mode, output,
  // command history) deliberately survives close/reopen — a stray click or
  // Esc must never wipe the session; only `clear`/`reset` do.
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

  // The input node remounts when it moves between the top dock (palette)
  // and the bottom dock (terminal) — refocus it on every mode flip.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [mode, open]);

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

  // Terminal history stays pinned to the newest line — also on reopen, since
  // the session survives close/open.
  useEffect(() => {
    if (mode !== "terminal" || !open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [termLines, mode, open]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (mode === "terminal") {
      if (e.key === "Enter") {
        e.preventDefault();
        execTerminal(query);
        setQuery("");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const hist = cmdHistory.current;
        if (!hist.length) return;
        histIndex.current =
          histIndex.current === -1
            ? hist.length - 1
            : Math.max(0, histIndex.current - 1);
        setQuery(hist[histIndex.current]);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const hist = cmdHistory.current;
        if (histIndex.current === -1) return;
        histIndex.current += 1;
        if (histIndex.current >= hist.length) {
          histIndex.current = -1;
          setQuery("");
        } else {
          setQuery(hist[histIndex.current]);
        }
      } else if (e.key === "Tab") {
        e.preventDefault();
        const parts = query.split(/\s+/);
        const verb = parts[0]?.toLowerCase();
        if (parts.length <= 1) {
          const partial = verb ?? "";
          const match = partial && TERM_COMMANDS.find((c) => c.startsWith(partial));
          if (match) setQuery(`${match} `);
        } else if (verb === "open" || verb === "cd" || verb === "ls") {
          const targets = [...TERM_TARGETS, ...Object.keys(TERM_DIRS)];
          const partial = parts[1]?.toLowerCase() ?? "";
          const match = targets.find((t) => t.startsWith(partial));
          if (match) setQuery(`${verb} ${match}`);
        }
      }
      return;
    }
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

  // Shared input row — docked at the top for the palette, at the bottom for
  // the terminal (output above the prompt, like a real shell).
  const inputRow = (
    <div
      className={cn(
        "flex items-center gap-3 px-4",
        mode === "terminal" ? "border-t border-border/60" : "border-b border-border/60"
      )}
    >
      {mode === "terminal" ? (
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-xs text-foreground/70">
          <Terminal className="h-4 w-4" />
          <span aria-hidden>
            {cwd} <span className="text-foreground/90">❯</span>
          </span>
        </span>
      ) : (
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onInputKeyDown}
        placeholder={mode === "terminal" ? 'try "help"' : "Type a command or search…"}
        aria-label={mode === "terminal" ? "Terminal input" : "Search commands"}
        spellCheck={false}
        className={cn(
          "w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground",
          mode === "terminal" && "font-mono text-xs"
        )}
      />
      {mode === "terminal" && (
        <button
          type="button"
          onClick={() => {
            setTermLines([]);
            setCwd("~");
            cmdHistory.current = [];
            histIndex.current = -1;
            inputRef.current?.focus();
          }}
          aria-label="Reset terminal"
          title="Reset terminal"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      )}
      <kbd className="rounded-md border border-border bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
        esc
      </kbd>
    </div>
  );

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
            // Safe to close from anywhere — the terminal session survives
            // close/reopen, so an outside click never loses anything.
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
            {mode === "commands" && inputRow}

            <div
              ref={listRef}
              data-lenis-prevent
              className={cn(
                "max-h-[46svh] overflow-y-auto p-2",
                mode === "terminal" && "min-h-[32svh]"
              )}
            >
              {mode === "terminal" && (
                <div className="flex flex-col gap-1.5 px-3 py-3 font-mono text-xs leading-relaxed">
                  {termLines.length === 0 && (
                    <p className="text-muted-foreground">
                      navdeep@portfolio — type <span className="text-foreground/80">help</span> to
                      begin, <span className="text-foreground/80">exit</span> to leave.
                    </p>
                  )}
                  {termLines.map((line, i) => (
                    <div key={i}>
                      <p className="text-foreground/50">
                        <span className="text-foreground/35">
                          navdeep@portfolio:{line.cwd}$
                        </span>{" "}
                        {line.cmd}
                      </p>
                      {line.out.map((o, j) => (
                        <p key={j} className="whitespace-pre-wrap pl-2 text-foreground/85">
                          {o}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              )}
              {mode === "commands" && groups.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No results for “{query}”
                </p>
              )}
              {mode === "commands" &&
              groups.map((group) => (
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

            {mode === "terminal" && inputRow}

            <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              {mode === "terminal" ? (
                <>
                  <span className="flex items-center gap-3">
                    <span>↵ Run</span>
                    <span>esc Back</span>
                  </span>
                  <span>navdeep@portfolio</span>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-3">
                    <span>↑↓ Navigate</span>
                    <span>↵ Select</span>
                    {/* the only breadcrumb to the easter egg */}
                    <span className="hidden opacity-40 sm:inline">&gt;_</span>
                  </span>
                  <span>Navdeep Bhanderi</span>
                </>
              )}
            </div>
          </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
