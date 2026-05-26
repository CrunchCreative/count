// Tug-of-war consistency chart — the signature visualization

function TugOfWar({ homeData, awayData, animate = true }) {
  // homeData / awayData: array of { stat, threshold, depth: 'L10' | 'L5' | 'none' }
  // 5 stats fixed-order. Bar fills from center outward.
  const [mounted, setMounted] = React.useState(!animate);
  React.useEffect(() => {
    if (!animate) return;
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, [animate]);

  // depth -> width %
  const widthFor = (depth) => {
    if (!mounted) return 0;
    if (depth === 'L10') return 90;
    if (depth === 'L5') return 60;
    return 0;
  };
  const colorFor = (depth) => depth === 'L10' ? 'teal' : depth === 'L5' ? 'amber' : null;

  const stats = ['CORNERS','CARDS','SHOTS','SOT','TACKLES'];

  return (
    <div className="tow">
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 4, paddingLeft: 2, paddingRight: 2,
      }}>
        <div className="tc-micro" style={{ color: 'var(--t-hint)' }}>CONSISTENT THRESHOLDS</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <span className="legend-dot"><span className="d teal" /> L10+</span>
          <span className="legend-dot"><span className="d amber" /> L5+</span>
        </div>
      </div>
      {stats.map((stat, i) => {
        const h = homeData[i];
        const a = awayData[i];
        const hWidth = widthFor(h.depth);
        const aWidth = widthFor(a.depth);
        const hColor = colorFor(h.depth);
        const aColor = colorFor(a.depth);
        return (
          <div className="tow-row" key={stat}>
            <div className="tow-bar-wrap left">
              <div className="tow-bar-track" />
              {hColor && (
                <div
                  className={`tow-bar left ${hColor}`}
                  style={{ width: `${hWidth}%`, transitionDelay: `${i * 80}ms` }}
                >
                  <span className="v">{h.threshold}</span>
                </div>
              )}
            </div>
            <div className="tow-label">{stat}</div>
            <div className="tow-bar-wrap right">
              <div className="tow-bar-track" />
              {aColor && (
                <div
                  className={`tow-bar right ${aColor}`}
                  style={{ width: `${aWidth}%`, transitionDelay: `${i * 80 + 40}ms` }}
                >
                  <span className="v">{a.threshold}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { TugOfWar });
