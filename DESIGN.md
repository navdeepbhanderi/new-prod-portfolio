# Design & Animation Standards — navdeepbhanderi.dev

> Paste this file (or reference it: "follow DESIGN.md") when asking an AI or developer
> to modify this portfolio. Every rule here is already implemented in the codebase —
> new work must match it.

## 1. Identity

**Direction: "Cinematic Editorial Monochrome."** Restrained typographic drama on a
near-black canvas. The awe comes from choreography, oversized type, and light —
never from color. One page, one story: intro → hero → about → expertise →
projects → journey → contact → earth-horizon footer.
The name is shown huge exactly **once** — the footer finale. The intro hands it
to the navbar mark; the hero leads with the claim, not the person.

- Dark-only. Do NOT add a light theme — the starfield/horizon/glass identity depends on dark.
- Monochrome first: whites at low alphas (`foreground/5..20`) do almost all work.
- The single accent (`--accent`, cool blue `hsl(230 60% 66%)`) is reserved for focus rings,
  glows, and atmosphere — never for text or buttons.
- Space motif at the page's edges only: starfield + "earth from space" horizon live in the
  preloader and footer. Don't spread cosmic elements into content sections.

## 2. Color tokens (globals.css — always use tokens, never raw hex)

| Token | Value | Use |
|---|---|---|
| `--background` | `240 6% 4%` | Page canvas |
| `--foreground` | `0 0% 98%` | Text, inverted fills |
| `--muted` / `--muted-foreground` | `240 4% 12%` / `240 5% 58%` | Surfaces / secondary text |
| `--border` | `240 5% 16%` | All hairlines |
| `--accent` | `230 60% 66%` | Focus, glow, atmosphere only |
| status green | Tailwind `emerald-400` | Live/availability dots ONLY — semantic signal, never decorative |

Surfaces: `.glass` (blur 16px, white 3%) and `.glass-strong` (blur 24px, dark 70%) —
never invent new surface styles. Film grain overlay (`.grain`) sits at z-60 over everything.

## 3. Typography

- **Geist Sans** for everything; **Geist Mono** for eyebrows, indices, meta, kbd.
- **Instrument Serif** (italic) is the ONE display-serif accent. Mark it in the string
  with `*asterisks*` (e.g. `Projects built *like products*`); `TextReveal` strips them
  (aria-label included) and renders the word(s) with `.text-accent-italic`. The closing
  marker may sit before punctuation — `*product*,` is parsed correctly.
  Allowed in exactly two places, one phrase each: a **section heading**
  (`SectionHeading`) and the **hero claim** (`PROFILE.claim`).
  Never in body/UI, never more than one phrase per heading.
  It used to also set the case-study outcome pull-quote upright. That is the one
  place it was asked to carry a *paragraph* rather than a phrase, and it doesn't:
  a headline face at ~27px over four lines goes thin and loses its rhythm. That
  quote is Geist Sans now. Keep the serif to phrases.
- Display sizes are fluid clamps: hero claim `clamp(2.375rem,6.4vw,5.75rem)`, intro name
  `clamp(3.25rem,8.6vw,7.5rem)` (the floor is 6b's 52px at 390 — 2.4rem left the stacked
  name looking incidental), footer name `clamp(3.5rem,16.5vw,15rem)`, section
  numerals `clamp(8rem,22vw,18rem)`.
- **Custom font sizes must be registered with tailwind-merge** (`src/lib/utils.ts`).
  It only knows Tailwind's built-in scale, so an unregistered `text-fluid-h2` is filed
  as a *colour* and a trailing `text-foreground` silently deletes it — which is exactly
  how every section heading once shipped at 16px.
- Eyebrow pattern: mono, `text-xs uppercase tracking-[0.2em..0.3em] text-muted-foreground`,
  usually preceded by a `h-px w-6 bg-foreground/30` dash.
- Outlined display type: `.text-stroke-border` (numerals), `.text-stroke-strong` (MORE card),
  `.text-horizon-lit` (footer name — stroke + bottom-up silver fill, pairs with the horizon glow).
- Gradient text: `.text-name-gradient` — apply per-character when chars are transformed
  (background-clip breaks across transformed children otherwise).

