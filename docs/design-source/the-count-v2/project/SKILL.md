---
name: the-count-design
description: Use this skill to generate well-branded interfaces and assets for The Count — a football betting research and pattern discovery platform with a calm, dark, analytical aesthetic. Contains the full visual foundation (colours, type, glass-panel system), reusable component vocabulary (Safe @ pills, signal badges, tug-of-war chart, slip system), and a working mobile UI kit. Use this for prototypes, mocks, slide decks, or production code that needs to feel native to The Count.
user-invocable: true
---

# The Count — Design System

Read `README.md` for the full context, then explore the other files:

- **`colors_and_type.css`** — canonical design token CSS variables. Drop this into any new project to inherit the visual language.
- **`styles.css`** — full live stylesheet, the production reference for every component class.
- **`components/`** + **`screens/`** — JSX implementations of every component and screen. Plain Babel-transpiled React, no module bundler required.
- **`data.js`** + **`data-builders.js`** — fixture + team + builder seed data. Use these as the canonical shape for any new fixture / builder objects.
- **`ui_kits/mobile/`** — open `ui_kits/mobile/index.html` to see the full app working. It's also a clean starting point you can copy into a new project.
- **`preview/`** — small standalone HTML cards demonstrating each token + component. Useful as visual reference when explaining the system.

## When the user invokes this skill

If they ask for visual artifacts (slides, mocks, throwaway prototypes), copy assets out and create static HTML files for them to view.

If they're working on production code, read the design rules in `README.md` and the tokens in `colors_and_type.css` to become an expert in designing with this brand. You can copy `components/`, `screens/`, and `styles.css` into their project as a starting point.

If they invoke the skill with no guidance, ask what they want to build, then act as an expert designer who outputs either HTML artifacts or production code depending on the need.

## Non-negotiables

- **Vocabulary rules around gambling**: never use "guaranteed", "lock", "easy money", "banker", "sure thing", "can't lose". Always frame as historical tendency, not future prediction. Allowed: trend, alignment, consistency, hit rate, floor, threshold, pattern, signal.
- **No emoji**. Use SVG icons or semantic colour instead.
- **Two type weights only**: 400 regular and 500 medium. Never bolder.
- **Amber dominates**, teal is success/secondary, red is loss only. No new accent colours.
- **Glass panels** are the surface vocabulary. Never use a solid-fill card.
- **All hairlines are 0.5px**. Never 1px+ borders.
