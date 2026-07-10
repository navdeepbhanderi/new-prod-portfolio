"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DUR, EASE_OUT, SPRING_SNAPPY, staggerContainer } from "@/lib/motion";
import { useActiveSection } from "@/hooks/use-active-section";
import { OPEN_PALETTE_EVENT } from "@/components/layout/CommandPalette";

const NAV_LINKS = [
  { label: "About", href: "#about", id: "about" },
  { label: "Expertise", href: "#expertise", id: "expertise" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Journey", href: "#journey", id: "journey" },
];

// Includes hero/contact so the pill clears at the page's ends.
const SECTION_IDS = ["hero", "about", "expertise", "projects", "journey", "contact"];

const mobileItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.base, ease: EASE_OUT },
  },
};

function openChat() {
  window.dispatchEvent(new Event("navdeep:open-chat"));
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);
  const active = useActiveSection(SECTION_IDS);
  const pathname = usePathname();
  // On sub-pages (case studies) hash links must route home first.
  const href = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

  return (
    <header
      // pointer-events-none: the full-width strip must never block clicks on
      // content beneath it (esp. while the nav is hidden on scroll).
      className="pointer-events-none fixed inset-x-0 top-0 z-[75] flex justify-center px-4 pt-4"
      // Keyboard users must never lose the nav while tabbing.
      onFocusCapture={() => setHidden(false)}
    >
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: hidden ? "-130%" : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_OUT }}
        className={cn(
          "pointer-events-auto flex w-full max-w-container items-center justify-between rounded-full border px-4 py-2.5 transition-[background-color,border-color,box-shadow] duration-300 sm:px-5",
          scrolled
            ? "glass-strong border-border shadow-lg shadow-black/20"
            : "border-transparent bg-transparent"
        )}
      >
        <Link
          href={href("#hero")}
          scroll={false}
          aria-label="Navdeep Bhanderi — home"
          className="flex items-center gap-2.5 pl-1"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-foreground/5 font-mono text-sm font-semibold">
            NB
          </span>
          <span className="hidden text-sm font-medium tracking-tight sm:block">
            Navdeep Bhanderi
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={href(link.href)}
              scroll={false}
              className={cn(
                "group relative rounded-full px-3.5 py-2 text-sm transition-colors",
                active === link.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active === link.id && (
                <motion.span
                  layoutId="nav-active"
                  transition={SPRING_SNAPPY}
                  className="absolute inset-0 rounded-full bg-foreground/[0.07]"
                />
              )}
              <span className="relative z-10">{link.label}</span>
              <span
                aria-hidden
                className="absolute bottom-1 left-3.5 right-3.5 h-px origin-right scale-x-0 bg-foreground/60 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100 group-focus-visible:origin-left group-focus-visible:scale-x-100"
              />
            </Link>
          ))}
          <button
            type="button"
            onClick={openChat}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Ask AI
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT))}
            aria-label="Open command palette"
            className="hidden items-center gap-1.5 rounded-full border border-border bg-foreground/5 px-3 py-2 font-mono text-[11px] text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground md:flex"
          >
            {isMac ? "⌘" : "Ctrl"} K
          </button>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={href("#contact")} scroll={false}>
              Contact
            </Link>
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-border bg-foreground/5 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-auto fixed inset-0 top-0 z-[-1] md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/90 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              variants={staggerContainer(0.05, 0.05)}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="relative mx-4 mt-24 flex flex-col gap-1 rounded-3xl border border-border bg-background/60 p-4"
            >
              {[...NAV_LINKS, { label: "Contact", href: "#contact", id: "contact" }].map(
                (link) => (
                  <motion.div key={link.href} variants={mobileItem}>
                    <Link
                      href={href(link.href)}
                      scroll={false}
                      onClick={() => setOpen(false)}
                      className="block rounded-2xl px-4 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-foreground/5"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              )}
              <motion.button
                variants={mobileItem}
                type="button"
                onClick={() => {
                  setOpen(false);
                  openChat();
                }}
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-base font-medium text-foreground/90 transition-colors hover:bg-foreground/5"
              >
                <Sparkles className="h-4 w-4" />
                Ask AI
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
