// Minimal SVG chart primitives — on-brand, dark, no dependencies

// ─────────────────────────────────────────────────────
// LINE CHART — for win-rate-over-time
// ─────────────────────────────────────────────────────
function LineChart({
  data,
  height = 160,
  yMin = 0,
  yMax = 100,
  gridLines = [25, 50, 75],
  color = 'var(--teal-bright)',
  glowColor = '93,202,165',
  showXLabels = true,
}) {
  const W = 600; // viewBox width
  const H = height;
  const padL = 28, padR = 12, padT = 14, padB = showXLabels ? 22 : 8;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const xFor = (i) => padL + (i / (data.length - 1)) * innerW;
  const yFor = (v) => padT + (1 - (v - yMin) / (yMax - yMin)) * innerH;

  const path = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i)} ${yFor(d.rate)}`).join(' ');
  const areaPath = `${path} L ${xFor(data.length - 1)} ${padT + innerH} L ${padL} ${padT + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="lc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`rgba(${glowColor},0.30)`} />
          <stop offset="100%" stopColor={`rgba(${glowColor},0)`} />
        </linearGradient>
        <filter id="lc-glow">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* grid */}
      {gridLines.map(g => (
        <g key={g}>
          <line
            x1={padL} x2={W - padR}
            y1={yFor(g)} y2={yFor(g)}
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
          <text
            x={padL - 6} y={yFor(g) + 3}
            fill="var(--t-faint)"
            fontSize="9"
            fontFamily="var(--font-mono)"
            textAnchor="end"
          >{g}</text>
        </g>
      ))}
      {/* area */}
      <path d={areaPath} fill="url(#lc-fill)" />
      {/* line */}
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" filter="url(#lc-glow)" strokeLinejoin="round" strokeLinecap="round" />
      {/* endpoint dot */}
      <circle
        cx={xFor(data.length - 1)} cy={yFor(data[data.length - 1].rate)}
        r="3" fill={color}
        style={{ filter: `drop-shadow(0 0 6px rgba(${glowColor},0.7))` }}
      />
      {/* x labels — show first, middle, last */}
      {showXLabels && [0, Math.floor(data.length / 2), data.length - 1].map(i => (
        <text
          key={i}
          x={xFor(i)} y={H - 6}
          fill="var(--t-hint)"
          fontSize="9"
          fontFamily="var(--font-mono)"
          textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}
        >{data[i].week}</text>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────
// HORIZONTAL BAR CHART — for win-rate-by-leg-type / league
// ─────────────────────────────────────────────────────
function HBarChart({ data, valueLabel = '%', max = 100, showCount = false }) {
  // tier mapping
  const tierFor = (v) => v >= 60 ? 'teal' : v >= 40 ? 'amber' : 'muted';
  const colorFor = (tier) => ({
    teal: { bg: 'linear-gradient(90deg, var(--teal-deep), var(--teal-bright))', glow: 'rgba(93,202,165,0.30)', text: 'var(--teal-bright)' },
    amber: { bg: 'linear-gradient(90deg, var(--amber-deep), var(--amber-bright))', glow: 'rgba(232,181,58,0.25)', text: 'var(--amber-bright)' },
    muted: { bg: 'linear-gradient(90deg, rgba(255,255,255,0.04), rgba(255,255,255,0.10))', glow: 'transparent', text: 'var(--t-mut)' },
  })[tier];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data.map((d, i) => {
        const tier = tierFor(d.rate);
        const c = colorFor(tier);
        return (
          <div key={d.label} style={{
            display: 'grid',
            gridTemplateColumns: '92px 1fr 48px',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{
              fontSize: 12, fontWeight: 500,
              color: 'var(--t-sec)',
              fontFamily: 'var(--font-sans)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {d.label}
              {showCount && d.count != null && (
                <span style={{
                  marginLeft: 6, color: 'var(--t-hint)',
                  fontFamily: 'var(--font-mono)', fontSize: 10,
                }}>· {d.count}</span>
              )}
            </span>
            <div style={{
              position: 'relative',
              height: 18, borderRadius: 4,
              background: 'rgba(255,255,255,0.03)',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${(d.rate / max) * 100}%`,
                background: c.bg,
                borderRadius: 4,
                boxShadow: c.glow !== 'transparent' ? `0 0 8px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.18)` : 'none',
                transition: 'width 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
              }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 13, fontWeight: 500,
              color: c.text,
              textAlign: 'right',
            }}>
              {d.rate}{valueLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// VERTICAL BAR CHART — for win-rate-by-risk-tier (small set)
// ─────────────────────────────────────────────────────
function VBarChart({ data, height = 160 }) {
  const tierFor = (v) => v >= 60 ? 'teal' : v >= 40 ? 'amber' : 'muted';
  const colorFor = (tier) => ({
    teal: { bg: 'linear-gradient(180deg, var(--teal-bright), var(--teal-deep))', glow: 'rgba(93,202,165,0.30)', text: 'var(--teal-bright)' },
    amber: { bg: 'linear-gradient(180deg, var(--amber-bright), var(--amber-deep))', glow: 'rgba(232,181,58,0.25)', text: 'var(--amber-bright)' },
    muted: { bg: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))', glow: 'transparent', text: 'var(--t-mut)' },
  })[tier];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${data.length}, 1fr)`,
      gap: 14,
      alignItems: 'end',
      height,
    }}>
      {data.map((d, i) => {
        const tier = tierFor(d.rate);
        const c = colorFor(tier);
        const barH = (d.rate / 100) * (height - 50);
        return (
          <div key={d.label} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: '100%',
            gap: 8,
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 14, fontWeight: 500,
              color: c.text,
            }}>{d.rate}%</span>
            <div style={{
              width: '100%',
              maxWidth: 70,
              height: barH,
              borderRadius: 6,
              background: c.bg,
              boxShadow: c.glow !== 'transparent' ? `0 0 12px ${c.glow}, inset 0 1px 0 rgba(255,255,255,0.20)` : 'none',
              transition: 'height 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
            }} />
            <span className="tc-cap" style={{
              fontSize: 11,
              color: 'var(--t-mut)',
              textAlign: 'center',
            }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { LineChart, HBarChart, VBarChart });