## 4. Motion vocabulary (src/lib/motion.ts — the ONLY source of timing values)

| Token | Value | Use |
|---|---|---|
| `EASE_OUT` | `[0.22,1,0.36,1]` | Default for all reveals |
| `EASE_OUT_EXPO` | `[0.16,1,0.3,1]` | Hero/preloader char reveals |
| `EASE_IN_OUT` | `[0.65,0,0.35,1]` | Panel swaps, nav hide |
| `GSAP_EASE` | `"power4.out"` | GSAP twin of EASE_OUT_EXPO |
| `DUR` | fast .2 / base .4 / reveal .7 / slow 1.1 | Duration scale (seconds) |
| `SPRING_SNAPPY` | 400/30 | UI state: nav pill, cursor size |
| `SPRING_SOFT` | 150/20/0.5 | Physical: tilt, magnetic |
| `fadeUpBlur(delay,y)` | opacity+y+blur variant | The core entrance |
| `staggerContainer(stagger,delay)` | parent orchestrator | Lists/menus |
| `chipPop` | scale+y pop | Chips/pills |
| `STAGGER` | chip .04 / char .025 / meta .04 / menu .05 / card .07 | The rhythm, named |
| `INTRO` | intro beats in seconds | Preloader timeline positions |
| `GSAP_EASE_IN_OUT` | `power4.inOut` | Curtain lift |

Rules:
- Never hardcode an easing tuple or duration inline — import from motion.ts.
- Blur is **entrance-only**. Never animate `filter` in scrubbed/hover/looping animations (kills FPS).
- Entrances: `BlurReveal` (block) / `TextReveal` (word) / `CharReveal` (character, SSR-safe split).
  Escalate char-level only for hero + section-finale headlines.
- `KineticText` — scroll-scrubbed word-by-word brighten (opacity 0.16→1); reserved for the
  About manifesto. One per page.
- `ScrambleText` — terminal decode-in for the mono eyebrow/meta layer ONLY (SectionHeading
  eyebrows, About). Never on body copy or headings.
- Stagger rhythm: chips 0.04s, chars 0.015–0.045s, cards 0.07s, menu items 0.05s.

## 5. Scroll choreography rules

- **Engine:** Lenis (duration 1.1) drives native scroll, synced to GSAP ticker in
  `SmoothScroll.tsx`. Access via `useLenis()`. Programmatic scroll: `lenis.scrollTo(el, { offset: -88 })`
  — note a **stopped Lenis silently ignores scrollTo** (close overlays first, act next tick).
- **No GSAP pinning. Ever.** All "pinned" feels use CSS `position: sticky` + scrubbed
  transform/opacity (projects deck: cards `sticky top-[9svh]`, previous card scales to
  0.96-i·0.04 and dims via an opacity overlay — never blur, never brightness filters).
- GSAP work always lives inside `gsap.context` with `ctx.revert()` cleanup (see Timeline.tsx).
- ScrollTrigger refresh points: `document.fonts.ready`, preloader unmount, resize (automatic).
- Parallax: framer `useScroll` + `useTransform`, ±6–18% translation max. Oversized section
  numerals (`ParallaxNumeral`, indices 01–04) drift `yPercent 18→-18` behind headings.
- Scroll-velocity effects (`VelocityMarquee`): targets are pushed by Lenis velocity and decay
  back in a `gsap.ticker` loop — effects must always settle to rest on their own. Hover slows
  the row to a readable crawl (timeScale →0.12, hover-capable pointers only).
- The projects deck carries a **position rail** (`DeckRail`, `xl+`, in the section's right
  gutter): a thumb driven straight off the deck's `scrollYProgress` — no state per frame.
- **Case-study routes are warmed on idle** (`RoutePrefetch`, after the intro hands over,
  skipped under Save-Data / 2g). Next only prefetches a `<Link>` once it scrolls into view,
  and because the navigation runs inside `startViewTransition` an un-warmed route shows a
  *frozen* page rather than a spinner. (A slow click-through in `next dev` is a compile, not
  a regression — dev does no prefetching at all.)
