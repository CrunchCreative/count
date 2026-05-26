# The Count — Mobile UI Kit

A working interactive mobile prototype that demonstrates every component, screen and state in the design system. Open `index.html` to see the full app.

## What's here

```
ui_kits/mobile/
├── index.html              ← Open this. iOS bezel + full app shell.
├── app.jsx                 ← Top-level: routing, tweaks, slip provider, bottom nav
├── styles.css              ← Full live stylesheet (consumes colors_and_type.css tokens)
├── data.js                 ← Teams + fixtures + hero carousel + tug-of-war seed
├── data-builders.js        ← Seed builders + performance analytics data
├── tweaks-panel.jsx        ← Tweaks panel (accent / density / mode)
├── components/
│   ├── atoms.jsx           ← SafePill, SignalBadge, FormPill, ScorePill, Icon set
│   ├── kit.jsx             ← <Kit>, <KitMini>, <PlayerKit> — team shirt SVGs
│   ├── tug-of-war.jsx      ← The signature consistency-depth chart
│   ├── charts.jsx          ← <LineChart>, <HBarChart>, <VBarChart>
│   └── slip.jsx            ← Slip context, bar, sheet, save-builder modal
└── screens/
    ├── dashboard.jsx       ← Home screen (carousel, today's fixtures, featured match, etc)
    ├── fixtures-list.jsx   ← All fixtures grouped by league
    ├── fixture.jsx         ← Fixture detail with 4 tabs (Overview, Team, Player, AI)
    ├── builders.jsx        ← Builders tab + detail + Performance sub-page
    └── builder-result.jsx  ← AI-generated builder result screen
```

## How to use it

### As a click-thru reference
Just open `index.html`. You'll land on the dashboard. From there:
- Tap fixture cards → fixture overview
- Switch tabs → Team matrix, Player matrix, AI
- Tap any Safe @ pill → adds to slip (watch the slip bar populate)
- Slip bar → tap to open sheet → Save Builder
- Builders tab → see saved builds + Performance sub-page

### As a component reference
Each `.jsx` file is small and self-contained. Components export themselves onto `window` (no module system) so they can be wired together with plain `<script type="text/babel" src="...">` tags. See `index.html` for the loading order.

### As a starting point for new screens
Pick the screen file closest to what you need (`dashboard.jsx` for a stat-heavy landing, `fixture.jsx` for tabbed detail, `builders.jsx` for analytics) and adapt. The design tokens in `colors_and_type.css` mean any new component will inherit the visual language automatically.

## Built-in interactions

| Surface                | Interaction                                                                    |
|------------------------|--------------------------------------------------------------------------------|
| Hero carousel          | Auto-cycles every 5s · tap dots to jump · pauses on hover                      |
| Today's fixtures       | Horizontal swipe with snap-to-card                                             |
| Fixture tabs           | Switch tab content with the glowing amber underline                            |
| Window selector        | Tap to expand · choose L5 / L10 / L20 / Season                                 |
| Safe @ pills           | Tap to add to slip · teal check dot when active                                |
| Strongest Angles rows  | Whole row tap-to-add                                                           |
| Slip bar               | Empty muted → populated amber · tap to open sheet                              |
| Slip sheet             | Grouped by fixture · X removes · Save Builder + Clear all                      |
| Save Builder modal     | Name input with smart default · saves & clears slip                            |
| Builders filter tabs   | Open / Settled / All — defaults to Open if any pending exist                   |
| Builder detail         | Outcome banner · per-leg ✓/✗ · Copy / Share / Duplicate · overflow Delete      |
| Performance sub-page   | Line chart · bar charts · insight panels                                        |
| Tug-of-war bars        | Grow from 0 with 80ms stagger · pulse at 3.5s                                  |
| Tweaks panel           | Accent palette · density · casual/advanced mode (toggle from toolbar)          |
