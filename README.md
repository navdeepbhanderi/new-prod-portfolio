# Navdeep Bhanderi — Portfolio

Award-site-tier personal portfolio: cinematic monochrome design, scroll-driven
storytelling, per-project case studies, an AI assistant, and a real contact
pipeline — live at **[navdeepbhanderi.dev](https://navdeepbhanderi.dev)**.

> Design & animation standards live in **[DESIGN.md](./DESIGN.md)** — read it
> (or paste it into an AI prompt) before changing any visual or motion code.

## Highlights

- **Cinematic layer** — once-per-session preloader (counter + light-fill name +
  curtain lift over a starfield), character-level hero reveal with 3-depth mouse
  parallax, sticky stacking project deck, parallax section numerals,
  velocity-reactive skill marquees, and an "earth from space" footer finale.
- **Interaction language** — contextual custom cursor, active-section navbar pill
  with hide-on-scroll, 3D tilt cards, text-swap buttons, ⌘K command palette.
- **Case studies** — `/projects/[slug]` pages (problem → approach → features →
  outcome) with per-page SEO and JSON-LD.
- **Ask Navdeep AI** — chat assistant (Gemini when configured, local knowledge
  base fallback), lazy-loaded on idle.
- **Contact pipeline** — validated form with honeypot + rate limiting; sends an
  owner notification **and** a themed auto-reply via Gmail SMTP.
- **SEO** — Person/WebSite/ProfilePage JSON-LD graph, manifest + full favicon
  set, sitemap incl. case studies, canonical URLs, `next/image` LCP portrait.
- **Performance** — LCP ~190 ms, CLS 0, zero long tasks (measured on the
  production build). Every effect has reduced-motion and touch fallbacks.

## Tech

**Next.js 15** (App Router) · **TypeScript** · **Tailwind CSS 3.4** ·
**Framer Motion 12** · **GSAP + ScrollTrigger** · **Lenis** · **nodemailer** ·
**Geist / Geist Mono**

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build (stop `dev` first — shared .next)
```

## Environment variables (`.env.local` locally, project settings on Vercel)

| Variable | Purpose |
|---|---|
| `GMAIL_USER` | Sender account for the contact form (`work.navdeepbhanderi@gmail.com`) |
| `GMAIL_APP_PASSWORD` | Gmail **App Password** — create at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) (needs 2FA) |
| `CONTACT_TO` | Where inquiry notifications land (`navdeepbhanderi1@gmail.com`) |
| `GEMINI_API_KEY` | Enables real AI chat — free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey); without it the widget uses the built-in knowledge base |
| `GEMINI_MODEL` | Optional, defaults to `gemini-2.5-flash` |

## Editing content (all data-driven)

- **Profile / bio / availability** → `src/lib/profile.ts`
- **Canonical domain** → `src/lib/site.ts`
- **Projects + case studies + proof links** → `src/data/projects.ts`
- **Skills & expertise** → `src/data/expertise.ts`, `src/data/skills.ts`
- **Timeline** → `src/data/timeline.ts` · **Socials** → `src/data/socials.ts`
- **AI answers** → `src/lib/ai/knowledge.ts`
- **Email templates** → `src/lib/email/templates.ts`

## 🚀 Launch checklist (do these before/at deploy)

- [ ] **Add the Gmail App Password** to env (`GMAIL_APP_PASSWORD`) and send a
      test message through the form — both emails should arrive styled.
- [ ] **Add `GEMINI_API_KEY`** so Ask Navdeep AI gives real answers
      (`source: "gemini"` in the `/api/chat` response confirms it).
- [ ] Deploy to Vercel, attach **navdeepbhanderi.dev**, set all env vars.
- [ ] Validate the share card at [opengraph.xyz](https://www.opengraph.xyz) and
      run [Rich Results Test](https://search.google.com/test/rich-results).
- [ ] Add the property in **Google Search Console**, submit `/sitemap.xml`
      (needs a one-line verification token in `layout.tsx` metadata).
- [ ] Quick real-device pass: phone (touch fallbacks, footer spacing) and a
      `prefers-reduced-motion` check.

## 📈 Roadmap — highest-impact improvements next

1. **Real project screenshots** — replace the stylised CSS mocks with actual
   product shots (`public/projects/…`); single biggest credibility upgrade.
2. **Project proof links** — fill `links: { live, repo }` in
   `src/data/projects.ts`; "Live demo" / "View code" buttons render automatically.
3. **Resume download** — drop `public/resume.pdf` and add a CTA in the hero +
   contact section.
4. **A third real case study** — the "MORE → GitHub" archive card carries the
   deck today; three genuine projects beats two + placeholder.
5. **Professional experience entries** — the Journey timeline is
   education-heavy; add internships/freelance/work engagements with dates.
6. **Analytics** — Vercel Analytics or Plausible to see what recruiters read.
7. **"Book a call"** — cal.com/Calendly link beside the email CTA for serious
   inbound.
8. **Live GitHub activity strip** — pinned repos / contribution graph via the
   GitHub API; self-updating proof of shipping.
9. **Blog (MDX)** — the biggest long-term SEO lever; only commit if you'll
   write a few posts a year.

**Deliberately not planned:** light mode (the identity is built for dark),
PWA/offline, i18n, and more animation — the current density is the sweet spot.

## Verification habits

- `npm run lint` + `npm run build` must stay clean.
- Never run `npm run build` while `next dev` is running — they share `.next`.
- Walk the site after visual changes: preloader (fresh session), hero, deck,
  case studies, footer horizon, ⌘K palette, contact form states — desktop + mobile.