- Case studies get a **reading rail** (`ReadingRail`, fixed right, `xl+` only): one dot per
  narrative block (`#cs-*` ids on `Block`), active dot stretches to a labelled bar via
  IntersectionObserver (`useActiveSection`), click = `lenis.scrollTo(el, { offset: -110 })`.
- **Route transitions:** `next-view-transitions` wraps the root layout; a project's visual
  carries `view-transition-name: project-<id>` on both the deck card link and the case-study
  hero so the card morphs into the page. Case-study navigations must use that package's
  `Link`. Reduced motion kills all view-transition animations (globals.css). One name per
  element per page — never reuse a `view-transition-name`.

## 6. Interaction language (micro)

- **Cursor** (`CustomCursor.tsx`): precise dot + spring ring. Contextual via `data-cursor`
  attributes only — `view` (labelled disc over project visuals), `invert` (blend-difference
  disc over display headings), `hidden` (chat, inputs, palette). Variant detection uses
  delegated `pointerover` (never per-mousemove state). `cursor: none` only on view/invert targets.
- **Buttons:** labels wrapped in `SwapText` (stacked copy slides up on hover/focus);
  icons nudge (`ArrowUpRight` up-right 0.5, `ArrowDown` down 0.5); `Magnetic` wrapper on
  primary CTAs only.
- **Cards:** `GlassCard` = cursor-following glow + border-glow via CSS vars (`--gx/--gy`,
  zero React renders on mousemove). 3D tilt via `Tilt` (max 4–6°, sheen via motion template).
  Hover-scale discipline: parent `overflow-hidden`, child `group-hover:scale-[1.03]`,
  700ms — never scale the card container (that's Tilt's job, ≤1.02).
- **Navbar:** three states on one `layout`-animated element — wide and transparent at the
  top, condensed glass pill once scrolled (`lg+`), compact bar + full-screen sheet below `lg`.
  The active indicator carries one `layoutId="nav-active"` across states, so the underline at
  the top *grows into* the pill as the bar condenses. Hide-on-scroll-down, focus-within always
  reveals. The mark is `#nav-mark` — the intro's flight target.
- **Overlays share one lock:** `src/lib/scroll-lock.ts` is ref-counted. Never set
  `body.style.overflow` directly; closing one overlay would unlock the page under another.
- **Command palette:** ⌘K/Ctrl+K, top-center, max-w 38rem. Results are grouped
  (Navigate · Projects · Expertise · Actions · Connect); the technology index only appears
  once there's a query. It is a real combobox — `role="combobox"` + `aria-activedescendant`
  on the input, `role="listbox"/"option"` on the rows — plus ⌘I (ask AI) and ⌘E (copy email).
  Framer transforms clobber CSS translate centering — center overlays with a flex wrapper.

## 7. Signature moments (do not duplicate their techniques elsewhere)

1. **Intro** (once per session, `nv-intro-done` in sessionStorage + pre-paint `<head>`
   script sets `data-intro="done"` on `<html>` — keep `suppressHydrationWarning` there).
   A loading *manifest*, not a centred word: corner registration marks, top meta row,
   left-aligned outlined name, boot log, and the counter as the largest number on screen.
   **The counter is the real progress value** — `document.fonts.ready` and the hero
   portrait's decode report in, and the name's light sweep is the same number as a
   `clip-path`. Never fake it: warm assets finish early (floor `MIN_MS` so the sweep is
   seen), a stalled network still leaves at `MAX_MS`, and any key or tap skips.
   The fill is a plain clip against a static gradient — left→right on one line
   (3c), top→bottom once the name stacks below `sm` (6b). No light bar rides the
   leading edge; that turns a wipe into a scan, and it is not in the design.
   The floor rule sits on an unlit track, and the horizon behind it is
   `HorizonGlow variant="intro"` — 3c's proportions rather than 3g's.
   The name then **drifts toward `#nav-mark`** (travel capped ±110/90px, scale 0.94,
   dissolve — a lean, never a full flight) as the double curtain lifts;
   `intro.complete()` fires at curtain-start so the hero rises underneath.
