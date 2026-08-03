# Navdeep Bhanderi — Portfolio

Award-site-tier personal portfolio: cinematic monochrome design, scroll-driven
storytelling, per-project case studies, an AI assistant, and a real contact
pipeline — live at **[navdeepbhanderi.dev](https://navdeepbhanderi.dev)**.

> Design & animation standards live in **[DESIGN.md](./DESIGN.md)** — read it
> (or paste it into an AI prompt) before changing any visual or motion code.
> A machine-readable export of all site content lives in
> **[portfolio-info.json](./portfolio-info.json)**.

---

## About

**Navdeep Bhanderi** — Frontend engineer with full-stack range, based in
Junagadh, Gujarat, India. Owns frontend delivery end to end — requirement to
release, backend included when needed. Currently a **Senior Frontend Engineer
at Softrefine Technology Pvt. Ltd.**, leading the frontend side of a client
build.

- **Stack:** React · Angular · Next.js · TypeScript · Node.js · SQL/MongoDB
- **Email:** navdeepbhanderi1@gmail.com
- **GitHub:** [@navdeepbhanderi](https://github.com/navdeepbhanderi/) ·
  **LinkedIn:** [in/navdeepbhanderi](https://www.linkedin.com/in/navdeepbhanderi/) ·
  **X:** [@NavdeepBhanderi](https://x.com/NavdeepBhanderi)
- **Open to:** full-time roles, freelance projects, startup collaborations,
  product engineering.

---

## Highlights

- **Cinematic layer** — once-per-session preloader (counter + light-fill name +
  curtain lift over a starfield), character-level hero reveal with 3-depth mouse
  parallax, sticky stacking project deck, parallax section numerals,
  velocity-reactive skill marquees, and an "earth from space" footer finale.
- **Interaction language** — contextual custom cursor, active-section navbar pill
  with hide-on-scroll, 3D tilt cards, text-swap buttons, ⌘K command palette.
- **Case studies** — `/projects/[slug]` pages (problem → approach → outcome)
  with per-page SEO and JSON-LD. Project visuals adapt per project: a real
  product screenshot, an NDA-safe architecture diagram + metrics, or a stylised
  fallback (see `ProductMock`).
- **Nova (Ask AI)** — chat assistant (streamed Gemini replies when configured,
  local knowledge base fallback) with tappable action buttons, lazy-loaded on
  idle, rate-limited.
- **Contact pipeline** — validated form with honeypot + rate limiting; sends an
  owner notification **and** a themed auto-reply via Gmail SMTP.
- **SEO** — Person/WebSite/ProfilePage JSON-LD graph, manifest + full favicon
  set, sitemap incl. case studies, canonical URLs, `next/image` LCP portrait.
- **Performance** — LCP ~190 ms, CLS 0, zero long tasks (measured on the
  production build). Every effect has reduced-motion and touch fallbacks.

---

## Tech

**Next.js 15** (App Router) · **React 19** · **TypeScript** · **Tailwind CSS 3.4** ·
**Framer Motion 12** · **GSAP + ScrollTrigger** · **Lenis** · **nodemailer** ·
**Geist / Geist Mono**

---

## Project structure

```
src/
├── app/                    # App Router: layout, page, SEO, API routes
│   ├── api/
│   │   ├── chat/           # Nova AI chat (Gemini stream + local fallback)
│   │   └── contact/        # Contact form → Gmail SMTP (notify + auto-reply)
│   ├── projects/[slug]/    # Per-project case-study pages + OG images
│   ├── layout.tsx          # Root layout, metadata, JSON-LD, providers
│   ├── page.tsx            # One-page composition of the sections
│   ├── not-found.tsx       # Designed 404
│   └── globals.css         # Design tokens + base styles
├── components/
│   ├── ai/                 # ChatWidget (+ lazy loader)
│   ├── case-study/         # CaseStudy layout + ReadingRail
│   ├── layout/             # Navbar, Footer, Preloader, CommandPalette, cursor…
│   ├── sections/           # Hero, About, Expertise, Projects, Timeline, Contact
│   └── ui/                 # Reveal/animation + card/text primitives
├── data/                   # Content sources: projects, expertise, skills, timeline, socials
├── hooks/                  # media-query, mounted, magnetic, parallax, active-section
├── lib/
│   ├── ai/                 # Nova engine, knowledge base, context, actions
│   ├── email/              # Email templates
│   ├── motion.ts           # The ONLY source of easing/duration tokens
│   ├── profile.ts          # Identity/copy + SEO JSON-LD
│   └── site.ts             # Canonical origin (single source of truth)
└── types/                  # Shared TypeScript types
```

---

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build (stop `dev` first — shared .next)
```

---

## Environment variables (`.env.local` locally, project settings on Vercel)

| Variable | Purpose |
|---|---|
| `GMAIL_USER` | Sender account for the contact form (`work.navdeepbhanderi@gmail.com`) |
| `GMAIL_APP_PASSWORD` | Gmail **App Password** — create at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) (needs 2FA) |
| `CONTACT_TO` | Where inquiry notifications land (`navdeepbhanderi1@gmail.com`) |
| `GEMINI_API_KEY` | Enables real AI chat — free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey); without it the widget uses the built-in knowledge base |
| `GEMINI_MODEL` | Optional, defaults to `gemini-2.5-flash` |

---

## Editing content (all data-driven)

- **Profile / bio / availability** → `src/lib/profile.ts`
- **Canonical domain** → `src/lib/site.ts`
- **Projects + case studies + proof links** → `src/data/projects.ts`
- **Skills & expertise** → `src/data/expertise.ts`, `src/data/skills.ts`
- **Timeline** → `src/data/timeline.ts` · **Socials** → `src/data/socials.ts`
- **AI answers** → `src/lib/ai/knowledge.ts`
- **Email templates** → `src/lib/email/templates.ts`
- **Content export** → `portfolio-info.json` (regenerate if the sources above change)

---

## 🚀 Launch checklist (do these before/at deploy)

- [ ] **Add the Gmail App Password** to env (`GMAIL_APP_PASSWORD`) and send a
      test message through the form — both emails should arrive styled.
- [ ] **Add `GEMINI_API_KEY`** so Nova gives real answers
      (the `x-chat-source: gemini` response header on `/api/chat` confirms it).
- [ ] Deploy to Vercel, attach **navdeepbhanderi.dev**, set all env vars.
- [ ] Validate the share card at [opengraph.xyz](https://www.opengraph.xyz) and
      run [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Add the property in **Google Search Console**, submit `/sitemap.xml`
      (needs a one-line verification token in `layout.tsx` metadata).
- [ ] Quick real-device pass: phone (touch fallbacks, footer spacing) and a
      `prefers-reduced-motion` check.

---

## 📈 Roadmap — highest-impact improvements next

1. ⚠️ **Replace `public/resume.pdf`** — it is currently the WRONG file (a
   scanned appointment PDF, not a resume) and every Resume CTA serves it. Drop
   the real resume at the same path. **Highest priority.**
2. ~~**Real project visuals**~~ — done; the Attendance project uses a real
   screenshot (`public/projects/…`), the (NDA) Travel Commerce Platform uses an
   architecture-diagram + metrics visual. Add shots for future non-NDA work.
3. ~~**Project proof links**~~ — done for Attendance (public GitHub repo →
   "View code"). Add `links: { live, repo }` for future projects.
4. **A third real project** — the "MORE → GitHub" archive card carries the deck
   today; a third genuine project (ideally a React/Next.js build) beats two.
5. **Analytics** — Vercel Analytics or Plausible to see what recruiters read.
6. **"Book a call"** — cal.com/Calendly link beside the email CTA for serious
   inbound.
7. **Nova "JD-fit" mode** — let a recruiter paste a job description and have the
   assistant map Navdeep's fit; extends the existing Gemini + context pipeline.
8. **Live GitHub activity strip** — pinned repos / contribution graph via the
   GitHub API; self-updating proof of shipping.
9. **Blog (MDX)** — the biggest long-term SEO lever; only commit if you'll
   write a few posts a year.

**Deliberately not planned:** light mode (the identity is built for dark),
PWA/offline, i18n, and more animation — the current density is the sweet spot.

---

## Verification habits

- `npm run lint` + `npm run build` must stay clean — CI
  (`.github/workflows/ci.yml`) enforces lint, typecheck, and build on every
  push and PR.
- Never run `npm run build` while `next dev` is running — they share `.next`.
- Walk the site after visual changes: preloader (fresh session), hero, deck,
  case studies, footer horizon, ⌘K palette, contact form states — desktop + mobile.
