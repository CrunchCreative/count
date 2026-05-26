# Count — Design

## Source of truth

The complete design system lives at:
docs/design-source/the-count-v2/project/
That folder is the **canonical reference** for visual design, component vocabulary, and copy. When implementing any UI work, read it directly. This document is a pointer with the load-bearing constraints surfaced — it is not a substitute.

Key files in the source:

- `README.md` — full design system documentation (read top to bottom before implementing anything visual)
- `colors_and_type.css` — design tokens as CSS variables
- `styles.css` — full live stylesheet (the production reference for every component class)
- `components/` — JSX implementations of every reusable primitive
- `screens/` — JSX implementations of every assembled screen
- `data.js` + `data-builders.js` — canonical shape for fixture, team, and builder objects
- `preview/` — small standalone HTML cards demonstrating each token + component

## Non-negotiables

These rules are quoted directly from the design system and apply to every piece of UI and copy in the app.

### Vocabulary rules (responsible gambling)

**Allowed**: trend, alignment, consistency, historical tendency, pattern, signal, hit rate, floor, threshold.

**Forbidden**: guaranteed, lock, easy money, banker, sure thing, can't lose. **Never use certainty language even when data is 5/5.** Always frame as historical tendency, not future prediction.

Good: "Floor of 8 corners across last 5", "Holds over the L20 window", "Cards-above-average referee tendency".
Bad: "City definitely gets 8 corners", "This is a lock", "Easy win".

### Tone

- Calm, factual, second-person but rare. Mostly declarative third-person about the data.
- Conversational without being chatty. AI brief reads like a junior analyst summarising a report — not a salesperson.
- Never excited. Never apologetic. Never marketing-coded.

### Type weights

**Two weights only**: 400 regular and 500 medium. Never bolder.

### Casing

- **Sentence case** for everything except meta-labels and section labels (UPPERCASE WITH 0.4px LETTER-SPACING).
- Numbers always in mono font (JetBrains Mono), even inside sentences when surfaced as data.

### No emoji

The brand does not use emoji. Use semantic colour or SVG iconography instead. The single permitted exceptions are tick / cross / chevron / + glyphs delivered as SVG icons.

### Colour roles

- **Amber dominates** (primary stats, primary CTAs, active states): `#E8B53A` bright · `#F1C455` light · `#BA7517` mid · `#854F0B` deep
- **Teal** is success/secondary (5/5 bulletproof patterns, active tabs, positive signals): `#5DCAA5` bright · `#1D9E75` mid · `#0F6E56` deep
- **Red** is loss only — paired sparingly with teal counterparts.
- No new accent colours.

### Surfaces

**Glass panels are the surface vocabulary. Never use a solid-fill card.** Three recipes (standard, featured/elevated, top keyline glow) defined in the source `README.md`.

### Borders

**All hairlines are 0.5px.** Never 1px+ borders. Default: `rgba(255,255,255,0.06)`.

### Imagery

Zero photography or illustration. The only "imagery" is team-kit SVGs, radial-bar decorations, and concentric ring SVGs as background motifs. No stock photos.

## Implementation notes for this codebase

The design source was built as an HTML/CSS/JS prototype simulating a 402×874 px (iPhone 15 Pro) viewport with a fixed bezel. This codebase is the **real** React Native app — no bezel needed, actual device chrome replaces it. The component dimensions, glass recipes, layout rules, and copy port directly.

Translation rules:

- CSS variables in `colors_and_type.css` → typed tokens in `packages/tokens`.
- `styles.css` classes → NativeWind utility classes derived from the same tokens.
- JSX components in `components/` → React Native components in `packages/ui` (typed, using View/Text/Pressable primitives).
- JSX screens in `screens/` → Expo Router screens in `apps/mobile/app/`.
- Data shapes in `data.js` and `data-builders.js` → TypeScript types in `packages/types`, mock data in `apps/mobile/src/mock/`.
