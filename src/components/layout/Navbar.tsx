"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, Search, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NMark } from "@/components/brand/Logo";
import { BRAND_ICONS } from "@/components/icons";
import { SOCIALS } from "@/data/socials";
import { PROFILE } from "@/lib/profile";
import { NAV_SECTIONS, SECTION_IDS } from "@/data/navigation";
import { ASSISTANT_LABEL } from "@/lib/ai/knowledge";
import { DUR, EASE_OUT, SPRING_SNAPPY, STAGGER, staggerContainer } from "@/lib/motion";
import { holdScroll } from "@/lib/scroll-lock";
import { useActiveSection } from "@/hooks/use-active-section";
import { useLenis } from "@/components/layout/SmoothScroll";
import { OPEN_PALETTE_EVENT } from "@/components/layout/CommandPalette";

const sheetItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

function openChat() {
  window.dispatchEvent(new Event("navdeep:open-chat"));
}

function openPalette() {
  window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const active = useActiveSection(SECTION_IDS);
  const pathname = usePathname();
  const lenis = useLenis();
  const sheetRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // On sub-pages (case studies) hash links must route home first.
  const href = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
  }, []);

  const closeSheet = useCallback(() => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Scroll lock is ref-counted so the palette or chat closing on top of an
  // open sheet can't unlock the page underneath it.
  useEffect(() => (open ? holdScroll(lenis) : undefined), [open, lenis]);

  // The chat launcher floats above the sheet (z-90 vs z-76) and would sit on
  // top of the sheet's footer row; flag the document so CSS can retire it.
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.dataset.navOpen = "true";
    else delete root.dataset.navOpen;
    return () => {
      delete root.dataset.navOpen;
    };
  }, [open]);

  // Escape closes the sheet, and focus moves into it on open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeSheet();
      }
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(
      () => sheetRef.current?.querySelector<HTMLElement>("a, button")?.focus(),
      80
    );
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, closeSheet]);

  // Keep Tab cycling inside the sheet while it's open.
  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const root = sheetRef.current;
    if (!root) return;
    const focusables = root.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const delta = y - prev;
    setScrolled(y > 24);
    if (open || y < 80) {
      setHidden(false);
    } else if (delta > 8) {
      setHidden(true);
    } else if (delta < -4) {
      setHidden(false);
    }
  });

  const kbd = isMac ? "⌘K" : "Ctrl K";

  return (
    <>
      <header
        // pointer-events-none: the full-width strip must never block clicks on
        // content beneath it (esp. while the nav is hidden on scroll).
        className="pointer-events-none fixed inset-x-0 top-0 z-[75] flex justify-center px-4 pt-4"
        // Keyboard users must never lose the nav while tabbing.
        onFocusCapture={() => setHidden(false)}
      >
        {/* No scrim here. The transparent state is the design (§6), and a strip
            dark enough to carry muted text stacked with the hero band's own 0.72
            top scrim to ~0.96 — a visible black bar across the portrait, with a
            hard edge where it ended. The controls carry their own contrast
            instead, which is what actually needed fixing. */}
        <motion.nav
          // `layout` is what makes the wide bar collapse into the condensed
          // pill as one continuous move instead of two states swapping.
          layout
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: hidden ? "-130%" : 0, opacity: 1 }}
          transition={{ ...SPRING_SNAPPY, opacity: { duration: DUR.base, ease: EASE_OUT } }}
          className={cn(
            "pointer-events-auto flex w-full max-w-container items-center justify-between gap-3 rounded-2xl border px-3 py-2 lg:rounded-full lg:px-5 lg:py-2.5",
            scrolled
              ? "glass-strong border-border shadow-lg shadow-black/20 lg:w-auto lg:max-w-none lg:gap-2 lg:py-2 lg:pl-4 lg:pr-2"
              : "border-transparent bg-transparent"
          )}
        >
          <motion.div layout="position" className="flex items-center">
            <Link
              href={href("#hero")}
              scroll={false}
              aria-label={`${PROFILE.name} — home`}
              className="flex items-center gap-2.5 text-foreground"
            >
              {/* id: the intro's name flies to this mark as the curtain lifts. */}
              <span id="nav-mark" className="flex items-center">
                {/* Bare mark on phones — 4b/4c draw the nav mark as a plain
                    glyph with no container at any width. */}
                <NMark
                  size={scrolled ? 26 : 30}
                  framed={!scrolled}
                  frameClassName="max-sm:hidden"
                />
              </span>
              {/* No width animation on any of the collapsing labels: the nav's
                  own `layout` closes the gap, and animating to width:auto
                  overlaps the content mid-flight. */}
              <AnimatePresence initial={false} mode="popLayout">
                {!scrolled && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DUR.fast, ease: EASE_OUT }}
                    className="hidden whitespace-nowrap text-sm font-medium tracking-tight sm:block"
                  >
                    {PROFILE.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            {scrolled && (
              <span aria-hidden className="ml-3 hidden h-[18px] w-px bg-border lg:block" />
            )}
          </motion.div>

          <motion.div layout="position" className="hidden items-center gap-1 lg:flex">
            {NAV_SECTIONS.map((link) => (
              <Link
                key={link.id}
                href={href(link.hash)}
                scroll={false}
                aria-current={active === link.id ? "true" : undefined}
                className={cn(
                  "group relative rounded-full px-3.5 py-2 text-sm transition-colors",
                  active === link.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active === link.id && (
                  // One layoutId across both states: the underline at the top of
                  // the page grows into the filled pill as the nav condenses.
                  <motion.span
                    layoutId="nav-active"
                    transition={SPRING_SNAPPY}
                    className={cn(
                      "absolute rounded-full bg-foreground/[0.09]",
                      scrolled
                        ? "inset-0"
                        : "inset-x-3.5 bottom-1 h-px bg-foreground/60"
                    )}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
                <span
                  aria-hidden
                  className="absolute bottom-1 left-3.5 right-3.5 h-px origin-right scale-x-0 bg-foreground/60 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100"
                />
              </Link>
            ))}
          </motion.div>

          <motion.div layout="position" className="flex items-center gap-2">
            <button
              type="button"
              onClick={openPalette}
              aria-label="Search — open the command palette"
              aria-keyshortcuts={isMac ? "Meta+K" : "Control+K"}
              className={cn(
                "hidden items-center gap-2 rounded-full border border-border text-sm transition-colors hover:border-foreground/25 hover:text-foreground lg:flex",
                // Scrolled, the nav's own glass supplies the contrast. Unscrolled
                // the control has to carry its own, or it reads as a ghost over
                // anything light.
                scrolled
                  ? "h-9 w-9 justify-center bg-foreground/5 text-muted-foreground"
                  : "h-9 bg-background/80 px-3.5 text-foreground/70"
              )}
            >
              <Search className="h-3.5 w-3.5 shrink-0" />
              <AnimatePresence initial={false} mode="popLayout">
                {!scrolled && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DUR.fast, ease: EASE_OUT }}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    Search
                    <kbd className="rounded-md bg-foreground/[0.07] px-1.5 py-0.5 font-mono text-[10.5px] text-foreground/75">
                      {kbd}
                    </kbd>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <AnimatePresence initial={false} mode="popLayout">
              {!scrolled && (
                <motion.button
                  type="button"
                  onClick={openChat}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: DUR.fast, ease: EASE_OUT }}
                  className="hidden h-9 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-background/80 px-3.5 text-sm text-foreground/75 transition-colors hover:border-foreground/25 hover:text-foreground lg:flex"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  {ASSISTANT_LABEL}
                </motion.button>
              )}
            </AnimatePresence>

            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href={href("#contact")} scroll={false}>
                Contact
              </Link>
            </Button>

            <button
              type="button"
              onClick={openPalette}
              aria-label="Search — open the command palette"
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-background/80 text-foreground/75 transition-colors hover:text-foreground lg:hidden"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="nav-sheet"
              onClick={() => setOpen((v) => !v)}
              className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90 lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </motion.div>
        </motion.nav>
      </header>

      {/* ---------- Mobile sheet ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="nav-sheet"
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onKeyDown={trapFocus}
            data-cursor="hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: EASE_OUT }}
            className="fixed inset-0 z-[76] flex flex-col bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[60svh] bg-[radial-gradient(ellipse_62%_100%_at_50%_100%,hsl(var(--accent)/0.18),transparent_70%)] blur-2xl" />

            <div className="relative flex items-center justify-between px-5 pt-[1.35rem]">
              <Link
                href={href("#hero")}
                scroll={false}
                onClick={closeSheet}
                aria-label={`${PROFILE.name} — home`}
                className="flex items-center gap-2.5"
              >
                <NMark size={26} />
                <span className="text-sm font-medium tracking-tight">
                  {PROFILE.firstName}
                </span>
              </Link>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-foreground/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <motion.nav
              aria-label="Sections"
              variants={staggerContainer(STAGGER.menu, 0.05)}
              initial="hidden"
              animate="visible"
              className="relative mt-10 flex flex-col px-5"
            >
              {NAV_SECTIONS.map((link, i) => (
                <motion.div key={link.id} variants={sheetItem}>
                  <Link
                    href={href(link.hash)}
                    scroll={false}
                    onClick={closeSheet}
                    aria-current={active === link.id ? "true" : undefined}
                    className="flex items-baseline justify-between border-b border-border/60 py-4 transition-colors"
                  >
                    <span
                      className={cn(
                        "text-3xl font-medium tracking-tight",
                        active === link.id ? "text-foreground" : "text-foreground/70"
                      )}
                    >
                      {link.label}
                    </span>
                    <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.nav>

            <motion.div
              variants={sheetItem}
              initial="hidden"
              animate="visible"
              className="relative mt-auto flex flex-col gap-4 px-5 pb-6"
            >
              <div className="flex gap-2.5">
                <Button asChild size="lg" className="flex-1">
                  <Link href={href("#contact")} scroll={false} onClick={closeSheet}>
                    Contact me
                  </Link>
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    closeSheet();
                    openChat();
                  }}
                  aria-label={`${ASSISTANT_LABEL} about Navdeep's work`}
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-border text-foreground/75 transition-colors hover:border-foreground/30 hover:text-foreground"
                >
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center justify-between border-t border-border/60 pt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>{PROFILE.locationShort}</span>
                <span className="flex items-center gap-4">
                  {SOCIALS.map((social) => {
                    const Icon = BRAND_ICONS[social.icon];
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        className="transition-colors hover:text-foreground"
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
