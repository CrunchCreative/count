---
name: count-design
description: Use this skill when implementing, modifying, or generating UI for the Count app. The Count is a football betting research and pattern discovery platform with a calm, dark, analytical aesthetic. Contains the full visual foundation (colours, type, glass-panel system), reusable component vocabulary (Safe @ pills, signal badges, tug-of-war chart, slip system, builders, charts), copy rules around responsible gambling vocabulary, and a complete component + screen reference. Trigger this skill for any visual work — building a new screen, adding a component, writing UI copy, choosing colours, or reviewing existing UI for design-system conformance.
user-invocable: true
---

# Count — Design System

The single source of truth for visual design lives at:
docs/design-source/the-count-v2/project/

**Before doing any visual work, read these three files in order:**

1. `docs/DESIGN.md` — repo-level pointer with the non-negotiable rules surfaced
2. `docs/design-source/the-count-v2/project/README.md` — full design system documentation
3. `docs/design-source/the-count-v2/project/styles.css` — the production reference for every component class

Then explore as needed:

- `docs/design-source/the-count-v2/project/colors_and_type.css` — canonical design token CSS variables
- `docs/design-source/the-count-v2/project/components/` — JSX implementations of every reusable primitive (atoms, kit, charts, slip, tug-of-war)
- `docs/design-source/the-count-v2/project/screens/` — JSX implementations of every assembled screen (dashboard, fixtures-list, fixture, builders, builder-result)
- `docs/design-source/the-count-v2/project/data.js` + `data-builders.js` — canonical shape for fixture, team, and builder objects
- `docs/design-source/the-count-v2/project/preview/` — small standalone HTML cards demonstrating each token + component

## How the design source relates to this codebase

The design source is an HTML/CSS/JS prototype that simulated a 402×874 px (iPhone 15 Pro) viewport with a fixed bezel. This codebase is the **real** React Native app — actual device chrome replaces the bezel. Component dimensions, glass recipes, layout rules, and copy port directly.

Translation rules from source to this codebase:

- CSS variables in `colors_and_type.css` → typed tokens in `packages/tokens`
- `styles.css` classes → NativeWind utility classes derived from those tokens
- JSX components in `components/` → React Native components in `packages/ui` (typed, using View/Text/Pressable primitives)
- JSX screens in `screens/` → Expo Router screens in `apps/mobile/app/`
- Data shapes in `data.js` and `data-builders.js` → TypeScript types in `packages/types`, mock data in `apps/mobile/src/mock/`

## Non-negotiables

- **Vocabulary rules around gambling**: never use "guaranteed", "lock", "easy money", "banker", "sure thing", "can't lose". Always frame as historical tendency, not future prediction. Allowed: trend, alignment, consistency, hit rate, floor, threshold, pattern, signal.
- **No emoji**. Use SVG icons or semantic colour instead.
- **Two type weights only**: 400 regular and 500 medium. Never bolder.
- **Amber dominates**, teal is success/secondary, red is loss only. No new accent colours.
- **Glass panels** are the surface vocabulary. Never use a solid-fill card.
- **All hairlines are 0.5px**. Never 1px+ borders.
- **Sentence case** everywhere except UPPERCASE meta labels (with 0.4px letter-spacing).
- **Numbers in mono** (JetBrains Mono) when surfaced as data, even inside sentences.

## What to do when invoked

If the user asks for new UI work or modifications to existing UI:

1. Read `docs/DESIGN.md` and the three files above.
2. Identify which existing primitive or screen the work draws on, and stay faithful to it.
3. Use NativeWind classes that map to the design tokens (defined in `packages/tokens`).
4. Output production React Native code targeting Expo SDK 54 + RN 0.81. No HTML/CSS prototypes — this is a real app.
5. Run through the non-negotiables as a checklist before finalising.

If the user asks an ambiguous question, ask before implementing — it is much cheaper to clarify scope up front than to build the wrong thing.