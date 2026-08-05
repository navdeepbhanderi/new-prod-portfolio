# Redesign log — 2026-08-05

A record of the redesign pass: what changed, what was decided, what broke, and
how it was verified. **[DESIGN.md](./DESIGN.md) is the living standard** — if
the two ever disagree, DESIGN.md wins. This file is history and rationale.

Source of truth for the visuals: `pdesign/Hero + Contact Redesign.dc.html`, a
10-turn design exploration. Its frames are fixed-width, absolutely-positioned
mockups (1440 / 834 / 390 canvases with hardcoded copy). They were **not** copied
as markup — the page has to be fluid and driven by `src/data/*`. What *was*
copied verbatim: gradients, sizes, colours, letter-spacing, timings.

---

## 1. Directions implemented

| Section | Desktop | Mobile |
|---|---|---|
| Intro / preloader | 3c + 6a sequence | 6b |
| Logo | 4a option 01 — "The N-mark" | — |
| Navbar | 4b (top / condensed pill / sheet) | 4b |
| Hero | 3b full-bleed frame | 4c |
| Expertise | 2b weighted grid | 5a |
| Experience | 8a refined rail | 8b |
| Projects deck | 3e | 7a |
| Case study | 3f **minus** its "On this page" column | 7b |
| Contact | 1c | 5b |
| Footer | 3g | 5c |
| Command palette | 10a | — |
| Ask AI | 10b panel | 10b |

