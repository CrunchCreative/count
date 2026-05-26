// Mirror of src/index.ts for Tailwind config consumption.
// Keep values in sync with src/index.ts — they are the same tokens, two formats.

const colors = {
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
  amberOnLightText: '#1A1408',
};

const glass = {
  standard: { top: 'rgba(255,255,255,0.025)', bottom: 'rgba(255,255,255,0.005)' },
  elevated: { top: 'rgba(255,255,255,0.035)', bottom: 'rgba(255,255,255,0.008)' },
  hero:     { top: 'rgba(255,255,255,0.025)', bottom: 'rgba(255,255,255,0.005)' },
};

const typography = {
  fontSans: '"Söhne", "Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
  fontMono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace',
  size: {
    h1: 27, h2: 22, h3: 14,
    bodyEm: 13, body: 13, caption: 11, micro: 10,
  },
  weight: {
    regular: '400',
    medium:  '500',
  },
  letterSpacing: {
    h1: -0.4, h2: -0.2, h3: -0.1,
    metaMicro: 0.4, sectionLabel: 0.6,
  },
  lineHeight: {
    h1: 1.15, h2: 1.2, body: 1.55,
  },
};

const spacing = {
  pageX: 20, pageY: 22, panel: 16,
  cardGap: 10, section: 22,
  gridTight: 5, gridLoose: 14,
};

const radii = {
  panel: 14, card: 12, inset: 10, pill: 7, full: 999,
};

const motion = {
  easeOutSharp: 'cubic-bezier(0.22, 1, 0.36, 1)',
  duration: { hover: 180, press: 150, sheet: 280, chart: 900 },
};

const backdrop = {
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
};

const glows = {
  amber: {
    elev:     { color: '#E8B53A', radius: 24, opacity: 0.04 },
    pillSoft: { color: '#E8B53A', radius: 10, opacity: 0.12 },
    formW:    { color: '#E8B53A', radius: 6,  opacity: 0.40 },
  },
  teal: {
    pillSoft: { color: '#5DCAA5', radius: 8,  opacity: 0.10 },
    hero:     { color: '#0F6E56', radius: 30, opacity: 0.10 },
  },
};

module.exports = {
  colors,
  glass,
  typography,
  spacing,
  radii,
  motion,
  backdrop,
  glows,
};
