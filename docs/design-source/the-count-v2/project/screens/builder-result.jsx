// Builder result screen — shown when user clicks Safe/Balanced/Higher risk

function BuilderResult({ tier, onBack, fixtureName = 'Man City vs Crystal Palace' }) {
  const { BUILDER_RESULT } = window.DATA;
  // Pick legs based on tier
  const legCount = tier === 'Safe' ? 3 : tier === 'Balanced' ? 4 : 5;
  let legs = BUILDER_RESULT.legs.slice(0, legCount);
  // For "Higher risk" add a riskier 5th leg
  if (tier === 'Higher risk') {
    legs = [
      ...BUILDER_RESULT.legs,
      { title: 'Doku 2+ shots', threshold: '2+', hits: '4/5', tier: 'amber', detail: '2.2 shot avg · ramping role' },
    ];
  }
  const odds = tier === 'Safe' ? '+220' : tier === 'Balanced' ? '+420' : '+870';
  const edge = tier === 'Safe' ? '+8.6pp' : tier === 'Balanced' ? '+12.2pp' : '+18.4pp';
  const tierColor = tier === 'Safe' ? 'var(--teal-bright)' : tier === 'Balanced' ? 'var(--amber-bright)' : 'var(--t-mut)';

  return (
    <div className="tc-content fixture fade-up" style={{ paddingTop: 56 }}>
      <div className="fix-header-row">
        <div className="left">
          <button className="icon-btn solo" onClick={onBack}>
            <Icon name="chevron-left" size={18} />
          </button>
          <div className="tc-meta">{fixtureName.toUpperCase()}</div>
        </div>
        <button className="icon-btn"><Icon name="bookmark" size={14} /></button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
        <h1 className="tc-h1">{tier} builder</h1>
        <span className="signal-badge mid" style={{ color: tierColor }}>{legs.length} LEGS</span>
      </div>

      <p className="tc-body" style={{ color: 'var(--t-mut)', marginTop: 6 }}>
        Built from the strongest historical tendencies on this fixture. Each leg holds across the L5 window. Never a future prediction &mdash; always a pattern.
      </p>

      {/* Combined card */}
      <div className="glass elev" style={{ padding: 16, marginTop: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 }}>
          <div>
            <div className="tc-micro">COMBINED ODDS</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 500, color: 'var(--amber-bright)', textShadow: '0 0 16px rgba(232,181,58,0.4)', marginTop: 4, letterSpacing: 0.5 }}>
              {odds}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="tc-micro">MODEL EDGE</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--teal-bright)', fontWeight: 500, marginTop: 4 }}>{edge}</div>
            <div className="tc-cap" style={{ marginTop: 2, fontSize: 10 }}>vs market implied</div>
          </div>
        </div>

        {/* Mini probability bar */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="tc-micro" style={{ fontSize: 9 }}>MARKET IMPLIED</span>
            <span className="tc-micro" style={{ fontSize: 9, color: 'var(--teal-bright)' }}>MODEL PROBABILITY</span>
          </div>
          <div style={{
            position: 'relative', height: 6, borderRadius: 3,
            background: 'rgba(255,255,255,0.04)', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${BUILDER_RESULT.combined.modelProb}%`,
              background: 'linear-gradient(90deg, var(--teal-deep), var(--teal-bright))',
              borderRadius: 3, boxShadow: '0 0 8px rgba(93,202,165,0.40)',
            }} />
            <div style={{
              position: 'absolute',
              left: `${BUILDER_RESULT.combined.impliedProb}%`,
              top: -2, bottom: -2,
              width: 2, background: 'var(--amber-bright)',
              boxShadow: '0 0 6px rgba(232,181,58,0.6)',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: 'var(--amber-bright)', fontFamily: 'var(--font-mono)' }}>{BUILDER_RESULT.combined.impliedProb}%</span>
            <span style={{ fontSize: 11, color: 'var(--teal-bright)', fontFamily: 'var(--font-mono)' }}>{BUILDER_RESULT.combined.modelProb}%</span>
          </div>
        </div>
      </div>

      {/* Legs */}
      <div className="section-head">
        <span className="tc-section-label engine">LEGS</span>
        <span className="line" />
        <span className="meta">{legs.length} of {legs.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {legs.map((leg, i) => (
          <div key={i} className="glass" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 22, height: 22, borderRadius: 5,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 500, color: 'var(--t-mut)',
              background: 'rgba(255,255,255,0.03)',
              border: '0.5px solid var(--b-def)',
              fontFamily: 'var(--font-mono)',
            }}>{i + 1}</div>
            <SafePill threshold={leg.threshold} hits={parseInt(leg.hits)} tier={leg.tier} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tc-body-em">{leg.title}</div>
              <div className="tc-cap" style={{ marginTop: 2 }}>{leg.detail}</div>
            </div>
            <Icon name="info" size={14} color="var(--t-hint)" />
          </div>
        ))}
      </div>

      {/* Vocabulary footer / responsibility */}
      <div className="glass" style={{ padding: 14, marginTop: 14, background: 'rgba(0,0,0,0.20)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Icon name="info" size={14} color="var(--t-hint)" />
          <div className="tc-cap" style={{ lineHeight: 1.5 }}>
            All figures are historical tendencies, not predictions. Even 5/5 patterns can break in any single fixture. Treat as research input, not certainty.
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14 }}>
        <button className="tc-btn">
          <Icon name="bookmark" size={13} />
          Save builder
        </button>
        <button className="tc-btn amber">
          <Icon name="arrow-right" size={13} />
          Open in sportsbook
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { BuilderResult });