**Not built** (user's call): 10c "How I work", 10d Archive table, the 9a/9b/3d
experience variants, the 1a/1b/3a hero variants, 2a expertise ledger.

## 2. Decisions that reshape the identity

1. **The hero no longer carries the name.** Per 3b the H1 is the claim —
   *"Frontend built like product, not like tickets."* — and the name drops to a
   byline. The intro's name therefore flies to the **navbar mark** (`#nav-mark`),
   not `#hero-name`, and the giant wordmark appears exactly once: the footer.
2. **No unverifiable numbers.** Every "2.5+ years in production" stat and every
   timeline year in the mocks was dropped. The timeline is dateless and carries
   `stage` labels (Start · Education · Industry · Present). `Portfolio — {year}`
   survives because it's `new Date().getFullYear()`, not a claim. Where 3b's
   ledger had an Experience cell it became **Currently**.
3. **The case study keeps the existing `ReadingRail`.** 3f's "On this page"
   column was not built; the fixed right-edge dot rail (xl+) is the on-page nav,
   so the `#cs-*` block ids must be preserved.
4. **Reverse-chronological experience.** 8a puts Present first — a recruiter
   reads the current role and stops.

## 3. New files

| File | Why |
|---|---|
| `src/components/brand/Logo.tsx` | The N-mark (`currentColor`, framed only when standalone) + lockup |
| `src/app/icon.tsx`, `src/app/apple-icon.tsx` | Icons generated from the mark via `ImageResponse`; replaced `favicon.ico` / `icon.png` / `apple-icon.png` |
| `src/lib/og-mark.ts` | Data-URI form of the mark for OG images (satori can't use the component) |
| `src/lib/scroll-lock.ts` | Ref-counted scroll lock shared by menu / palette / chat |
| `src/data/navigation.ts` | The section list, previously duplicated in four places |
| `src/components/layout/RoutePrefetch.tsx` | Warms case-study routes on idle |

## 4. Bugs found and fixed

**Pre-existing, and the most consequential thing in this pass:**

- **Every section heading rendered at 16px instead of 60px.** `tailwind-merge`
  only knows Tailwind's built-in font-size scale, so it classified the custom
  `text-fluid-h2` as a *colour*; the trailing `text-foreground` in the same
  string then deleted it. Fixed by registering the `fluid-*` scale with
  `extendTailwindMerge` in `src/lib/utils.ts`. Measured 16px → 60px to confirm.
- **The emphasis parser dropped its closing marker before punctuation** —
  `*product*,` rendered a literal asterisk. `TextReveal` now ends the span on
  "an asterisk anywhere after the first character".
- **Overlays fought over `body.style.overflow`** — closing the palette unlocked
  the page while the mobile menu was still open. Now ref-counted.
- **The chat crashed the route on corrupt `localStorage`** — an entry missing
  `content` threw inside render, and with no error boundary above the widget it
  took down the whole page on every load until storage was cleared. The restore
  now validates shape.
- **The command palette's selection was invisible to screen readers** — no
  combobox semantics. Now `role="combobox"` + `aria-activedescendant` +
  `role="listbox"/"option"`.
- **Chat replies were never announced** — the transcript now has `aria-live`.

**Introduced during the redesign, then fixed:**

- Reduced-motion users sat through the hero's entrance *delays* watching an
  empty screen (MotionConfig strips transforms but keeps delays).
- The mobile nav sheet was overlapped by the floating chat launcher (z-76 vs
  z-90) — now hidden via `html[data-nav-open]`.
- The card metrics rendered twice: once in the mock's architecture diagram and
  again in the new card strip.

## 5. Performance

The redesign **did** regress scroll performance; it was measured, not guessed.
A Chrome trace showed the cost was paint, not JavaScript — **4,504ms of
RasterTask across 7,053 tasks** in a 7-second scroll.

| | p50 | p95 | frames >50ms |
|---|---|---|---|
| Pre-redesign (`HEAD` built in a throwaway worktree) | 50ms | 83–100ms | 22–32% |
| Redesign, before fixes | 50ms | 133ms | 53% |
| Redesign, after fixes | **33ms** | 50–83ms | **12–17%** |

Five causes, each A/B-verified in isolation:

1. **The deck's scale scrub had no compositing layer.** Framer only sets
   `will-change` for running animations; a scroll-linked `useTransform` doesn't
   qualify, so the card re-rasterised its whole surface every frame. The hint
   alone took p95 from 133ms → 50ms.
2. **`backdrop-filter` inside that scaling card** (`ProductMock` used
   `.glass-strong`). Over an opaque gradient the blur was invisible and cost a
   fresh backdrop blur per frame.
3. **The film-grain overlay wasn't promoted** — a full-viewport fixed layer
   repainting against the content scrolling beneath it.
4. **The hero's blurred blob drifted on an infinite loop**, repainting long
   after the hero had scrolled away. Now static.
5. **The marquee ticker and horizon breathe ran for the life of the page.**
   Both gated; the breathe was removed outright.

Tested and **rejected**: promoting the footer wordmark to its own layer made
things worse (>50ms 12–17% → 32–41%).

Also: **the case-study "2–3s to open" was a dev-mode artifact.** Next compiles
`/projects/[slug]` on demand in dev (1,862ms); in production it's prerendered and
navigates in 124ms. The real gap was that Next only prefetches a `<Link>` once it
scrolls into view, so opening a project from the palette or footer still paid for
the fetch — and inside `startViewTransition` that's a *frozen page*, not a
spinner. `RoutePrefetch` warms both routes on idle (151ms cold nav from the top).

### Re-running the measurements

Throwaway harnesses, run from a scratch dir with `puppeteer-core` installed
against `npm run start` (never `next dev` — it doesn't prefetch and compiles on
demand):

- **Scroll jank**: drive real wheel events (so Lenis handles them), sample rAF
  deltas in-page, 4× CPU throttle, report p50/p95/%>50ms. A/B one suspect at a
  time via `page.addStyleTag`.
- **Where the time goes**: `page.tracing.start({categories:["devtools.timeline"]})`,
  then aggregate `RasterTask` / `Paint` / `Layout` / `FunctionCall` durations.
- **Regression baseline**: `git worktree add <tmp> HEAD`, symlink `node_modules`,
  build, serve on another port, measure the same way.

Absolute milliseconds under 4× throttle + software GL are pessimistic; the
relative comparison is the trustworthy part.

## 6. Verification performed

- `tsc --noEmit`, `eslint`, `next build` — all clean.
- Audited **390 / 834 / 1280 / 1920** across `/`, `/projects/[slug]` and the 404:
  no horizontal overflow, no console errors.
- Reduced motion: no intro, deck falls to plain flow, marquees/numerals static.
- Keyboard: skip link → nav → palette → chat → form; Escape and focus restore on
  every overlay.
- Intro: plays once per session, skips on any key/tap, hands off to `#nav-mark`;
  counter reflects real asset progress.
- API routes: `/api/chat` streams from Gemini, `/api/contact` returns field
  errors and silently absorbs the honeypot.

⚠️ **Never run `npm run build` while a dev or prod server is running** — they
share `.next` and it corrupts. It happened twice during this work and produced
a page serving 400s for every static asset (and a bogus "perfect" perf reading,
because nothing was rendering). Symptom: `Refused to apply style … MIME type
('text/html')`. Fix: stop the server, `rm -rf .next`, rebuild.

## 7. Known gaps / follow-ups

- **No `favicon.ico`.** Browsers use the generated `/icon`; a true `.ico` for
  legacy crawlers would need exporting by hand.
- **README's Core Web Vitals figures predate the redesign** — they were replaced
  with principles plus a note to re-measure. Worth an actual Lighthouse run.
- **The portrait** works in all three hero frames (column / narrow column / top
  band), but a second crop would frame better on phones.
- **The chat accepts a client-supplied history**, so a caller can forge
  `assistant` turns. Contained by the system prompt and the href allow-list;
  impact is reputational, not technical.
- **Still no tests.** CI runs lint + tsc + build only. `matchIntent` and the
  contact validator are pure functions and would be cheap first tests.
- **The auto-reply still quotes the sender's message** back to an unverified
  address (flagged in the earlier review, out of scope here).
