// Dashboard screen — Home tab

function Dashboard({ onOpenFixture, advanced }) {
  const { CAROUSEL, TODAY, TOP_RESEARCH, FIXTURE_MCI_CRY } = window.DATA;

  return (
    <div className="tc-content" style={{ paddingTop: 60 }}>
      {/* Branding header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <img
          src="../../assets/count-logo.png"
          alt="The Count"
          style={{ height: 50, width: 'auto', display: 'block', marginLeft: -15, filter: 'drop-shadow(0 0 14px rgba(232,181,58,0.20))' }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="icon-btn"><Icon name="search" size={15} /></button>
          <button className="icon-btn"><Icon name="bell" size={15} /></button>
        </div>
      </div>

      {/* Hero carousel */}
      <HeroCarousel slides={CAROUSEL} />

      {/* Greeting */}
      <div style={{ marginTop: 24 }}>
        <div className="tc-meta">SATURDAY · 13 MAY</div>
        <h1 className="tc-h1" style={{ marginTop: 4 }}>Good morning, Ben</h1>
        <p className="tc-body" style={{ marginTop: 6, color: 'var(--t-sec)' }}>
          14 fixtures today. The pattern engine has surfaced{' '}
          <span style={{ color: 'var(--teal-bright)', fontWeight: 500 }}>11 strong angles</span>{' '}
          with 5/5 hit rates across your followed leagues.
        </p>
      </div>

      {/* Today's fixtures */}
      <div className="section-head" style={{ marginTop: 22 }}>
        <span className="tc-section-label utility">TODAY&rsquo;S FIXTURES</span>
        <span className="line" />
        <span className="meta">Premier League · 1 of 6</span>
      </div>
      <div className="h-scroll">
        {TODAY.slice(0, 6).map((f, i) => (
          <FixtureCard key={f.id} fix={f} onClick={() => onOpenFixture(f.id)} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 12, color: 'var(--t-mut)', fontSize: 11 }}>
        <Icon name="chevron-left" size={12} color="var(--amber-bright)" />
        <span>Swipe through 42 fixtures</span>
        <Icon name="chevron-right" size={12} color="var(--amber-bright)" />
      </div>

      {/* Featured match */}
      <div className="section-head">
        <span className="tc-section-label engine">FEATURED MATCH</span>
        <span className="line" />
        <span className="meta">Highest signal today</span>
      </div>
      <FeaturedMatch fixture={FIXTURE_MCI_CRY} onOpen={() => onOpenFixture('mci-cry')} />

      {/* Top Research Today */}
      <div className="section-head">
        <span className="tc-section-label engine">TOP RESEARCH TODAY</span>
        <span className="line" />
        <span className="meta">Ranked 2&ndash;4</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {TOP_RESEARCH.map((r) => (
          <ResearchCard key={r.id} item={r} onClick={() => onOpenFixture(r.id)} />
        ))}
      </div>

      {/* Pick up where you left off */}
      <div className="section-head">
        <span className="tc-section-label utility">PICK UP WHERE YOU LEFT OFF</span>
        <span className="line" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <PickupCard meta="LAST VIEWED · 22 MIN AGO" title="Newcastle vs Brighton" sub="Player matrix · Last 5" />
        <PickupCard meta="SAVED BUILDER · YESTERDAY" title="Weekend corner build" sub={<span style={{ color: 'var(--amber-bright)' }}>+4.20 · 2 fixtures remaining</span>} />
      </div>

      {/* Scan across fixtures */}
      <div className="section-head">
        <span className="tc-section-label utility">SCAN ACROSS FIXTURES</span>
        <span className="line" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <ScanCard icon="flag" title="High corners" sub="7 fixtures · 8+ floor" />
        <ScanCard icon="card" title="Cards-heavy refs" sub="3 fixtures today" />
        <ScanCard icon="target" title="Shots on target" sub="Player props · L5" />
        <ScanCard icon="sparkles" title="Ask the AI" sub="Natural language" />
      </div>

      {advanced && (
        <div className="section-head">
          <span className="tc-section-label utility">ADVANCED · RAW MATRICES</span>
          <span className="line" />
        </div>
      )}
      {advanced && (
        <div className="glass" style={{ padding: 14 }}>
          <div className="tc-body" style={{ color: 'var(--t-mut)' }}>
            Advanced mode shows extra raw-data shortcuts: cross-fixture leaderboards, manual stat scanning, and full L20 windows on every tab.
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────── */

function HeroCarousel({ slides }) {
  const [idx, setIdx] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  const s = slides[idx];
  const tier = s.kind === 'pattern-hit' ? 'teal' : 'amber';

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        className="glass hero"
        style={{
          position: 'relative',
          padding: 16,
          minHeight: 168,
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        {/* Decorative bars (right side) */}
        <HeroDecor kind={s.kind} />
        {/* Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span className={`signal-badge ${tier === 'teal' ? 'mid' : 'high'}`} style={{
            padding: '3px 8px', fontSize: 9, letterSpacing: 0.5,
          }}>{s.label}</span>
          <span className="tc-meta">{s.sub}</span>
        </div>
        <div key={idx} className="fade-up" style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: 19, fontWeight: 500, margin: 0, letterSpacing: -0.3, lineHeight: 1.2 }}>{s.title}</h2>
          <p style={{ fontSize: 12, color: 'var(--t-mut)', marginTop: 8, lineHeight: 1.5, maxWidth: '70%' }}>{s.body}</p>
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--amber-bright)', fontSize: 13, fontWeight: 500 }}>
            <span>{s.cta}</span>
            <Icon name="arrow-right" size={14} />
          </div>
        </div>
      </div>
      <div className="dots">
        {slides.map((_, i) => (
          <div key={i} className={`d ${i === idx ? 'on' : ''}`} onClick={() => setIdx(i)} />
        ))}
      </div>
    </div>
  );
}

function HeroDecor({ kind }) {
  // Right-aligned decorative chart
  const heights = kind === 'pattern-hit'
    ? [12, 16, 20, 18, 24, 28, 36, 44, 52, 60]
    : kind === 'engine'
      ? [22, 32, 28, 38, 30, 42, 26, 48, 34, 56]
      : [40, 38, 42, 36, 44, 40, 46, 42, 48, 44];
  const color = kind === 'pattern-hit' ? 'var(--teal-bright)' : 'var(--amber-bright)';
  return (
    <div style={{
      position: 'absolute', right: 14, top: 14, bottom: 14, width: 130,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', gap: 4,
      pointerEvents: 'none', opacity: 0.7,
    }}>
      {/* radial rings backdrop */}
      <svg width="130" height="130" style={{ position: 'absolute', right: -10, top: -10, opacity: 0.25 }}>
        <circle cx="100" cy="100" r="40" fill="none" stroke={color} strokeWidth="0.5" />
        <circle cx="100" cy="100" r="60" fill="none" stroke={color} strokeWidth="0.5" />
        <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="0.5" />
      </svg>
      {heights.map((h, i) => (
        <div key={i} style={{
          width: 6, height: h,
          background: `linear-gradient(180deg, ${color}, transparent)`,
          opacity: 0.55 + (i / heights.length) * 0.45,
          borderRadius: 1,
          boxShadow: `0 0 6px ${color === 'var(--teal-bright)' ? 'rgba(93,202,165,0.40)' : 'rgba(232,181,58,0.30)'}`,
        }} />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────── */

function FixtureCard({ fix, onClick }) {
  const tier = fix.signal >= 85 ? 'high' : fix.signal >= 65 ? 'mid' : 'low';
  return (
    <div className={`glass${fix.primary ? ' elev' : ''} fix-card tap-row`} onClick={onClick}>
      <div className="top">
        <span>{fix.kickoff}</span>
        <SignalMini score={fix.signal} />
      </div>
      <div className="teams">
        <div>{fix.home}</div>
        <div className="vs">vs</div>
        <div>{fix.away}</div>
      </div>
      <div className="bot">
        <div className="ref">
          REF · {fix.ref.toUpperCase()}
          <span className="v">{fix.refCpm}</span>
        </div>
        <div style={{ fontSize: 9, color: 'var(--t-hint)', fontFamily: 'var(--font-mono)', letterSpacing: 0.3, alignSelf: 'end' }}>cards/m</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── */

function FeaturedMatch({ fixture, onOpen }) {
  const { TEAMS } = window.DATA;
  const home = TEAMS[fixture.home];
  const away = TEAMS[fixture.away];

  return (
    <div className="glass elev" style={{ padding: 16, position: 'relative' }}>
      {/* meta row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="tc-meta">
          {fixture.league.toUpperCase()} &nbsp;·&nbsp; {fixture.kickoff} &nbsp;·&nbsp; {fixture.venue.toUpperCase()}
        </div>
        <SignalBadge score={fixture.signal} />
      </div>
      {/* teams */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Kit team={fixture.home} size={22} />
          <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.2 }}>{home.name}</span>
        </div>
        <span className="tc-meta" style={{ fontSize: 10 }}>vs</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.2 }}>{away.name}</span>
          <Kit team={fixture.away} size={22} />
        </div>
      </div>

      {/* tug of war */}
      <div className="glass" style={{ marginTop: 12, background: 'rgba(0,0,0,0.20)' }}>
        <TugOfWar homeData={fixture.thresholds.home} awayData={fixture.thresholds.away} />
      </div>

      {/* depth row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, fontSize: 11 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Kit team={fixture.home} size={14} />
          <span style={{ color: 'var(--t-mut)' }}>{home.name}</span>
          <span style={{ color: 'var(--t-hint)', fontFamily: 'var(--font-mono)' }}>3 of 5</span>
        </div>
        <div style={{ color: 'var(--t-hint)', fontFamily: 'var(--font-mono)', letterSpacing: 0.4, fontSize: 10 }}>
          RESEARCH DEPTH &nbsp;7/10
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--t-hint)', fontFamily: 'var(--font-mono)' }}>3 of 5</span>
          <span style={{ color: 'var(--t-mut)' }}>{away.name}</span>
          <Kit team={fixture.away} size={14} />
        </div>
      </div>

      <div style={{ marginTop: 14, paddingTop: 12, borderTop: '0.5px solid var(--b-def)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="tc-body" style={{ color: 'var(--t-mut)', fontSize: 11 }}>
          Bar length encodes consistency depth · longer bars hold over more fixtures.
        </span>
        <button className="tap-row" onClick={onOpen} style={{ background: 'none', border: 'none', color: 'var(--amber-bright)', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 500, padding: 0, cursor: 'pointer' }}>
          Open fixture <Icon name="arrow-right" size={13} />
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── */

function ResearchCard({ item, onClick }) {
  const { TEAMS } = window.DATA;
  const slip = window.useSlip ? window.useSlip() : null;
  const home = TEAMS[item.home];
  const away = TEAMS[item.away];
  const a = item.angle;
  const tier = a.tier || (a.hits === '5/5' ? 'teal' : 'amber');
  const leg = {
    id: `${item.id}::research`,
    fixtureId: item.id,
    threshold: a.threshold,
    hits: parseInt(a.hits),
    total: 5,
    tier,
    title: a.title,
    reason: a.body,
  };
  return (
    <div className="glass tap-row" style={{ padding: 14 }} onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div className="tc-meta">
          {item.league.toUpperCase()} &nbsp;·&nbsp; {item.kickoff} &nbsp;·&nbsp; {item.venue.toUpperCase()}
        </div>
        <SignalBadge score={item.signal} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Kit team={item.home} size={20} />
          <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: -0.2 }}>{home.name}</span>
        </div>
        <span className="tc-meta" style={{ fontSize: 10 }}>vs</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 500, letterSpacing: -0.2 }}>{away.name}</span>
          <Kit team={item.away} size={20} />
        </div>
      </div>
      <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: 'rgba(0,0,0,0.20)' }}>
        <SafePill threshold={a.threshold} hits={parseInt(a.hits)} tier={tier} addable={leg} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="tc-body-em">{a.title}</div>
          <div className="tc-cap" style={{ marginTop: 2, color: 'var(--t-mut)' }}>{a.body}</div>
        </div>
        <Icon name="arrow-right" size={14} color="var(--amber-bright)" />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── */

function PickupCard({ meta, title, sub }) {
  return (
    <div className="glass tap-row" style={{ padding: 12 }}>
      <div className="tc-micro" style={{ fontSize: 9 }}>{meta}</div>
      <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6, letterSpacing: -0.1 }}>{title}</div>
      <div className="tc-cap" style={{ marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function ScanCard({ icon, title, sub }) {
  return (
    <div className="glass tap-row" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
      <Icon name={icon} size={16} color="var(--t-mut)" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
        <div className="tc-cap" style={{ marginTop: 1 }}>{sub}</div>
      </div>
      <Icon name="chevron-right" size={14} color="var(--t-hint)" />
    </div>
  );
}

Object.assign(window, { Dashboard });