2. **Hero:** a full-bleed portrait column (`md+`) or top band (below `md`) that hands over
   to the canvas through axis-specific scrims; the claim reveals word-by-word on the
   intro hand-off (`TextReveal trigger="manual"`), and a fact ledger sits on a hairline at
   the floor. 3-depth pointer parallax (bg ×-36 inverted, copy ×12, portrait ×22).
   **Exit choreography:** scrubbed to scroll-out — copy drifts −70px, portrait −130px
   (deeper layer exits faster), both fading; framer motion values on wrapper layers
   OUTSIDE the pointer-parallax wrappers, gated by `usePrefersReducedMotion`.
3. **Projects deck:** sticky stacking cards (scale + dim scrub on every screen; reduced
   motion → plain flow) + "MORE → GitHub" archive card. Each card is an **overview** —
   title, tagline, a 3-line teaser, stack chips, and a "Read case study" CTA; the full
   description, highlights, approach, and outcome live on `/projects/[slug]`. The card
   visual is one of: a real product screenshot, an NDA-safe architecture diagram +
   metrics, or a generic mock (`ProductMock`, precedence image → diagram → mock); the
   index numeral parallaxes behind it. Card height follows the visual so nothing clips.
4. **Expertise grid:** *weighted*, and weighted by data (`ExpertiseCategory.weight`, never
   by index) — `primary` is a tall hero panel, `utility` a full-width strip, the rest compact
   cards. Below `md` it becomes the primary panel plus an accordion ledger. Under it, two
   velocity-reactive `VelocityMarquee` rows (decorative, `aria-hidden`).
5. **Footer finale:** sticky-bottom uncover (`<main>` is opaque z-10 and lifts away; footer
   `sticky bottom-0 z-0` — z must stay ≥0 or it becomes unclickable). Upper half carries the
   ask (closing line + email) and a three-column sitemap. Starfield with rare shooting stars
   (~every 9–18s, none under reduced motion) + `HorizonGlow` — the canvas is `active` only
   once the footer is uncovered, because a sticky footer always "intersects" the viewport
   and would otherwise repaint ~250 stars a frame under an opaque `<main>` all session.
   **Finale scrub** (one GSAP timeline over the last 0.7 viewport): `.footer-horizon`
   rises (yPercent 22→0), the inner content settles, and `.footer-name` brightens last
   (opacity 0.3→1 starting at t=0.3) — the sunrise happens because the visitor scrolled.
   (earth rim, apex must stay inside its masked container; mask prevents bloom seams),
   `.text-horizon-lit` giant name, live IST clock.
   **The horizon is an arc, not a rule.** `HorizonGlow` sizes its height from its
   width so `border-radius: 999px` leaves the flat run at `width - height`; both
   rounded ends must land inside the viewport (3g bends over its outer ~90px of
   1440, 3c over ~120px). Any fixed px width only matches at one viewport — the
   old `max(2300px,170vw)` was 3g exactly up to 1353px and dead straight above it.

## 8. Z-index map (keep sacred)

`main` 10 · footer 0 (below main, never negative) · grain 60 · navbar 75 · nav sheet 76 ·
cursor 80 · palette 85 · chat 88–90 · intro 95.
The chat launcher floats at 90, so it is hidden via `html[data-nav-open]` while the sheet is open.

## 9. Accessibility (non-negotiable)

- Every framer animation respects reduced motion via `<MotionConfig reducedMotion="user">`
  (mounted in layout). CSS animations are killed by the global media query. GSAP/imperative
  code must check `usePrefersReducedMotion()` and no-op or render static.
