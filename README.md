# Navdeep Bhanderi — Portfolio

A premium, single-page portfolio built to feel like a polished technology product
(Linear / Stripe / Vercel / Raycast inspired). Black-and-white system, glassmorphism,
scroll-driven motion, and a signature **Ask Navdeep AI** assistant powered by a local,
zero-cost knowledge base.

## Tech

- **Next.js 15** (App Router) · **TypeScript** (strict)
- **Tailwind CSS 3.4** · shadcn-style UI primitives
- **Framer Motion** (reveals, magnetic buttons, micro-interactions)
- **GSAP + ScrollTrigger** (scroll-drawn timeline)
- **Lenis** (smooth scroll, synced to GSAP)
- **Geist** + **Geist Mono** fonts

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## ⚠️ Add your photo

The hero portrait loads from `public/navdeep.webp`. **Save the headshot to:**

```
public/navdeep.webp
```

Until that file exists, the hero gracefully shows an "NB" monogram instead — nothing breaks.

## Structure

```
src/
  app/            layout (metadata + JSON-LD), page, globals.css, sitemap, robots, opengraph-image
  components/
    layout/       Navbar, Footer, SmoothScroll, CustomCursor, ScrollProgress
    sections/     Hero, Expertise, Projects, Timeline, Skills, AskAI, Contact
    ui/           Button, GlassCard, Magnetic, BlurReveal, TextReveal, SectionHeading, Spotlight, ProfileImage
    icons/        GitHub / LinkedIn / X brand icons
  lib/            profile (source of truth), ai/ (knowledge + matching engine), utils, motion
  data/           projects, skills, timeline, expertise, socials
  hooks/          use-media-query, use-mounted, use-magnetic
```

## Editing content

Everything is data-driven — edit these and the UI updates:

- **Profile / bio / availability** → `src/lib/profile.ts`
- **Projects** → `src/data/projects.ts`
- **Skills & expertise** → `src/data/skills.ts`, `src/data/expertise.ts`
- **Education timeline** → `src/data/timeline.ts`
- **Social links / email** → `src/data/socials.ts`
- **Ask Navdeep AI answers** → `src/lib/ai/knowledge.ts`

## Deploy

Push to GitHub and import into **Vercel** (zero config). Update `SITE_URL` in
`src/app/layout.tsx`, `src/app/sitemap.ts`, and `src/app/robots.ts` to your final domain.
