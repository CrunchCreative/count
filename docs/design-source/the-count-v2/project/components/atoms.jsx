// Atom primitives — pills, badges, icons

function SafePill({ threshold, hits, total = 5, tier, size = 'std', addable, onClick }) {
  // tier: 'teal' | 'amber' | 'muted' — if not given, derive from hits/total
  let t = tier;
  if (!t) {
    if (hits === total) t = 'teal';
    else if (hits >= total - 1) t = 'amber';
    else t = 'muted';
  }
  const isLowerBetter = typeof threshold === 'string' && threshold.startsWith('↓');
  const isUpperBetter = typeof threshold === 'string' && threshold.startsWith('↑');
  let value = threshold;

  // Slip integration
  const slip = window.useSlip ? window.useSlip() : null;
  const inSlip = addable && slip ? slip.isInSlip(addable.id) : false;
  const handleClick = (e) => {
    if (addable && slip) {
      e.stopPropagation();
      slip.toggleLeg(addable);
    }
    if (onClick) onClick(e);
  };

  const cls = `safe-pill ${t}${addable ? ' addable' : ''}${inSlip ? ' in-slip' : ''}`;

  if (size === 'mini') {
    return (
      <span className={cls} onClick={addable ? handleClick : undefined} style={{
        padding: '2px 5px', minWidth: 28, borderRadius: 4,
      }}>
        <span className="v" style={{ fontSize: 10 }}>{value}</span>
        {addable && <span className="addable-hint">+</span>}
      </span>
    );
  }
  return (
    <span className={cls} onClick={addable ? handleClick : undefined}>
      <span className="v">{value}</span>
      <span className="r">{hits}/{total}</span>
      {addable && <span className="addable-hint">+</span>}
    </span>
  );
}

function SignalBadge({ score }) {
  const tier = score >= 85 ? 'high' : score >= 65 ? 'mid' : 'low';
  return (
    <span className={`signal-badge ${tier}`}>
      <span>SIGNAL</span>
      <span>{score}</span>
    </span>
  );
}

function SignalMini({ score }) {
  const tier = score >= 85 ? 'high' : score >= 65 ? 'mid' : 'low';
  return (
    <span className={`signal-badge ${tier}`} style={{ padding: '2px 7px', fontSize: 10 }}>
      {score}
    </span>
  );
}

function FormPill({ result }) {
  return <span className={`form-pill ${result}`}>{result}</span>;
}

function ScorePill({ result, wdl }) {
  // result like "3-0", with venue suffix "H" or "A"
  return <span className={`score-pill ${wdl}`}>{result}{wdl === 'W' || wdl === 'D' || wdl === 'L' ? '' : ''}</span>;
}

// Generic icon glyphs — kept simple and stroke-based
function Icon({ name, size = 16, color = 'currentColor', strokeWidth = 1.5 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'chevron-left':
      return <svg {...props}><polyline points="15 18 9 12 15 6" /></svg>;
    case 'chevron-right':
      return <svg {...props}><polyline points="9 18 15 12 9 6" /></svg>;
    case 'chevron-down':
      return <svg {...props}><polyline points="6 9 12 15 18 9" /></svg>;
    case 'chevron-up':
      return <svg {...props}><polyline points="6 15 12 9 18 15" /></svg>;
    case 'bookmark':
      return <svg {...props}><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>;
    case 'search':
      return <svg {...props}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
    case 'bell':
      return <svg {...props}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
    case 'home':
      return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
    case 'calendar':
      return <svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
    case 'profile':
      return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case 'builders':
      return <svg {...props}><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /><path d="M12 2L2 7l10 5 10-5z" /></svg>;
    case 'filter':
      return <svg {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>;
    case 'arrow-right':
      return <svg {...props}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>;
    case 'arrow-left':
      return <svg {...props}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 19" /></svg>;
    case 'flag':
      return <svg {...props}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></svg>;
    case 'sparkles':
      return <svg {...props}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" /><path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7z" /></svg>;
    case 'target':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>;
    case 'card':
      return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /></svg>;
    case 'arrows-h':
      return <svg {...props}><polyline points="7 8 3 12 7 16" /><polyline points="17 8 21 12 17 16" /><line x1="3" y1="12" x2="21" y2="12" /></svg>;
    case 'bars':
      return <svg {...props}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
    case 'check':
      return <svg {...props}><polyline points="20 6 9 17 4 12" /></svg>;
    case 'info':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>;
    case 'plus':
      return <svg {...props}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
    case 'corner':
      // flag-like icon for corners
      return <svg {...props}><line x1="7" y1="22" x2="7" y2="3" /><path d="M7 3l11 4-11 4" /></svg>;
    case 'x':
      return <svg {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
    case 'x-circle':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>;
    case 'more':
      return <svg {...props}><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>;
    case 'close':
      return <svg {...props}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
    case 'layers':
      return <svg {...props}><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
    case 'copy':
      return <svg {...props}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
    case 'duplicate':
      return <svg {...props}><rect x="2" y="2" width="14" height="14" rx="2" /><path d="M8 8h14v14H8z" /></svg>;
    case 'trash':
      return <svg {...props}><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>;
    case 'check-circle':
      return <svg {...props}><circle cx="12" cy="12" r="10" /><polyline points="9 12 12 15 16 10" /></svg>;
    case 'share':
      return <svg {...props}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>;
    default:
      return null;
  }
}

Object.assign(window, { SafePill, SignalBadge, SignalMini, FormPill, ScorePill, Icon });
