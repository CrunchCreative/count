// Kit SVG component — renders a small football shirt per team
// Sizes: hero (32-34), standard (22-26), compact (14-18)

function Kit({ team, size = 22 }) {
  const t = window.DATA.TEAMS[team];
  if (!t) return <div style={{ width: size, height: size }} />;
  const k = t.kit;
  // viewBox 100x110 — torso + sleeves + collar
  const id = `kit-${team}-${size}`;
  const W = size;
  const H = Math.round(size * 1.08);

  // Pattern logic
  let bodyFill;
  let stripes = null;
  switch (k.pattern) {
    case 'solid':
      bodyFill = k.primary;
      break;
    case 'vertical_halves':
      bodyFill = 'transparent';
      stripes = (
        <>
          <rect x="22" y="14" width="29" height="86" fill={k.primary} />
          <rect x="51" y="14" width="29" height="86" fill={k.secondary} />
        </>
      );
      break;
    case 'vertical_stripes':
      bodyFill = k.secondary;
      stripes = (
        <>
          <rect x="26" y="14" width="9" height="86" fill={k.primary} />
          <rect x="44" y="14" width="9" height="86" fill={k.primary} />
          <rect x="62" y="14" width="9" height="86" fill={k.primary} />
        </>
      );
      break;
    case 'horizontal_band':
      bodyFill = k.primary;
      // sleeve override comes from tertiary
      break;
    default:
      bodyFill = k.primary;
  }

  // Sleeves: typically secondary, but for horizontal_band use tertiary
  const sleeveFill = (k.pattern === 'horizontal_band')
    ? k.secondary
    : (k.pattern === 'solid' ? (k.secondary || k.primary) : k.primary);

  return (
    <svg width={W} height={H} viewBox="0 0 100 110" style={{ display: 'inline-block', flexShrink: 0 }}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d="M22 14 L40 8 Q50 14 60 8 L78 14 L78 100 Q78 104 74 104 L26 104 Q22 104 22 100 Z" />
        </clipPath>
      </defs>
      {/* Left sleeve */}
      <path d="M22 14 L4 28 L0 50 L18 56 L22 30 Z" fill={sleeveFill} />
      {/* Right sleeve */}
      <path d="M78 14 L96 28 L100 50 L82 56 L78 30 Z" fill={sleeveFill} />
      {/* Body base */}
      <path
        d="M22 14 L40 8 Q50 14 60 8 L78 14 L78 100 Q78 104 74 104 L26 104 Q22 104 22 100 Z"
        fill={bodyFill}
      />
      {/* Stripe overlays clipped to body */}
      <g clipPath={`url(#${id}-clip)`}>
        {stripes}
      </g>
      {/* Collar shadow notch */}
      <path d="M40 8 Q50 14 60 8 L58 16 Q50 20 42 16 Z" fill="rgba(0,0,0,0.35)" />
      {/* Subtle inner highlight */}
      <path
        d="M22 14 L40 8 Q50 14 60 8 L78 14 L78 100 Q78 104 74 104 L26 104 Q22 104 22 100 Z"
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1"
      />
    </svg>
  );
}

// Mini kit for tiny inline (matrix opponent column) — 8x9
function KitMini({ team }) {
  const t = window.DATA.TEAMS[team];
  if (!t) return <span style={{ width: 8, height: 9, display: 'inline-block' }} />;
  const k = t.kit;
  let bg = k.primary;
  let inner = null;
  if (k.pattern === 'vertical_halves') {
    bg = 'transparent';
    inner = (
      <>
        <rect x="0" y="0" width="4" height="9" fill={k.primary} />
        <rect x="4" y="0" width="4" height="9" fill={k.secondary} />
      </>
    );
  } else if (k.pattern === 'vertical_stripes') {
    bg = k.secondary;
    inner = (
      <>
        <rect x="1.5" y="0" width="1.5" height="9" fill={k.primary} />
        <rect x="5" y="0" width="1.5" height="9" fill={k.primary} />
      </>
    );
  }
  return (
    <svg width="8" height="9" viewBox="0 0 8 9" style={{ borderRadius: 1.5, overflow: 'hidden', flexShrink: 0 }}>
      <rect x="0" y="0" width="8" height="9" rx="1.5" fill={bg} />
      {inner}
    </svg>
  );
}

// Player nameplate kit — a number on a small kit
function PlayerKit({ num, team }) {
  const t = window.DATA.TEAMS[team];
  const k = t?.kit;
  let bg = k?.primary || '#444';
  let textColor = '#FFFFFF';
  // Choose darker text on yellow/light kits
  if (k?.pattern === 'solid' && (k.primary === '#FDB913' || k.primary === '#FFE667' || k.primary === '#FFFFFF')) {
    textColor = '#1A1408';
  }
  // For halves, use primary as bg
  if (k?.pattern === 'vertical_halves') {
    bg = `linear-gradient(90deg, ${k.primary} 50%, ${k.secondary} 50%)`;
  }
  // For stripes, use secondary as bg
  if (k?.pattern === 'vertical_stripes') {
    bg = k.secondary;
  }
  return (
    <div style={{
      width: 22, height: 22, borderRadius: 3,
      background: bg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 600, color: textColor,
      fontFamily: 'var(--font-mono)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.15)',
      flexShrink: 0,
    }}>
      {k?.pattern === 'vertical_stripes' && (
        <>
          <span style={{ position: 'absolute', left: 4, top: 0, bottom: 0, width: 2, background: k.primary }} />
          <span style={{ position: 'absolute', right: 4, top: 0, bottom: 0, width: 2, background: k.primary }} />
        </>
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>{num}</span>
    </div>
  );
}

Object.assign(window, { Kit, KitMini, PlayerKit });
