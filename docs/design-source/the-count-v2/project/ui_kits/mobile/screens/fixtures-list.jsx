// Fixtures list — bottom-nav second-tab landing page

function FixturesList({ onOpenFixture, wide = false }) {
  const { FIXTURES_ALL } = window.DATA;
  const [day, setDay] = React.useState('today');
  const [comp, setComp] = React.useState('all');
  const [dropOpen, setDropOpen] = React.useState(false);

  // Total counts across leagues
  const allLeagues = Object.keys(FIXTURES_ALL);
  const total = allLeagues.reduce((n, l) => n + FIXTURES_ALL[l].length, 0);

  // Filter by competition
  const visibleLeagues = comp === 'all' ? allLeagues : [comp];

  // Date strip options
  const dayOpts = [
    { id: 'today',    label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'sat-14',   label: 'Sat 14' },
    { id: 'sun-15',   label: 'Sun 15' },
  ];

  // League options for the dropdown (excluding "All")
  const leagueOpts = [
    { id: 'all', label: 'All competitions', count: total },
    ...allLeagues.map(l => ({ id: l, label: l, count: FIXTURES_ALL[l].length })),
  ];

  const filteringActive = comp !== 'all';
  const currentLeagueLabel = leagueOpts.find(o => o.id === comp)?.label ?? 'All competitions';

  return (
    <div
      className={`tc-content ${wide ? 'wide' : 'fixture'} fade-up`}
      style={{ paddingTop: wide ? 40 : 60, overflowX: 'hidden' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h1 className="tc-h1">Fixtures</h1>
          <p className="tc-body" style={{ color: 'var(--t-mut)', marginTop: 6 }}>
            {total} fixtures across {allLeagues.length} competitions
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button className="icon-btn"><Icon name="filter" size={15} /></button>
          <button className="icon-btn"><Icon name="search" size={15} /></button>
        </div>
      </div>

      {/* Date strip — 24px gap from sub-line */}
      <div className="date-strip" style={{ marginTop: 24 }}>
        {dayOpts.map(d => (
          <button
            key={d.id}
            className={`date-seg ${day === d.id ? 'active' : ''}`}
            onClick={() => setDay(d.id)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* League filter row — 18px gap from date strip */}
      <div style={{ marginTop: 18, position: 'relative', display: 'flex', gap: 8 }}>
        <button
          className={`comp-chip ${!filteringActive ? 'active' : ''}`}
          onClick={() => setComp('all')}
          style={{ flexShrink: 0 }}
        >
          All comps
        </button>
        <div
          className="glass-select"
          onClick={() => setDropOpen(o => !o)}
          style={{ flex: 1, minWidth: 0, padding: '8px 12px' }}
        >
          {filteringActive && <span className="dot" />}
          <span className="grow" style={{
            fontSize: 13, fontWeight: 500,
            color: filteringActive ? 'var(--t-pri)' : 'var(--t-mut)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            flex: 1,
          }}>{currentLeagueLabel}</span>
          {filteringActive && (
            <span className="tc-meta" style={{ fontSize: 10 }}>
              {leagueOpts.find(o => o.id === comp)?.count}
            </span>
          )}
          <Icon name={dropOpen ? 'chevron-up' : 'chevron-down'} size={14} color="var(--t-mut)" />
        </div>

        {dropOpen && (
          <div className="glass elev" style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 30,
            background: 'rgba(15,16,18,0.97)',
            backdropFilter: 'blur(20px)', padding: 6,
          }}>
            {leagueOpts.map(o => (
              <div
                key={o.id}
                onClick={() => { setComp(o.id); setDropOpen(false); }}
                style={{
                  padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                  background: comp === o.id ? 'rgba(232,181,58,0.06)' : 'transparent',
                }}>
                <span style={{ fontSize: 13, color: comp === o.id ? 'var(--amber-bright)' : 'var(--t-pri)' }}>
                  {o.label}
                </span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11,
                  color: comp === o.id ? 'var(--amber-bright)' : 'var(--t-hint)',
                  letterSpacing: 0.3,
                }}>
                  {o.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* League sections — first one gets 24px gap from filter row */}
      <div style={{ marginTop: 24 }}>
        {visibleLeagues.map((league, idx) => {
          const fixtures = FIXTURES_ALL[league];
          if (!fixtures || !fixtures.length) return null;
          return (
            <FixtureLeagueSection
              key={league}
              league={league}
              fixtures={fixtures}
              onOpenFixture={onOpenFixture}
              wide={wide}
              firstSection={idx === 0}
            />
          );
        })}
      </div>
    </div>
  );
}

function FixtureLeagueSection({ league, fixtures, onOpenFixture, wide, firstSection }) {
  return (
    <div style={{ marginTop: firstSection ? 0 : 26 }}>
      <div className="section-head" style={{ margin: '0 0 12px' }}>
        <span className="tc-section-label utility">{league.toUpperCase()}</span>
        <span className="line" />
        <span className="meta">{fixtures.length} fixtures</span>
      </div>
      <div className="fix-list-grid" style={{
        display: 'grid',
        gridTemplateColumns: wide ? 'repeat(2, 1fr)' : '1fr',
        gap: 10,
      }}>
        {fixtures.map(f => (
          <FixtureListCard key={f.id} fix={{ ...f, league }} onClick={() => onOpenFixture(f.id)} />
        ))}
      </div>
    </div>
  );
}

function FixtureListCard({ fix, onClick }) {
  const { TEAMS } = window.DATA;
  const home = TEAMS[fix.home];
  const away = TEAMS[fix.away];
  if (!home || !away) return null;
  const isHighSignal = fix.signal >= 85;
  const leg = (fix.topAngle.threshold && fix.topAngle.threshold !== '—') ? {
    id: `${fix.id}::list-top`,
    fixtureId: fix.id,
    threshold: fix.topAngle.threshold,
    hits: parseInt(fix.topAngle.hits),
    total: 5,
    tier: fix.topAngle.tier,
    title: fix.topAngle.title,
  } : null;

  return (
    <div
      className={`glass tap-row fix-list-card${isHighSignal ? ' elev' : ''}`}
      style={{ padding: 14, minWidth: 0, boxSizing: 'border-box' }}
      onClick={onClick}
    >
      {/* Meta + signal */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 8 }}>
        <div className="tc-meta" style={{ overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
          {fix.league.toUpperCase()} &nbsp;·&nbsp; {fix.kickoff} &nbsp;·&nbsp; {fix.venue.toUpperCase()}
        </div>
        <SignalBadge score={fix.signal} />
      </div>

      {/* Teams */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: 10,
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <div className="fix-team home" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <Kit team={fix.home} size={22} />
            <span style={{
              fontSize: 15, fontWeight: 500, letterSpacing: -0.2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0,
            }}>{home.name}</span>
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 6, marginLeft: 30 }}>
            {(home.form || []).map((r, i) => <FormPill key={i} result={r} />)}
          </div>
        </div>
        <div className="tc-meta" style={{ fontSize: 10, color: 'var(--t-faint)' }}>vs</div>
        <div className="fix-team away" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end', minWidth: 0 }}>
            <span style={{
              fontSize: 15, fontWeight: 500, letterSpacing: -0.2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0,
            }}>{away.name}</span>
            <Kit team={fix.away} size={22} />
          </div>
          <div style={{ display: 'flex', gap: 3, marginTop: 6, marginRight: 30, justifyContent: 'flex-end' }}>
            {(away.form || []).map((r, i) => <FormPill key={i} result={r} />)}
          </div>
        </div>
      </div>

      {/* Top angle inset */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        background: 'rgba(0,0,0,0.22)',
        borderRadius: 9,
        border: '0.5px solid var(--b-fai)',
      }}>
        <SafePill
          threshold={fix.topAngle.threshold}
          hits={parseInt(fix.topAngle.hits)}
          tier={fix.topAngle.tier}
          size="std"
          addable={leg}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="tc-body-em" style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {fix.topAngle.title}
          </div>
        </div>
        <Icon name="chevron-right" size={13} color="var(--t-hint)" />
      </div>
    </div>
  );
}

Object.assign(window, { FixturesList });
