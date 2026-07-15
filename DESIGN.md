# Design & Animation Standards — navdeepbhanderi.dev

> Paste this file (or reference it: "follow DESIGN.md") when asking an AI or developer
> to modify this portfolio. Every rule here is already implemented in the codebase —
> new work must match it.

## 1. Identity

**Direction: "Cinematic Editorial Monochrome."** Restrained typographic drama on a
near-black canvas. The awe comes from choreography, oversized type, and light —
never from color. One page, one story: preloader → hero → about → expertise →
projects → journey → contact → earth-horizon footer.

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
- Display sizes are fluid clamps: hero name `clamp(3.5rem,11vw,8.5rem)`, footer name
  `clamp(3.5rem,14vw,13rem)`, section numerals `clamp(8rem,22vw,18rem)`.
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
- **Navbar:** active-section pill (`layoutId="nav-active"`, `SPRING_SNAPPY`, IntersectionObserver
  rootMargin `-35% 0px -60% 0px`), hide-on-scroll-down past 160px / reveal on any up-delta,
  focus-within always reveals. Link hover = underline sweep origin-right→left, also on focus-visible.
- **Command palette:** ⌘K/Ctrl+K, top-center at `16svh`, max-w 560px. Framer transforms
  clobber CSS translate centering — center overlays with a flex wrapper, never `-translate-x-1/2`.

## 7. Signature moments (do not duplicate their techniques elsewhere)

1. **Preloader** (once per session, `nv-intro-done` in sessionStorage + pre-paint `<head>`
   script sets `data-intro="done"` on `<html>` — keep `suppressHydrationWarning` there):
   counter 000→100 + hairline, outlined name fills with light in sync, then the name
   **drifts toward `#hero-name`** (travel capped ±110/90px, scale 0.94, dissolve — a lean,
   never a full flight) as the double curtain lifts (`power4.inOut`); `intro.complete()`
   fires at curtain-start so the hero reveal rises underneath.
2. **Hero:** char-reveal first name (gradient) over outlined surname (`.hero-surname-char`),
   3-depth pointer parallax (bg ×-36 inverted, copy ×12, portrait ×22 + ≤2.5° rotate);
   below `lg` the portrait becomes a small glass-ringed circle above the badge.
   **Exit choreography:** scrubbed to scroll-out — copy drifts −70px, portrait −130px
   (deeper layer exits faster), both fading; framer motion values on wrapper layers
   OUTSIDE the pointer-parallax wrappers, gated by `usePrefersReducedMotion`.
3. **Projects deck:** sticky stacking cards + terminal "MORE → GitHub" archive card. Inside
   each card the mock and index numeral parallax in opposite directions; card hover plays the
   mock's micro-story (itinerary days cascade + destination pings / last roster dot checks in).
4. **Expertise constellation:** hovering a domain card draws hairlines (`foreground/16`,
   pathLength draw, 0.045s stagger) from its icon to the other five icons — desktop
   hover only, gated by `useIsTouch` + reduced motion. Icon positions are measured on
   hover, never cached.
5. **Footer finale:** sticky-bottom uncover (`<main>` is opaque z-10 and lifts away; footer
   `sticky bottom-0 z-0` — z must stay ≥0 or it becomes unclickable), starfield with rare
   shooting stars (~every 9–18s, thin gradient streak, none under reduced motion) + `HorizonGlow`.
   **Finale scrub** (one GSAP timeline over the last 0.7 viewport): `.footer-horizon`
   rises (yPercent 22→0), the inner content settles, and `.footer-name` brightens last
   (opacity 0.3→1 starting at t=0.3) — the sunrise happens because the visitor scrolled.
   (earth rim, apex must stay inside its masked container; mask prevents bloom seams),
   `.text-horizon-lit` giant name, live IST clock.

## 8. Z-index map (keep sacred)

`main` 10 · footer 0 (below main, never negative) · grain 60 · navbar 75 · cursor 80 ·
palette 85 · chat 88–90 · preloader 95.

## 9. Accessibility (non-negotiable)

- Every framer animation respects reduced motion via `<MotionConfig reducedMotion="user">`
  (mounted in layout). CSS animations are killed by the global media query. GSAP/imperative
  code must check `usePrefersReducedMotion()` and no-op or render static.
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
- All listeners `{ passive: true }`. No hand-sprinkled `will-change` (framer manages it).
- Canvas effects (Starfield): one rAF loop, DPR capped at 2, paused via IntersectionObserver
  when offscreen.
- Images through `next/image` (AVIF/WebP) with `sizes`; hero portrait is `priority` (LCP).
- Never run `npm run build` while `next dev` is running — they share `.next` and it corrupts.

## 11. Content & data (single sources of truth)

- Identity/copy: `src/lib/profile.ts` · canonical origin: `src/lib/site.ts`
- Sections data: `src/data/{projects,expertise,skills,timeline,socials}.ts`
- Projects support optional `links: { live, repo }` — buttons render automatically.
- SEO: JSON-LD @graph (Person/WebSite/ProfilePage) in profile.ts; metadata/manifest/robots/
  sitemap all derive from `SITE_URL`. Real favicons live in `src/app/` (favicon.ico,
  icon.png 192, apple-icon.png 180).

## 12. Do / Don't quick list

**Do:** reuse `BlurReveal`/`TextReveal`/`CharReveal`/`GlassCard`/`Tilt`/`SwapText`/`Magnetic`/
`SectionHeading`/`ParallaxNumeral` · import all timing from motion.ts · gate every new effect
for reduced-motion + touch · keep new sections' eyebrow/heading pattern via `SectionHeading`.

**Don't:** add color · add light mode · pin with GSAP · scrub blur · setState on mousemove ·
hardcode easings/durations/URLs · negative z-index on interactive elements · put content
inside `aria-hidden` wrappers without a text alternative · exceed 6° tilt or 1.03 hover scale ·
add a second accent font.
