"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EASE_OUT } from "@/lib/motion";

const NAV_LINKS = [
  { label: "Expertise", href: "#expertise" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
];

function openChat() {
  window.dispatchEvent(new Event("navdeep:open-chat"));
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-[75] flex justify-center px-4 pt-4">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
        className={cn(
          "flex w-full max-w-container items-center justify-between rounded-full border px-4 py-2.5 transition-all duration-300 sm:px-5",
          scrolled
            ? "glass-strong border-border shadow-lg shadow-black/20"
            : "border-transparent bg-transparent"
        )}
      >
        <Link
          href="#hero"
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
              href={link.href}
              scroll={false}
              className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
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
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="#contact" scroll={false}>
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
            className="fixed inset-0 top-0 z-[-1] md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/90 backdrop-blur-xl"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.05 }}
              className="relative mx-4 mt-24 flex flex-col gap-1 rounded-3xl border border-border bg-background/60 p-4"
            >
              {[...NAV_LINKS, { label: "Contact", href: "#contact" }].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  scroll={false}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 text-base font-medium text-foreground/90 transition-colors hover:bg-foreground/5"
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openChat();
                }}
                className="flex items-center gap-2 rounded-2xl px-4 py-3 text-left text-base font-medium text-foreground/90 transition-colors hover:bg-foreground/5"
              >
                <Sparkles className="h-4 w-4" />
                Ask AI
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
