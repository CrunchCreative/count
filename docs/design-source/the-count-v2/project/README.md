# The Count — Design System

A calm analytical UX for football betting research and pattern discovery. Premium dark terminal aesthetic — closer in feel to Linear, Arc, or Apple Vision Pro than to a sportsbook.

## What this project is

The Count is a football betting research and pattern discovery platform. It sits between traditional football statistics platforms and sportsbook interfaces. The fixture is the primary object; the pattern engine surfaces consistent historical tendencies (e.g. "City corners 8+ in 5 of last 5") that users assemble into builders.

Two user types:
- **Casual users** want fast insights, AI summaries, quick saves.
- **Advanced users** want raw data visibility, matrix research, statistical scanning, manual pattern recognition.

This design system formalises the visual language and component vocabulary developed across the dashboard, fixture flow, AI tab, slip system, and Builders performance views.

## Sources

The system was built from a written design brief and four reference screens (`uploads/Count-dashboard.jpg`, `Count-fixtureOverview.jpg`, `Count-teammatrix.jpg`, `Count-playermatrix.jpg`). All assets in this design system are derived from the original prototype in this same project — the same `styles.css`, `components/`, `screens/` you see here are the live source of truth.

## Index

- **`README.md`** — this file
- **`colors_and_type.css`** — full design token CSS variables (colors, type, spacing, glass surfaces)
- **`styles.css`** — full live stylesheet powering all live HTML files
- **`components/`** — atoms, kit SVGs, charts, slip system, tug-of-war
- **`screens/`** — assembled screens (dashboard, fixtures-list, fixture, builders, builder-result)
- **`data.js`** + **`data-builders.js`** — fixture catalogue, team kits, seed builders, performance data
- **`preview/`** — small design-system tab cards (one concept per card)
- **`ui_kits/mobile/`** — interactive mobile UI kit (working prototype)
- **`SKILL.md`** — agent-skill front-matter for cross-tool use
- **Live HTML files** at the project root showcase real flows:
  - `index.html` — full interactive prototype
  - `Fixtures.html` — Fixtures list mobile + desktop
  - `AI-tab.html` — AI tab states
  - `Slip.html` — slip system states
  - `Builders.html` — Builders tab states + Performance sub-page

---

## Content fundamentals

### Vocabulary rules (responsible gambling)
This is **non-negotiable**. Every piece of copy must respect these rules.

**Allowed language**: trend, alignment, consistency, historical tendency, pattern, signal, hit rate, floor, threshold.

**Forbidden language**: guaranteed, lock, easy money, banker, sure thing, can't lose. **Never use certainty language even when data is 5/5.** Always frame as historical tendency, not future prediction.

Good: "Floor of 8 corners across last 5", "Holds over the L20 window", "Cards-above-average referee tendency".
Bad: "City definitely gets 8 corners", "This is a lock", "Easy win".

### Tone
- Calm, factual, second-person but rare. Mostly declarative third-person about the data.
- Conversational without being chatty. The AI brief reads like a junior analyst summarising a report — not a salesperson.
- Never excited. Never apologetic. Never marketing-coded.

### Casing
- **Sentence case** for everything except meta-labels and section labels (UPPERCASE WITH 0.4PX LETTER-SPACING).
- Numbers always in mono font (JetBrains Mono), even inside sentences when surfaced as data (e.g. "City corners <span style='font-family: mono'>10</span> avg").
- League names, fixture names — sentence case as displayed by the league. Premier League. La Liga.

### Hierarchy
- **H1** — page title or fixture name; the single largest type on each scoped page (27px / 500).
- **H2** — screen-section title (22px / 500) — "Team matrix", "Player matrix", "Performance".
- **H3** — panel headers (14–15px / 500) — "Strongest Angles", "Fixture Preview".
- Body emphasis (13px / 500) for leg titles, builder names.
- Body (12–13px / 400) for descriptions.
- Caption (11px / 400) for sub-lines, hints.
- Micro (9–10px / 400, mono, letter-spaced) for meta lines, micro-labels.

### No emoji
The brand does not use emoji. Use semantic colour or iconography instead. The single permitted exceptions are the tick / cross / chevron / + glyphs delivered as SVG icons.

### Examples

**Good headline**
> "Combined corners hold over 10 fixtures"

**Good sub-line**
> "8+ in 18 of last 20. Floor stays even when Palace defends deep."

**Good AI brief paragraph**
> "Man City arrive on a five-match unbeaten run with scoring patterns holding deep — 2+ goals in every fixture of the L5 window, paired with a corner floor of eight against teams that defend low."

**Good empty state**
> "No builders yet. Tap any angle in the app to start your first one."