- **MotionConfig strips transforms but keeps delays.** Any staged entrance must collapse its
  own delays under reduced motion (see the hero's `at()`), or those visitors sit watching an
  empty section while the choreography "plays" invisibly.
- Reduced-motion states: no preloader, project deck becomes plain flow, numerals/marquees
  static, tilt/parallax/cursor/magnetic off, starfield renders one static frame.
- Touch devices (`useIsTouch`): no custom cursor, tilt, or magnetic; sticky deck keeps
  position but drops the scrub below `lg`.
- Split-text components render real text for AT: `aria-label` on the parent, `aria-hidden`
  spans for the characters. Decorative layers are `aria-hidden`.
- Every hover reveal has a focus-visible twin. Single focus indicator: the global
  `:focus-visible` outline (accent, offset 3px) — no component rings.
- Overlays (menu/chat/palette) lock scroll (`lenis.stop()` + body overflow) and restore focus.

## 10. Performance (non-negotiable)

- Animate **transform and opacity only** (background-position via CSS vars is the one
  paint-only exception, contained with `contain: paint`).
- Zero React state per mousemove: motion values, CSS custom properties, or delegated
  boundary events (`pointerover`) only.
- All listeners `{ passive: true }`.
- **`will-change` on scroll-linked transforms is required, not optional.** Framer only sets
  it for *running animations*; an element driven by a scroll `useTransform` gets no hint, so
  it re-rasterises its whole surface every frame instead of compositing. The projects deck's
  scaled card carries it explicitly — adding it moved p95 from 133ms to 50ms.
- **Never put `backdrop-filter` inside anything that transforms per frame.** The deck card
  scales continuously; the mock inside it used `.glass-strong`, and every frame paid for a
  fresh backdrop blur. Over an opaque surface the blur is invisible anyway — use a solid
  translucent background.
- **Perpetual animation must be gated to visibility.** A looping blur/opacity animation
  repaints for the life of the page whether or not it is on screen. The skill marquees
  (`gsap.ticker` + skew), the footer starfield and the horizon breathe are all gated by
  IntersectionObserver or by the footer's uncover state; the hero's drifting blob was
  simply made static.
- **Full-viewport fixed overlays must be promoted** (`.grain::after` carries
  `will-change: transform`), or they repaint against the content scrolling underneath.
- Measure before optimising: drive real wheel events, sample rAF deltas under 4x CPU
  throttle, and A/B one suspect at a time. Guessing picks the wrong effect.
- Canvas effects (Starfield): one rAF loop, DPR capped at 2, paused via IntersectionObserver
  when offscreen.
- Images through `next/image` (AVIF/WebP) with `sizes`; hero portrait is `priority` (LCP).
- Never run `npm run build` while `next dev` is running — they share `.next` and it corrupts.

## 11. Content & data (single sources of truth)

- Identity/copy: `src/lib/profile.ts` · canonical origin: `src/lib/site.ts`
- Sections data: `src/data/{projects,expertise,skills,timeline,socials}.ts`
- The section list itself: `src/data/navigation.ts` — the navbar, footer sitemap, command
  palette and 404 all read from it. Don't re-declare it locally.
- Projects support optional `links: { live, repo }` — buttons render automatically.
- Brand: the **N-mark** (`src/components/brand/Logo.tsx`, `currentColor`, framed only when
  standalone). Icons are generated from it — `app/icon.tsx` (192) and `app/apple-icon.tsx`
  (180) via `ImageResponse`; `src/lib/og-mark.ts` carries the data-URI form for OG images.
  Email templates degrade to a text "N" (Gmail strips inline SVG and blocks data URIs).
- SEO: JSON-LD @graph (Person/WebSite/ProfilePage) in profile.ts; metadata/manifest/robots/
  sitemap all derive from `SITE_URL`.
- **No unverifiable numbers.** The timeline is deliberately dateless (it carries `stage`
  labels, not years) and there is no "N years of experience" counter anywhere. Don't add
  one without the real figure.

## 12. Do / Don't quick list

**Do:** reuse `BlurReveal`/`TextReveal`/`CharReveal`/`GlassCard`/`Tilt`/`SwapText`/`Magnetic`/
`SectionHeading`/`ParallaxNumeral` · import all timing from motion.ts · gate every new effect
for reduced-motion + touch · keep new sections' eyebrow/heading pattern via `SectionHeading`.

**Don't:** add color · add light mode · pin with GSAP · scrub blur · setState on mousemove ·
hardcode easings/durations/URLs · negative z-index on interactive elements · put content
inside `aria-hidden` wrappers without a text alternative · exceed 6° tilt or 1.03 hover scale ·
add a fourth font family (Geist Sans / Geist Mono / Instrument Serif accent only) · use the
serif accent outside a section-heading emphasis phrase.
