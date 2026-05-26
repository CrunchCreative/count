const tokens = require('@count/tokens/tailwind');

/** @type {import('tailwindcss').Config} */
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
        sans: tokens.typography.fontSans.split(',').map((s) => s.trim()),
        mono: tokens.typography.fontMono.split(',').map((s) => s.trim()),
      },
    },
  },
  plugins: [],
};