**Bad** (don't ship this)
> "Lock-in pick! 🔒 City CRUSHING corners. EASY MONEY."

---

## Visual foundations

### Colour
The palette has three roles: dark backgrounds, two accents (amber as dominant, teal as success/secondary), and a 5-step warm text scale.

**Backgrounds**
- Page: `#08090B` (near-black, very slight cool tint)
- Hero card: `#0B1A14` (deep teal-black, used behind featured / engine visuals)
- Inset pocket (darker rectangle inside a lighter panel): `rgba(0,0,0,0.18)` to `rgba(0,0,0,0.22)`

**Primary accent — amber**
Used for dominant data, primary stats, "high value" signal, active states, primary CTAs.
- `#E8B53A` bright · `#F1C455` light · `#BA7517` mid · `#854F0B` deep

**Secondary accent — teal**
Used for success, "bulletproof" 5/5 patterns, active tabs on segmented controls, positive secondary signals.
- `#5DCAA5` bright · `#1D9E75` mid · `#0F6E56` deep

**Loss / red**
Used sparingly — for L scorelines, lost builders, missed legs. Always paired with a teal counterpart.
- Gradient `linear-gradient(180deg, rgba(122,34,34,0.5), rgba(122,34,34,0.25))`, border `rgba(180,55,55,0.35)`, text `#F09595`

**Text scale (warm off-whites)**
- Primary `#F2F0E8` · Secondary `#E8E6DF` · Muted `#9A9890` · Hint `#7A7870` · Very faint `#5A5852`

**Borders**
- Default `rgba(255,255,255,0.06)` (0.5px)
- Stronger `rgba(255,255,255,0.10)`
- Faintest `rgba(255,255,255,0.04)`

### Backgrounds: the signature radial wash
Every page sits over a static radial-gradient backdrop:

- **Top centred amber halo** — `radial-gradient(ellipse 90% 50% at 50% 0%, rgba(232,181,58,0.14) 0%, rgba(232,181,58,0.06) 28%, rgba(29,110,86,0.04) 55%, rgba(8,9,11,0) 75%)`
- **Bottom-right teal pool** — `radial-gradient(circle 60% at 90% 95%, rgba(29,110,86,0.10) 0%, rgba(8,9,11,0) 65%)`

This wash is fixed (not scrollable), sits beneath all content, and is the reason the glass panels read as glass — they pick up colour from the lit base behind them, not pure black.

### Type
- **Primary**: System sans-serif stack (Söhne fallback) — `"Söhne", "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif`
- **Mono**: `"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace`
- Two weights only: **400 regular**, **500 medium**. Never bolder.
- Letter-spacing: negative on H1/H2, positive (0.3–0.6px) on UPPERCASE meta labels.

### Glass — the signature surface
Every panel uses one of three recipes:

**Standard glass panel**
```css
background: linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.005) 100%);
border-radius: 14px;
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.05),
  inset 0 0 0 0.5px rgba(255,255,255,0.05);
```

**Featured / elevated glass panel** — gets an amber rim glow
```css
background: linear-gradient(180deg, rgba(255,255,255,0.035) 0%, rgba(255,255,255,0.008) 100%);
border-radius: 14px;
box-shadow:
  inset 0 1px 0 rgba(255,255,255,0.06),
  inset 0 0 0 0.5px rgba(255,255,255,0.06),
  0 0 0 0.5px rgba(232,181,58,0.12),
  0 1px 24px rgba(232,181,58,0.04);
```

**Top keyline glow** — appears on featured panels, an absolute-positioned 1px line at the top edge, 10–15% inset from sides:
```css
background: linear-gradient(90deg,
  rgba(232,181,58,0) 0%,
  rgba(232,181,58,0.30) 50%,
  rgba(232,181,58,0) 100%
);
```
On non-featured panels, replace amber with `rgba(255,255,255,0.15)` for a neutral white keyline.

### Spacing
- Page padding: `22px 20px`
- Panel internal padding: `14–18px`
- Card-to-card vertical gap: `10–12px`
- Card-to-section vertical gap: `22px`
- Grid gaps: `5–14px` depending on density

### Corner radii
- Large panels: `14px`
- Medium cards: `12px`
- Small inset / sub-cards: `9–11px`
- Pills and buttons: `6–8px`
- Full-pill / signal badges: `999px`

### Shadows
The system uses **inset shadows for depth** rather than drop shadows for elevation. The drop shadow is reserved for the bezel itself; everything inside relies on inset highlights + faint outer rim glows in amber or teal.

The one exception: the slip bar populated state adds a small drop shadow + amber glow to lift it off the bottom nav.

### Animation
- Easings: `cubic-bezier(0.22, 1, 0.36, 1)` (sharp out) for most enter motion. Linear or `ease-in-out` for pulses.
- Durations: 0.15–0.20s for hovers/clicks; 0.28s for sheet slides; 0.6–1.1s for chart bar growth.
- Tug-of-war bars grow from 0 with staggered 80ms delays per row, then pulse at 3.5s intervals.
- Number changes fade-up (0.4s, 8px translateY).
- No bounces. No springs. No spinners (use dot-pulse loaders).

### Hover states
- Cards: subtle background lift `rgba(255,255,255,0.025)` (no transform)
- Tap rows: `:active { opacity: 0.7 }`
- Add-to-slip pills on hover surface a small `+` indicator on the right edge

### Borders
- Always 0.5px (sub-pixel hairline) — 1px feels heavy in this aesthetic
- `rgba(255,255,255,0.06)` for default; tighten to 0.10 for emphasis

### Transparency & blur
- All glass panels rely on inset shadows over a slightly translucent gradient — but they sit on opaque dark backgrounds, so true backdrop-blur is rare
- `backdrop-filter: blur()` is used only for:
  - Bottom nav (blur(18px) saturate(150%))
  - Slip bar populated (blur(20px) saturate(150%))
  - Modal backdrops (blur(6px))
  - Slip sheet header (blur(20px))

### Layout rules
- Fixed bezel at 402×874 (iPhone 15 Pro proportions)
- Bottom nav is always pinned to bottom (z-index 90)
- Slip bar always pinned 78px from bottom (z-index 85), above the nav
- Builder detail action bar pinned 134px from bottom (z-index 70), above the slip bar
- Status bar 54px from top (z-index 80) — pointer-events: none so it doesn't intercept
- Content scrolls inside `.tc-app` (overflow-y: auto)

### Imagery
This system uses **zero photography or illustration**. The only "imagery" is:
- Distinct team-kit SVGs per club (solid, vertical halves, vertical stripes, horizontal band patterns with real club colour combinations)
- A subtle radial-bar decoration in the hero carousel
- Concentric ring SVGs as background motifs in hero panels

For any future imagery needs, prefer subtle, low-saturation, slightly cool-warm-balanced photography matching the page-background tone. Avoid stock photos of players, balls, stadiums — they break the calm analytical aesthetic.

---

## Iconography

The system uses a small **bespoke stroke-icon set** in `components/atoms.jsx`. Every icon is a 1.5-stroke `<svg>` at 24×24 viewBox, monochrome with `currentColor`.

**Available glyphs**: chevron-left/right/up/down, bookmark, search, bell, home, calendar, profile, builders, filter, arrow-left/right, flag, sparkles, target, card, arrows-h, bars, check, info, plus, x, x-circle, more (3-dots), close, layers, copy, duplicate, trash, check-circle, share, corner.

**Sizing**: 12–22px depending on context. 13–15px is the workhorse.

**Brand-coloured icons**:
- Amber accent (`var(--amber-bright)`) for primary actions, links, active states
- Teal accent (`var(--teal-bright)`) for success, completed, hit
- Red (`#F09595`) for loss, missed
- Muted (`var(--t-mut)`) for default neutral

**No emoji**, no PNG icons, no icon-font dependency. If a glyph isn't in `atoms.jsx`, add it there — don't reach for an external library.

**Logo**: the "COUNT" wordmark — a clean white/cream sans-serif with a soft amber halo, designed for dark surfaces. Stored at `assets/count-logo.png` (2576×1010, transparent PNG). Header usage sits around 39–42px tall; never pair it with the literal text "The Count" — the wordmark already says it.

---

## Component vocabulary

Detailed in `preview/` cards. The reusable primitives in priority order:

1. **Safe @ pill** — the most important pattern in the product. Three tiers (teal 5/5, amber 4/5, muted ≤3/5). Threshold value above, hit-rate ratio below. Tap-to-add affordance.
2. **Signal badge** — fixture quality score (0–100). Amber ≥85, teal 65–84, muted <65.
3. **Form pills** — W/D/L 14×14 squares with W in amber-gradient, D neutral, L dark.
4. **Score pills** — scoreline results with venue suffix (W/D/L variants).
5. **Status pills** — Pending (muted), Won (teal), Lost (red).
6. **Glass dropdown / selector** — window selector pattern, amber indicator dot when filter active.
7. **Segmented control** — date strip, filter tabs, AI leg count. Teal-active or amber-active variants.
8. **Glowing tab underline** — active fixture tab. Centre-glow gradient + box-shadow.
9. **Tug-of-war chart** — signature signature chart. 11-column grid, 5 stats fixed-order (CORNERS, CARDS, SHOTS, SOT, TACKLES). Teal bars for L10+, amber for L5+.
10. **Bottom nav** — 5 items. Active gets amber + 10px text-shadow glow.
11. **Slip bar** — sticky above bottom nav. Empty muted, populated amber.
12. **Charts** — line (win rate over time), horizontal bar (by leg type/league), vertical bar (by risk tier).

---

Built by the Crunch Creative team for The Count V2.
