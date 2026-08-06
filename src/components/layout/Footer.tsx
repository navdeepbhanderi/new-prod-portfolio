"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUp } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { SOCIALS, EMAIL } from "@/data/socials";
import { PROJECTS } from "@/data/projects";
import { SECTIONS } from "@/data/navigation";
import { Magnetic } from "@/components/ui/MagneticButton";
import { Starfield } from "@/components/ui/Starfield";
import { HorizonGlow } from "@/components/ui/HorizonGlow";
import { useMounted } from "@/hooks/use-mounted";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/layout/SmoothScroll";

const NAME = PROFILE.firstName.toUpperCase();

// Home is omitted - the giant name below goes there.
const SECTION_LINKS = SECTIONS.filter((s) => s.id !== "hero");

function LocalTime() {
  const mounted = useMounted();
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!mounted) return;
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [mounted]);

  // Render a same-width invisible placeholder until the clock is live so the
  // justify-between row doesn't reflow when the time pops in.
  return (
    <span className={cn(!time && "invisible")}>
      {PROFILE.locationShort} · {time || "00:00"} {PROFILE.timezone}
    </span>
  );
}

function LinkColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <span className="font-mono text-[9.5px] uppercase tracking-[0.26em] text-muted-foreground">
        {title}
      </span>
      {children}
    </div>
  );
}

const linkClass =
  "text-[14.5px] text-foreground/65 transition-colors hover:text-foreground";

/**
 * Sticky-bottom uncover: <main> (opaque, z-10) lifts away as the page ends,
 * revealing this footer beneath it. Pure CSS positioning - degrades to a
 * normal footer without JS; only the inner "settle" drift is scripted.
 */
export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();
  const lenis = useLenis();
  // The starfield only animates once the footer is actually uncovered.
  const [uncovered, setUncovered] = useState(false);

  const href = (hash: string) => (pathname === "/" ? hash : `/${hash}`);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Scroll-scrubbed finale: the horizon rises, the content settles, the name
  // brightens last.
  useEffect(() => {
    const root = footerRef.current;
    const inner = innerRef.current;
    if (!root || !inner || reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const start = () => ScrollTrigger.maxScroll(window) - window.innerHeight * 0.9;

      // Wakes the canvas as the footer comes out from under <main>.
      ScrollTrigger.create({
        start,
        end: "max",
        onToggle: (self) => setUncovered(self.isActive),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          start: () => ScrollTrigger.maxScroll(window) - window.innerHeight * 0.7,
          end: "max",
          scrub: 0.4,
        },
      });
      tl.fromTo(
        ".footer-horizon",
        { yPercent: 22 },
        { yPercent: 0, ease: "none", duration: 1 },
        0
      )
        .fromTo(
          inner,
          { yPercent: -10, opacity: 0.55 },
          { yPercent: 0, opacity: 1, ease: "none", duration: 1 },
          0
        )
        .fromTo(
          ".footer-name",
          { opacity: 0.3 },
          { opacity: 1, ease: "none", duration: 0.7 },
          0.3
        );
    }, root);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <footer
      ref={footerRef}
      className="sticky bottom-0 z-0 overflow-hidden md:h-[88svh]"
    >
      {/* Deep-space backdrop: twinkling stars over an event-horizon arc. */}
      <div aria-hidden className="absolute inset-0">
        <Starfield density={0.00012} active={uncovered} />
        <div className="footer-horizon absolute inset-0">
          <HorizonGlow />
        </div>
      </div>

      <div
        ref={innerRef}
        className="container-px relative flex h-full flex-col justify-between gap-12 pb-8 pt-16 md:gap-6 md:pt-20"
      >
        {/* ---------- contact + sitemap ---------- */}
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,10.5rem))] md:gap-12">
          <div className="flex flex-col items-start">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              Available for work
            </span>
            <p className="mt-4 max-w-md text-[clamp(1.5rem,3vw,1.875rem)] font-medium leading-[1.28] tracking-[-0.02em] text-balance">
              Got something worth building? Start with a line.
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-5 border-b border-foreground/20 pb-1 text-base text-foreground/85 transition-colors hover:border-foreground/70 hover:text-foreground sm:text-lg"
            >
              {EMAIL}
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3 md:gap-12">
            <LinkColumn title="Sections">
              {SECTION_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={href(link.hash)}
                  scroll={false}
                  className={linkClass}
                >
                  {link.label}
                </Link>
              ))}
            </LinkColumn>

            <LinkColumn title="Work">
              {PROJECTS.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className={linkClass}
                >
                  {project.title}
                </Link>
              ))}
              <a
                href={PROFILE.resume}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Resume
              </a>
            </LinkColumn>

            <LinkColumn title="Elsewhere">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {social.label}
                </a>
              ))}
            </LinkColumn>
          </div>
        </div>

        {/* ---------- the finale ---------- */}
        <div className="flex flex-col gap-6">
          <Link
            href={href("#hero")}
            scroll={false}
            onClick={scrollToTop}
            aria-label={`${PROFILE.name} - back to top`}
            className="footer-name group flex select-none justify-center overflow-hidden"
          >
            {Array.from(NAME).map((char, i) => (
              <span
                key={i}
                aria-hidden
                className="text-horizon-lit inline-block text-[clamp(3.5rem,18.5vw,17rem)] font-semibold leading-[0.8] tracking-[-0.04em] transition-colors duration-300 hover:text-foreground"
              >
                {char}
              </span>
            ))}
          </Link>

          {/* Right padding keeps "Back to top" clear of the floating chat button. */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-foreground/[0.12] pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground sm:flex-row md:pr-40 lg:pr-52">
            <p>
              © {new Date().getFullYear()} {PROFILE.name}
              <span className="hidden sm:inline"> · Designed &amp; built from scratch</span>
            </p>
            <LocalTime />
            <Magnetic>
              <Link
                href={href("#hero")}
                scroll={false}
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
              >
                Back to top <ArrowUp className="h-3.5 w-3.5" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </div>
    </footer>
  );
}
