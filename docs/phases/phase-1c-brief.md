# Phase 1C — Design tokens, atomic primitives, and the glass layer

> **For Claude Code.** Read this top to bottom before doing anything. Then read the files listed in [Required reading](#required-reading). If anything is ambiguous, ask the user before starting — do not begin on uncertain ground. Once you start, complete every acceptance criterion in [Acceptance](#acceptance) before stopping.

---

## What you are building

In order:

1. **`@count/tokens`** — typed TypeScript design tokens from `docs/design-source/the-count-v2/project/colors_and_type.css`, plus a CommonJS sibling that Tailwind reads at config time.
2. **Tailwind theme** in `apps/mobile/tailwind.config.js` — extend `theme.extend` with colours, spacing, radii, fontSize, fontFamily from `@count/tokens`.
3. **Glass surface layer** in `@count/ui` — `GlassPanel` (three variants: standard, elevated, hero), `RadialBackdrop` (the signature ambient wash), `KeylineGlow` (the 1px top edge gradient used on featured panels).
4. **Atomic primitives** in `@count/ui` — `SafePill`, `SignalBadge`, `SignalMini`, `FormPill`, `ScorePill`, and the `Icon` glyph component with all 32 glyphs from the source.
5. **Demo screen** at `apps/mobile/app/(tabs)/index.tsx` rendering every primitive and every glass variant in every state, so we can visually verify the work end to end.

No other screens. No `kit.jsx` team kits. No charts. No slip system. No bottom nav. No fixture row composite. Those come in later phases.

## Why this scope

The design source has a clear hierarchy: tokens → glass surfaces → atomic primitives → composite components → screens. Tasks 1–4 above are the bottom three layers — the entire **vocabulary** every screen in Count is built from. Once these are correct, every subsequent screen task is layout work over an established palette of primitives, not invention. Getting this layer wrong cascades into every screen that follows; getting it right means every following task is faster and lower-risk.

## Required reading

Before writing any code, read these in order:

1. `docs/DESIGN.md` — non-negotiable design rules
2. `docs/design-source/the-count-v2/project/README.md` — full design system documentation
3. `docs/design-source/the-count-v2/project/colors_and_type.css` — canonical token CSS variables
4. `docs/design-source/the-count-v2/project/styles.css` — read lines 55–215 (app shell + glass) and 215–340 (atomic pills)
5. `docs/design-source/the-count-v2/project/components/atoms.jsx` — the entire file, the JSX you are porting

Also read the existing scaffold:

- `apps/mobile/tailwind.config.js`, `babel.config.js`, `metro.config.js`
- `packages/tokens/src/index.ts` (empty)
- `packages/ui/src/index.ts` (empty)
- `packages/ui/package.json` (declares `@count/tokens` as a dependency)

## Stack and locked versions

- Expo SDK 54.0.33, React Native 0.81.5, React 19.1.0, TypeScript 5.9.x, strict mode
- NativeWind 4.2.4, Tailwind CSS 3.4.19 — **do not upgrade either**
- Babel preset is already `babel-preset-expo` with `jsxImportSource: 'nativewind'` + `nativewind/babel`
- Metro is already monorepo-aware and watches `packages/*`
- Gradients: `expo-linear-gradient`. Install: `cd apps/mobile && npx expo install expo-linear-gradient` if not present.
- SVG: `react-native-svg`. Install: `cd apps/mobile && npx expo install react-native-svg`.

After installs, run `pnpm install` from the repo root to update the lockfile.

Constraints:

- **Two type weights only**: 400 regular and 500 medium. Never 600+ anywhere.
- **All hairline borders are 0.5px.** Use `StyleSheet.hairlineWidth` — never literal `0.5`.
- **No emojis** anywhere — code, comments, or rendered text.

---

## Task 1: Build `@count/tokens`

### 1.1 Replace `packages/tokens/src/index.ts`

Values come byte-for-byte from `colors_and_type.css`. Required named exports:

```ts
export const colors = {
  bg: {
    page: '#08090B',
    hero: '#0B1A14',
    inset: 'rgba(0,0,0,0.20)',
  },
  amber: {
    bright: '#E8B53A',
    light:  '#F1C455',
    mid:    '#BA7517',
    deep:   '#854F0B',
  },
  teal: {
    bright: '#5DCAA5',
    mid:    '#1D9E75',
    deep:   '#0F6E56',
  },
  loss: {
    text:   '#F09595',
    border: 'rgba(180,55,55,0.35)',
  },
  text: {
    primary:   '#F2F0E8',
    secondary: '#E8E6DF',
    muted:     '#9A9890',
    hint:      '#7A7870',
    faint:     '#5A5852',
  },
  border: {
    default:  'rgba(255,255,255,0.06)',
    strong:   'rgba(255,255,255,0.10)',
    faintest: 'rgba(255,255,255,0.04)',
  },
  win: {
    text:           '#C0DD97',
    border:         'rgba(99,153,34,0.35)',
    gradientTop:    'rgba(63,109,33,0.5)',
    gradientBottom: 'rgba(63,109,33,0.25)',
  },
  /** Used by FormPill 'W' variant — exact source value */
  amberOnLightText: '#1A1408',
} as const;

export const glass = {
  standard: { top: 'rgba(255,255,255,0.025)', bottom: 'rgba(255,255,255,0.005)' },
  elevated: { top: 'rgba(255,255,255,0.035)', bottom: 'rgba(255,255,255,0.008)' },
  hero:     { top: 'rgba(255,255,255,0.025)', bottom: 'rgba(255,255,255,0.005)' }, // layered over colors.bg.hero
} as const;

export const typography = {
  fontSans: '"Söhne", "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  size: {
    h1: 27, h2: 22, h3: 14,
    bodyEm: 13, body: 13, caption: 11, micro: 10,
  },
  weight: {
    regular: '400' as const,
    medium:  '500' as const,
  },
  letterSpacing: {
    h1: -0.4, h2: -0.2, h3: -0.1,
    metaMicro: 0.4, sectionLabel: 0.6,
  },
  lineHeight: {
    h1: 1.15, h2: 1.2, body: 1.55,
  },
} as const;

export const spacing = {
  pageX: 20, pageY: 22, panel: 16,
  cardGap: 10, section: 22,
  gridTight: 5, gridLoose: 14,
} as const;

export const radii = {
  panel: 14, card: 12, inset: 10, pill: 7, full: 999,
} as const;

export const motion = {
  easeOutSharp: 'cubic-bezier(0.22, 1, 0.36, 1)',
  duration: { hover: 180, press: 150, sheet: 280, chart: 900 },
} as const;

/**
 * Radial backdrop wash — two stacked layers.
 * In RN, rendered via expo-linear-gradient as a close approximation
 * (radial isn't supported by expo-linear-gradient; angled linear with
 * carefully placed stops is the V1 approach).
 */
export const backdrop = {
  amberHalo: {
    stops: [
      { offset: 0,    color: 'rgba(232,181,58,0.14)' },
      { offset: 0.28, color: 'rgba(232,181,58,0.06)' },
      { offset: 0.55, color: 'rgba(29,110,86,0.04)'  },
      { offset: 0.75, color: 'rgba(8,9,11,0)'        },
    ],
  },
  tealPool: {
    stops: [
      { offset: 0,    color: 'rgba(29,110,86,0.10)' },
      { offset: 0.65, color: 'rgba(8,9,11,0)'      },
    ],
  },
} as const;

/**
 * Outer-glow recipes used on featured glass and tier-coloured pills.
 * iOS: applied via shadowColor + shadowOpacity + shadowRadius.
 * Android: rendered as a sibling LinearGradient underlay (greyscale-only elevation
 *          can't tint, so we synthesise the halo).
 */
export const glows = {
  amber: {
    /** Featured glass — CSS: 0 1px 24px rgba(232,181,58,0.04) */
    elev:     { color: '#E8B53A', radius: 24, opacity: 0.04 },
    /** SafePill teal/amber + SignalBadge high — CSS: 0 0 8–10px rgba(...,0.10–0.12) */
    pillSoft: { color: '#E8B53A', radius: 10, opacity: 0.12 },
    /** FormPill W gradient — CSS: 0 0 6px rgba(232,181,58,0.40) */
    formW:    { color: '#E8B53A', radius: 6,  opacity: 0.40 },
  },
  teal: {
    pillSoft: { color: '#5DCAA5', radius: 8,  opacity: 0.10 },
    hero:     { color: '#0F6E56', radius: 30, opacity: 0.10 },
  },
} as const;

export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Radii = typeof radii;
export type Typography = typeof typography;
```

### 1.2 Mirror as CommonJS

Tailwind's config runs in Node before any TS compiler — it can't `require()` a `.ts` file. Create `packages/tokens/tailwind.js` (plain JS, CommonJS) that mirrors the same values.

Choose hand-mirroring over a build step. Values are stable; duplication is small. Add at the top of `tailwind.js`:

```js
// Mirror of src/index.ts for Tailwind config consumption.
// Keep values in sync with src/index.ts — they are the same tokens, two formats.
```

Update `packages/tokens/package.json` to expose `./tailwind` as a subpath export:

```json
"exports": {
  ".": "./src/index.ts",
  "./tailwind": "./tailwind.js"
}
```

### 1.3 Update `packages/tokens/README.md`

Add a section explaining the dual exports:

> **Two exports, same values.** `@count/tokens` exports typed TS constants for runtime code. `@count/tokens/tailwind` exports the same values as CommonJS for `tailwind.config.js`, which runs in Node before any TS compiler. When you change a token, update both files. They are kept in sync by hand because duplicating a small constant tree is cheaper than introducing a build step.

---

## Task 2: Wire Tailwind theme

Update `apps/mobile/tailwind.config.js`:

```js
const tokens = require('@count/tokens/tailwind');

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './hooks/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'bg-page':       tokens.colors.bg.page,
        'bg-hero':       tokens.colors.bg.hero,
        'bg-inset':      tokens.colors.bg.inset,
        'amber-bright':  tokens.colors.amber.bright,
        'amber-light':   tokens.colors.amber.light,
        'amber-mid':     tokens.colors.amber.mid,
        'amber-deep':    tokens.colors.amber.deep,
        'teal-bright':   tokens.colors.teal.bright,
        'teal-mid':      tokens.colors.teal.mid,
        'teal-deep':     tokens.colors.teal.deep,
        'loss':          tokens.colors.loss.text,
        'loss-border':   tokens.colors.loss.border,
        'text-pri':      tokens.colors.text.primary,
        'text-sec':      tokens.colors.text.secondary,
        'text-mut':      tokens.colors.text.muted,
        'text-hint':     tokens.colors.text.hint,
        'text-faint':    tokens.colors.text.faint,
        'border-def':    tokens.colors.border.default,
        'border-strong': tokens.colors.border.strong,
        'border-faint':  tokens.colors.border.faintest,
        'win-text':      tokens.colors.win.text,
      },
      spacing: {
        'page-x':     `${tokens.spacing.pageX}px`,
        'page-y':     `${tokens.spacing.pageY}px`,
        'panel':      `${tokens.spacing.panel}px`,
        'card-gap':   `${tokens.spacing.cardGap}px`,
        'section':    `${tokens.spacing.section}px`,
        'grid-tight': `${tokens.spacing.gridTight}px`,
        'grid-loose': `${tokens.spacing.gridLoose}px`,
      },
      borderRadius: {
        'panel': `${tokens.radii.panel}px`,
        'card':  `${tokens.radii.card}px`,
        'inset': `${tokens.radii.inset}px`,
        'pill':  `${tokens.radii.pill}px`,
        'full':  `${tokens.radii.full}px`,
      },
      fontSize: {
        'h1':       [`${tokens.typography.size.h1}px`,      { lineHeight: '1.15', letterSpacing: '-0.4px' }],
        'h2':       [`${tokens.typography.size.h2}px`,      { lineHeight: '1.2',  letterSpacing: '-0.2px' }],
        'h3':       [`${tokens.typography.size.h3}px`,      { lineHeight: '1.3',  letterSpacing: '-0.1px' }],
        'body-em':  [`${tokens.typography.size.bodyEm}px`,  { lineHeight: '1.55' }],
        'body':     [`${tokens.typography.size.body}px`,    { lineHeight: '1.55' }],
        'caption':  [`${tokens.typography.size.caption}px`, { lineHeight: '1.4' }],
        'micro':    [`${tokens.typography.size.micro}px`,   { lineHeight: '1.2', letterSpacing: '0.4px' }],
      },
      fontFamily: {
        sans: tokens.typography.fontSans.split(',').map(s => s.trim()),
        mono: tokens.typography.fontMono.split(',').map(s => s.trim()),
      },
    },
  },
  plugins: [],
};
```

After this, classes like `bg-bg-page`, `text-amber-bright`, `rounded-card`, `p-panel`, `text-h2` resolve correctly.

---

## Task 3: Build the glass surface layer in `@count/ui`

This is the hardest part of the brief. React Native does not support CSS inset box-shadow; Android does not support coloured outer shadows. The glass look is reconstructed from primitives.

### 3.1 Shared glow helper

Create `packages/ui/src/utils/glow.ts`. Single helper consumed by `GlassPanel`, `SafePill`, `SignalBadge`, `FormPill`, anywhere we need a tinted outer halo.

```ts
import { Platform, type ViewStyle } from 'react-native';

export interface GlowSpec {
  color: string;      // hex
  radius: number;     // px
  opacity: number;    // 0–1
}

/**
 * Produce platform-appropriate outer-glow styling.
 *
 * iOS — uses native shadowColor / shadowOpacity / shadowRadius.
 * Android — returns props for an underlay LinearGradient sibling because Android's
 *           elevation API can't tint shadows. Caller renders the underlay manually.
 */
export function glowStyle(glow: GlowSpec): ViewStyle {
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: glow.color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: glow.opacity,
      shadowRadius: glow.radius,
    },
    android: {
      // shadow handled by sibling underlay rendered by caller
    },
    default: {},
  }) ?? {};
}

/** True when caller should render the Android underlay LinearGradient. */
export const shouldRenderAndroidGlow = Platform.OS === 'android';
```

Pattern in component code:

```tsx
import { glowStyle, shouldRenderAndroidGlow } from '../utils/glow';
import { LinearGradient } from 'expo-linear-gradient';
import { glows } from '@count/tokens';

// inside component:
<View style={[styles.outer, glowStyle(glows.amber.pillSoft)]}>
  {shouldRenderAndroidGlow && (
    <LinearGradient
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: -10, left: -10, right: -10, bottom: -10,
        opacity: glows.amber.pillSoft.opacity,
        borderRadius: 999,
      }}
      colors={[`${glows.amber.pillSoft.color}30`, `${glows.amber.pillSoft.color}00`]}
      start={{ x: 0.5, y: 0.5 }}
      end={{ x: 1, y: 1 }}
    />
  )}
  {/* content */}
</View>
```

### 3.2 `GlassPanel`

`packages/ui/src/components/GlassPanel.tsx`

```ts
type GlassVariant = 'standard' | 'elevated' | 'hero';

interface GlassPanelProps {
  variant?: GlassVariant;              // default 'standard'
  /** Render the top keyline gradient stripe.
   *  Defaults: standard → false, elevated → true, hero → true */
  keyline?: boolean;
  /** Keyline tone — defaults match the source. */
  keylineTone?: 'amber' | 'teal' | 'neutral';
  className?: string;
  style?: ViewStyle;
  children?: ReactNode;
}
```

**Composition (all variants share this skeleton):**

```
<View style={[outerStyle, platformGlowStyle]}>
  {shouldRenderAndroidGlow && <LinearGradient underlay />}
  {/* Base background — solid View for hero only; transparent for std/elev */}
  {variant === 'hero' && <View bg={colors.bg.hero} fillAbsolute />}
  {/* Glass gradient layer */}
  <LinearGradient
    colors={[glass[variant].top, glass[variant].bottom]}
    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
    style={fillAbsolute}
  />
  {/* Inset highlight — 1px tall View at the top, full width */}
  <View style={topHighlightStyle} />
  {/* Keyline glow (if enabled) */}
  {keyline && <KeylineGlow tone={keylineTone ?? defaultToneFor(variant)} />}
  {children}
</View>
```

**Per-variant values:**

| Variant   | Border colour                  | Inset highlight colour       | Outer glow                 | Keyline default | Keyline default tone |
|-----------|--------------------------------|------------------------------|----------------------------|-----------------|----------------------|
| standard  | `colors.border.default`        | `rgba(255,255,255,0.05)`     | none                       | false           | neutral              |
| elevated  | `rgba(232,181,58,0.12)`        | `rgba(255,255,255,0.06)`     | `glows.amber.elev`         | true            | amber                |
| hero      | `rgba(93,202,165,0.10)`        | `rgba(93,202,165,0.10)`      | `glows.teal.hero`          | true            | teal                 |

All variants share: `borderRadius: 14`, `borderWidth: StyleSheet.hairlineWidth`, `overflow: 'hidden'`.

Render order matters — gradient and inset highlight must be inside `overflow: 'hidden'`; the keyline glow renders OUTSIDE (positioned at `top: -0.5`) so it appears above the rounded corner. That means the keyline lives in a separate wrapper or uses `position: 'absolute'` with `overflow` reset. Simplest approach: wrap the whole thing in a `View` with NO overflow clipping, and put the rounded-corner clipping on an inner `View`. Choose whichever produces cleaner code.

### 3.3 `RadialBackdrop`

`packages/ui/src/components/RadialBackdrop.tsx`

Fixed ambient wash that sits behind all content on every screen. Renders two stacked `LinearGradient` layers approximating the source's two radial gradients.

```tsx
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { backdrop } from '@count/tokens';

export function RadialBackdrop() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={backdrop.amberHalo.stops.map(s => s.color)}
        locations={backdrop.amberHalo.stops.map(s => s.offset)}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.75 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={backdrop.tealPool.stops.map(s => s.color)}
        locations={backdrop.tealPool.stops.map(s => s.offset)}
        start={{ x: 1, y: 1 }}
        end={{ x: 0.4, y: 0.4 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
```

Add this honest comment block above the component:

```tsx
// The CSS source uses two radial gradients. expo-linear-gradient is linear only.
// A top-anchored vertical linear gradient is a close visual approximation for the
// amber halo; an angled corner-to-centre gradient approximates the teal pool.
// If the approximation is unsatisfactory after review, the fallback is to ship two
// precomputed PNGs generated from the CSS gradients — defer that to a later phase.
```

No props. Parent renders the page background colour.

### 3.4 `KeylineGlow`

`packages/ui/src/components/KeylineGlow.tsx`

The 1px-tall gradient stripe at the top edge of `glass.elev` and `glass.hero`.

```ts
interface KeylineGlowProps {
  tone: 'amber' | 'teal' | 'neutral';
  /** Inset from sides as a fraction (0–0.5). Source uses 0.12 for elev, 0.15 for neutral. */
  inset?: number;
}
```

```tsx
const palettes = {
  amber:   ['rgba(232,181,58,0)',  'rgba(232,181,58,0.30)',  'rgba(232,181,58,0)' ],
  teal:    ['rgba(93,202,165,0)',  'rgba(93,202,165,0.30)',  'rgba(93,202,165,0)' ],
  neutral: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0)'],
};

const sideInsetPct = (inset ?? (tone === 'neutral' ? 0.15 : 0.12)) * 100;

return (
  <View
    pointerEvents="none"
    style={{
      position: 'absolute',
      top: -0.5,
      left: `${sideInsetPct}%`,
      right: `${sideInsetPct}%`,
      height: 1,
    }}
  >
    <LinearGradient
      colors={palettes[tone]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={StyleSheet.absoluteFill}
    />
  </View>
);
```

---

## Task 4: Atomic primitives in `@count/ui`

Each component in its own file under `packages/ui/src/components/`. Stateless and side-effect-free — no `useState`, no `useEffect`, no context, no animation.

### 4.1 `SafePill`

Source: `atoms.jsx` lines 3–45, CSS: `styles.css` lines 219–248.

```ts
type SafePillTier = 'teal' | 'amber' | 'muted';
type SafePillSize = 'std' | 'mini';

interface SafePillProps {
  threshold: string | number;
  hits: number;
  total?: number;            // default 5
  tier?: SafePillTier;       // derived from hits/total if omitted
  size?: SafePillSize;       // default 'std'
  onPress?: () => void;
  addable?: boolean;         // visual only in this phase
}
```

**Tier derivation (when `tier` is omitted):**
- `hits === total` → `'teal'`
- `hits >= total - 1` → `'amber'`
- else → `'muted'`

**Layout:**
- `std`: column of two `<Text>` children — `threshold` on top (size 12, weight 500, sans), `${hits}/${total}` below (size 9, weight 400, opacity 0.85). minWidth 36, padding `4px 8px`, border-radius 6.
- `mini`: single `<Text>` (size 10, weight 500), minWidth 28, padding `2px 5px`, border-radius 4. Bottom line hidden.

**Tier styling:**

| Tier  | Background                                                                | Border (hairline)         | Outer glow              | Text colour           |
|-------|---------------------------------------------------------------------------|---------------------------|-------------------------|-----------------------|
| teal  | LinearGradient `rgba(93,202,165,0.12)` → `rgba(93,202,165,0.04)`         | `rgba(93,202,165,0.25)`   | `glows.teal.pillSoft`   | `colors.teal.bright`  |
| amber | LinearGradient `rgba(232,181,58,0.10)` → `rgba(232,181,58,0.03)`         | `rgba(232,181,58,0.20)`   | `glows.amber.pillSoft`  | `colors.amber.bright` |
| muted | Flat `rgba(255,255,255,0.03)`                                             | `colors.border.default`   | none                    | `colors.text.hint`    |

Use `glowStyle()` from the helper. Apply glow only for teal and amber tiers.

**Press behaviour:** if `onPress` is provided, wrap content in `Pressable` and add `active:opacity-70` (NativeWind) or `({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })`. Otherwise render as `View`.

**`addable`:** when true, render a small `+` Icon (name `plus`, size 8, colour matching the tier text) at the right side of the inner content with opacity 0.6. No slip integration — that's a later phase. Purely visual affordance.

### 4.2 `SignalBadge` and `SignalMini`

Source: `atoms.jsx` lines 47–63, CSS: `styles.css` lines 253–281.

```ts
interface SignalBadgeProps { score: number; }
interface SignalMiniProps  { score: number; }
```

**Tier:** `score >= 85` → `high` (amber), `>= 65` → `mid` (teal), else `low` (muted).

**SignalBadge (full):** padding `3px 9px`, gap 4, border-radius 999, font mono, size 10, weight 500, letter-spacing 0.4, uppercase. Renders literal text `SIGNAL` then the score (two `<Text>` siblings).

**SignalMini:** padding `2px 7px`, font mono, size 10, weight 500, uppercase. Just the score.

**Variants (both, glows apply only to high/mid):**

| Tier | Background                                                            | Border                       | Glow                          | Text colour         |
|------|-----------------------------------------------------------------------|------------------------------|-------------------------------|---------------------|
| high | LinearGradient `rgba(232,181,58,0.18)` → `rgba(232,181,58,0.06)`     | `rgba(232,181,58,0.30)`      | `glows.amber.pillSoft`        | `colors.amber.bright` |
| mid  | LinearGradient `rgba(93,202,165,0.14)` → `rgba(93,202,165,0.04)`     | `rgba(93,202,165,0.25)`      | `glows.teal.pillSoft`         | `colors.teal.bright`  |
| low  | Flat `rgba(255,255,255,0.03)`                                         | `colors.border.default`      | none                          | `colors.text.muted`   |

### 4.3 `FormPill`

Source: `atoms.jsx` lines 66–68, CSS: `styles.css` lines 286–310.

```ts
type FormResult = 'W' | 'D' | 'L';
interface FormPillProps { result: FormResult; }
```

15×15 square, border-radius 3, font sans, size 9, weight 500, letter centred.

| Result | Background                                                               | Border                          | Glow                 | Text colour                |
|--------|--------------------------------------------------------------------------|---------------------------------|----------------------|----------------------------|
| W      | LinearGradient `colors.amber.bright` → `colors.amber.mid` (top→bottom)   | none                            | `glows.amber.formW`  | `colors.amberOnLightText`  |
| D      | Flat `rgba(255,255,255,0.06)`                                            | none                            | none                 | `colors.text.muted`        |
| L      | Flat `rgba(255,255,255,0.02)`                                            | `colors.border.faintest`        | none                 | `colors.text.faint`        |

### 4.4 `ScorePill`

Source: `atoms.jsx` lines 70–73, CSS: `styles.css` lines 315–342.

```ts
type ScoreOutcome = 'W' | 'D' | 'L';
interface ScorePillProps {
  result: string;       // e.g. "3-0"
  wdl: ScoreOutcome;
}
```

Padding `3px 5px`, border-radius 4, font mono, size 10, weight 500, letter-spacing 0.2.

| Outcome | Background                                                                            | Border                         | Text colour           |
|---------|---------------------------------------------------------------------------------------|--------------------------------|-----------------------|
| W       | LinearGradient `colors.win.gradientTop` → `colors.win.gradientBottom`                 | `colors.win.border`            | `colors.win.text`     |
| D       | Flat `rgba(255,255,255,0.04)`                                                          | `colors.border.strong`         | `colors.text.muted`   |
| L       | LinearGradient `rgba(122,34,34,0.5)` → `rgba(122,34,34,0.25)`                          | `colors.loss.border`           | `colors.loss.text`    |

No glow.

### 4.5 `Icon`

Source: `atoms.jsx` lines 76–151 (the entire `switch` statement).

```ts
type IconName =
  | 'chevron-left' | 'chevron-right' | 'chevron-up' | 'chevron-down'
  | 'bookmark' | 'search' | 'bell' | 'home' | 'calendar' | 'profile'
  | 'builders' | 'filter' | 'arrow-right' | 'arrow-left' | 'flag'
  | 'sparkles' | 'target' | 'card' | 'arrows-h' | 'bars' | 'check'
  | 'info' | 'plus' | 'corner' | 'x' | 'x-circle' | 'more' | 'close'
  | 'layers' | 'copy' | 'duplicate' | 'trash' | 'check-circle' | 'share';

interface IconProps {
  name: IconName;
  size?: number;       // default 16
  color?: string;      // default colors.text.primary (RN has no `currentColor`)
  strokeWidth?: number; // default 1.5
}
```

**Implementation:** use `react-native-svg`. Translate `<svg>` / `<polyline>` / `<path>` / `<line>` / `<circle>` / `<rect>` / `<polygon>` to `Svg` / `Polyline` / `Path` / `Line` / `Circle` / `Rect` / `Polygon` from `react-native-svg`. Other SVG attrs (`viewBox`, `stroke`, `strokeWidth`, `strokeLinecap`, `strokeLinejoin`, `fill="none"`) transfer 1:1.

Port every one of the 32 glyphs. Do not skip any.

### 4.6 Exports

`packages/ui/src/index.ts`:

```ts
// Glass surfaces
export { GlassPanel } from './components/GlassPanel';
export { RadialBackdrop } from './components/RadialBackdrop';
export { KeylineGlow } from './components/KeylineGlow';

// Atomic primitives
export { SafePill } from './components/SafePill';
export { SignalBadge } from './components/SignalBadge';
export { SignalMini } from './components/SignalMini';
export { FormPill } from './components/FormPill';
export { ScorePill } from './components/ScorePill';
export { Icon } from './components/Icon';

// Type re-exports
export type { GlassVariant, GlassPanelProps } from './components/GlassPanel';
export type { KeylineGlowProps } from './components/KeylineGlow';
export type { SafePillProps, SafePillTier, SafePillSize } from './components/SafePill';
export type { SignalBadgeProps } from './components/SignalBadge';
export type { SignalMiniProps } from './components/SignalMini';
export type { FormPillProps, FormResult } from './components/FormPill';
export type { ScorePillProps, ScoreOutcome } from './components/ScorePill';
export type { IconName, IconProps } from './components/Icon';
```

---

## Task 5: Demo screen

Replace `apps/mobile/app/(tabs)/index.tsx` with a single screen that renders every component in every state. This is the visual verification surface for the whole phase.

Principles:

- Page background `colors.bg.page`.
- First child: `<RadialBackdrop />` (renders the ambient wash).
- Use `ScrollView` so all sections fit.
- Page padding: `spacing.pageY` top/bottom, `spacing.pageX` sides.
- Section labels: uppercase, mono, size 10, letter-spacing 0.4, colour `colors.text.hint`. Use `text-micro text-text-hint` if those Tailwind classes resolve; otherwise inline style.
- Between sections: `spacing.section` (22px) vertical gap.

Sections in order:

```
COUNT — DESIGN PRIMITIVES

GLASS PANELS
  [GlassPanel variant='standard']  containing Text: "Standard glass panel"
  [GlassPanel variant='elevated']  containing Text: "Elevated glass panel (amber rim, glow, keyline)"
  [GlassPanel variant='hero']      containing Text: "Hero glass panel (deep teal-black, teal rim)"

SAFE PILLS
  Row 1: [teal 8.5 5/5] [amber 8 4/5] [muted 7.5 3/5]
  Row 2: [mini teal 8.5] [mini amber 8] [mini muted 7.5]
  Row 3: [teal 8.5 5/5 addable] [amber 8 4/5 addable]

SIGNAL BADGES
  Row 1: [SignalBadge score=92] [SignalBadge score=74] [SignalBadge score=58]
  Row 2: [SignalMini score=92] [SignalMini score=74] [SignalMini score=58]

FORM PILLS
  Row 1: [W][D][L][W][W][L][W]      (last 7 form)
  Row 2: [L][L][D][W][W]            (last 5 form)

SCORE PILLS
  Row: [3-0 W][1-1 D][0-2 L]

ICONS
  Grid 6 columns wide. Below each icon, the name in micro caption.
```

Don't worry about being beautiful — be **complete** (every variant rendered) and **legible** (everything labelled).

---

## Acceptance

Before stopping, verify all of:

1. `pnpm typecheck` passes from the repo root with zero errors. Add `"typecheck": "tsc --noEmit"` to every package's `package.json` if missing.
2. `pnpm dev` starts Metro cleanly — no NativeWind, Tailwind, gradient, or SVG import errors.
3. All `@count/ui` exports import from `@count/ui` in the demo screen (not relative paths).
4. Token values match `colors_and_type.css` byte-for-byte. No simplification.
5. Every NativeWind class used compiles — no `unknown-class` warnings in Metro output.
6. Glows are implemented for: `GlassPanel.elev`, `GlassPanel.hero`, `SafePill` teal/amber, `SignalBadge` high/mid, `FormPill` W. Both iOS (shadow*) and Android (underlay) paths present.
7. Hairline borders use `StyleSheet.hairlineWidth`, not `0.5`.
8. `react-native-svg` and `expo-linear-gradient` are installed in `apps/mobile/package.json`. The Icon component renders all 32 glyphs.
9. The demo screen renders every primitive variant and every glass variant. No section empty or missing.
10. No `console.log`, no emoji, no font weight 600+, no inline `borderWidth: 0.5`, no `useState`/`useEffect` in any component.
11. Components are stateless. Glass primitives may run longer than 150 lines due to platform branching; that's fine. Atomic primitives should land under 100 lines each.
12. Glow helper extracted to `packages/ui/src/utils/glow.ts` and reused. Not duplicated.

## Out of scope

- Slip integration / `useSlip` (`addable` is visual only)
- Team kit SVGs (`kit.jsx`)
- Charts (`charts.jsx`) — tug-of-war, line, bar
- Slip system (`slip.jsx`)
- Any screen beyond the demo
- Bottom nav
- Page chrome beyond the demo's section labels
- Animations / transitions
- Tests / Storybook
- Precomputed image assets for the radial backdrop (approximation is acceptable for V1)
- Custom font loading — Söhne and JetBrains Mono fall back to the system stack until a later phase

## Final step

When every acceptance criterion passes, write a summary at `docs/phases/phase-1c-summary.md` (create `docs/phases/` if needed) covering:

- What you built (file by file, ~1 line each)
- Anything decided that wasn't explicit in the brief, and why
- Surprises in the source the user should know
- TODOs left in code and what later phase they belong to
- Honest visual deltas between source intent and what RN can render — flag them so we can decide to fix or live with each

Then stop. Do not commit. The user reviews the diff first.