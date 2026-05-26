// Fixture screen — handles 4 tabs: Overview, Team matrix, Player matrix, AI

function FixtureScreen({ fixtureId, initialTab = 'overview', onBack, onOpenBuilder, advanced, aiInitialFilled = false }) {
  const { FIXTURE_MCI_CRY, TEAMS } = window.DATA;
  // For now we only have MCI vs CRY fully populated
  const fixture = FIXTURE_MCI_CRY;
  const [tab, setTab] = React.useState(initialTab);
  const [window5, setWindow] = React.useState(5);

  const home = TEAMS[fixture.home];
  const away = TEAMS[fixture.away];

  return (
    <div className="tc-content fixture" style={{ paddingTop: 56 }}>
      {/* header row */}
      <div className="fix-header-row">
        <div className="left">
          <button className="icon-btn solo" onClick={onBack} aria-label="Back">
            <Icon name="chevron-left" size={18} />
          </button>
          <div className="tc-meta">
            {fixture.league.toUpperCase()} &nbsp;·&nbsp; SAT {fixture.kickoff}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          <button className="icon-btn" aria-label="Share fixture"><Icon name="share" size={14} /></button>
          <button className="icon-btn" aria-label="Bookmark"><Icon name="bookmark" size={14} /></button>
        </div>
      </div>

      {/* H1 fixture name */}
      <h1 className="tc-h1" style={{ marginTop: 6 }}>
        {home.name} <span style={{ color: 'var(--t-mut)' }}>vs</span> {away.name}
      </h1>

      {/* Tabs */}
      <div className="tabs">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'team', label: 'Team matrix' },
          { id: 'player', label: 'Player matrix' },
          { id: 'ai', label: 'AI' },
        ].map(t => (
          <div key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ marginTop: 24 }}>
        {tab === 'overview' && <OverviewTab fixture={fixture} onOpenBuilder={onOpenBuilder} />}
        {tab === 'team' && <TeamMatrixTab fixture={fixture} window5={window5} setWindow={setWindow} advanced={advanced} />}
        {tab === 'player' && <PlayerMatrixTab fixture={fixture} window5={window5} setWindow={setWindow} />}
        {tab === 'ai' && <AITab fixture={fixture} onOpenBuilder={onOpenBuilder} initialFilled={aiInitialFilled} />}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/* OVERVIEW TAB                                      */
/* ──────────────────────────────────────────────── */

function OverviewTab({ fixture, onOpenBuilder }) {
  const { TEAMS } = window.DATA;
  const home = TEAMS[fixture.home];
  const away = TEAMS[fixture.away];
  const slip = useSlip();

  return (
    <div className="fade-up">
      {/* Hero panel */}
      <div className="glass elev" style={{ padding: 20, marginBottom: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 12 }}>
          {/* home */}
          <div style={{ textAlign: 'center' }}>
            <Kit team={fixture.home} size={42} />
            <div style={{ fontSize: 18, fontWeight: 500, marginTop: 8, letterSpacing: -0.2 }}>{home.name}</div>
            <div className="tc-cap" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 0.3, marginTop: 4 }}>
              {fixture.homeRank}
            </div>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 10 }}>
              {fixture.homeForm.map((f, i) => <FormPill key={i} result={f} />)}
            </div>
          </div>
          {/* kickoff */}
          <div style={{ textAlign: 'center', minWidth: 90 }}>
            <div className="tc-meta" style={{ fontSize: 10 }}>KICKOFF</div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 27,
              fontWeight: 500,
              color: 'var(--amber-bright)',
              letterSpacing: 0.5,
              marginTop: 6,
              textShadow: '0 0 16px rgba(232,181,58,0.4)',
            }}>
              {fixture.kickoff}
            </div>
            <div className="tc-cap" style={{ marginTop: 4 }}>{fixture.venue}</div>
          </div>
          {/* away */}
          <div style={{ textAlign: 'center' }}>
            <Kit team={fixture.away} size={42} />
            <div style={{ fontSize: 18, fontWeight: 500, marginTop: 8, letterSpacing: -0.2 }}>{away.name}</div>
            <div className="tc-cap" style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 0.3, marginTop: 4 }}>
              {fixture.awayRank}
            </div>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 10 }}>
              {fixture.awayForm.map((f, i) => <FormPill key={i} result={f} />)}
            </div>
          </div>
        </div>

        {/* Win probability */}
        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '0.5px solid var(--b-def)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span className="tc-micro">WIN PROBABILITY</span>
            <span className="tc-micro" style={{ color: 'var(--t-faint)' }}>Model · L20</span>
          </div>
          <div className="winprob">
            <div className="seg home" style={{ flex: fixture.winProb.home }}>
              {`MCI ${fixture.winProb.home}%`}
            </div>
            <div className="seg draw" style={{ flex: fixture.winProb.draw }}>
              {`${fixture.winProb.draw}%`}
            </div>
            <div className="seg away" style={{ flex: fixture.winProb.away }}>
              {`${fixture.winProb.away}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Strongest angles */}
      <div className="section-head">
        <span className="tc-section-label engine">STRONGEST ANGLES</span>
        <span className="line" />
        <span className="meta">Last 5</span>
      </div>
      <div className="glass" style={{ overflow: 'hidden' }}>
        {fixture.strongestAngles.map((a, i) => {
          const leg = {
            id: `${fixture.id}::strongest::${i}`,
            fixtureId: fixture.id,
            threshold: a.threshold,
            hits: parseInt(a.hits),
            total: 5,
            tier: a.hits === '5/5' ? 'teal' : 'amber',
            title: a.title,
            reason: a.body,
          };
          const inSlip = slip.isInSlip(leg.id);
          return (
            <div
              className={`angle-row addable ${inSlip ? 'in-slip' : ''}`}
              key={i}
              onClick={() => slip.toggleLeg(leg)}
            >
              <SafePill addable={leg} threshold={a.threshold} hits={parseInt(a.hits)} tier="teal" />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tc-body-em">{a.title}</div>
                <div className="tc-cap" style={{ marginTop: 2, color: 'var(--t-mut)' }}>{a.body}</div>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 22, height: 22, borderRadius: 6,
                background: inSlip ? 'rgba(93,202,165,0.10)' : 'rgba(255,255,255,0.025)',
                border: `0.5px solid ${inSlip ? 'rgba(93,202,165,0.30)' : 'var(--b-def)'}`,
                color: inSlip ? 'var(--teal-bright)' : 'var(--t-mut)',
                flexShrink: 0,
              }}>
                <Icon name={inSlip ? 'check' : 'plus'} size={12} />
              </span>
            </div>
          );
        })}
      </div>

      {/* H2H + Referee row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        <div className="glass" style={{ padding: 14 }}>
          <div className="tc-micro">HEAD TO HEAD · LAST 5</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 10 }}>
            <span>
              <span style={{ fontSize: 24, fontWeight: 500, color: 'var(--amber-bright)' }}>{fixture.h2h.home}</span>
              <span className="tc-meta" style={{ marginLeft: 6 }}>MCI</span>
            </span>
            <span>
              <span className="tc-meta">CRY</span>
              <span style={{ fontSize: 24, fontWeight: 500, color: 'var(--t-mut)', marginLeft: 6 }}>{fixture.h2h.away}</span>
            </span>
          </div>
          <div style={{
            height: 4, marginTop: 8, borderRadius: 2,
            background: 'rgba(255,255,255,0.04)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              width: `${(fixture.h2h.home / (fixture.h2h.home + fixture.h2h.away)) * 100}%`,
              background: 'linear-gradient(90deg, var(--amber-deep), var(--amber-bright))',
              borderRadius: 2,
              boxShadow: '0 0 8px rgba(232,181,58,0.35)',
            }} />
          </div>
          <div className="tc-cap" style={{ marginTop: 8 }}>Last meeting · {fixture.h2h.last}</div>
        </div>
        <div className="glass" style={{ padding: 14 }}>
          <div className="tc-micro">REFEREE</div>
          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 10 }}>{fixture.referee.name}</div>
          <div className="tc-cap" style={{ marginTop: 2 }}>{fixture.referee.cpm} cards/match · {fixture.referee.homeWinPct}% home win</div>
          {fixture.referee.cardsAboveAvg && (
            <div style={{ marginTop: 10 }}>
              <span className="safe-pill amber" style={{ padding: '4px 9px' }}>
                <span className="v" style={{ fontSize: 11 }}>Cards above avg</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Build a builder */}
      <div className="glass elev" style={{ padding: 16, marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>Build a builder for this fixture</div>
            <div className="tc-cap" style={{ marginTop: 4, lineHeight: 1.5 }}>
              AI will suggest safe, balanced or higher-risk builders using the data on this page.
            </div>
          </div>
          <Icon name="sparkles" size={18} color="var(--amber-bright)" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 14 }}>
          <button className="tc-btn teal" onClick={() => onOpenBuilder('Safe')}>Safe</button>
          <button className="tc-btn amber" onClick={() => onOpenBuilder('Balanced')}>Balanced</button>
          <button className="tc-btn" onClick={() => onOpenBuilder('Higher risk')}>Higher risk</button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/* TEAM MATRIX TAB                                   */
/* ──────────────────────────────────────────────── */

function TeamMatrixTab({ fixture, window5, setWindow, advanced }) {
  const [openSelector, setOpenSelector] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);

  return (
    <div className="fade-up">
      <h2 className="tc-h2">Team matrix</h2>
      <p className="tc-body" style={{ color: 'var(--t-mut)', marginTop: 6 }}>
        Match-by-match research across the selected window. The threshold pill on each row shows the highest value the team hit in every fixture &mdash; a safe anchor for builder legs.
      </p>

      {/* Window selector */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginTop: 14, position: 'relative' }}>
        <div className="glass-select" onClick={() => setOpenSelector(o => !o)}>
          <span className="tc-micro" style={{ color: 'var(--t-hint)' }}>WINDOW</span>
          <span className="dot" />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Last {window5} matches</span>
          <Icon name="chevron-down" size={14} color="var(--t-mut)" style={{ marginLeft: 'auto' }} />
        </div>
        <div className="glass-select" style={{ paddingRight: 8 }}>
          <Icon name="filter" size={13} color="var(--t-mut)" />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Filters</span>
          <span className="safe-pill amber" style={{ padding: '2px 7px', minWidth: 'auto', borderRadius: 999 }}>
            <span className="v" style={{ fontSize: 10 }}>2</span>
          </span>
          <Icon name="chevron-down" size={13} color="var(--t-mut)" />
        </div>
        {openSelector && (
          <div className="glass elev" style={{
            position: 'absolute', top: '105%', left: 0, width: '100%', zIndex: 20,
            background: 'rgba(15,16,18,0.97)',
            backdropFilter: 'blur(20px)', padding: 6,
          }}>
            {[5, 10, 20, 'season'].map(w => (
              <div key={w}
                onClick={() => { setWindow(typeof w === 'number' ? w : 38); setOpenSelector(false); }}
                style={{
                  padding: '10px 12px', borderRadius: 8, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: (window5 === w || (w === 'season' && window5 === 38)) ? 'rgba(232,181,58,0.06)' : 'transparent',
                }}>
                <span style={{ fontSize: 13 }}>{typeof w === 'number' ? `Last ${w} matches` : 'Season'}</span>
                {(window5 === w || (w === 'season' && window5 === 38)) && <Icon name="check" size={14} color="var(--amber-bright)" />}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Matrix card */}
      <div className="glass elev" style={{ padding: '14px 14px 12px', marginTop: 16 }}>
        <div className="matrix-grid">
          <MatrixSide team={fixture.home} data={fixture.matrix.home} window5={window5} fixtureId={fixture.id} />
          <MatrixSide team={fixture.away} data={fixture.matrix.away} window5={window5} fixtureId={fixture.id} />
        </div>

        {/* Footer scroll hint */}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '0.5px solid var(--b-def)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--t-mut)', fontSize: 11 }}>
            <Icon name="arrows-h" size={13} color="var(--amber-bright)" />
            <span>Scroll to see fixtures 6&ndash;{window5 > 5 ? window5 : 12}</span>
          </div>
          <button onClick={() => setShowAll(s => !s)} style={{ background: 'none', border: 'none', color: 'var(--t-mut)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
            {showAll ? 'Show less' : 'Show all stats'} <Icon name={showAll ? 'chevron-up' : 'chevron-down'} size={13} />
          </button>
        </div>
      </div>

      {advanced && (
        <div className="glass" style={{ padding: 14, marginTop: 12 }}>
          <div className="tc-micro" style={{ marginBottom: 6 }}>ADVANCED · OPPONENT-ADJUSTED</div>
          <div className="tc-cap" style={{ color: 'var(--t-mut)', lineHeight: 1.5 }}>
            Adjusted values surface in advanced mode: opponent strength deltas, home/away splits, and rolling z-scores against league mean.
          </div>
        </div>
      )}
    </div>
  );
}

function MatrixSide({ team, data, window5, fixtureId }) {
  const { TEAMS } = window.DATA;
  const t = TEAMS[team];

  const cats = Object.entries(data.stats);

  return (
    <div className="matrix-side">
      {/* head */}
      <div className="head">
        <div className="team-name">
          <Kit team={team} size={18} />
          <span>{t.name}</span>
        </div>
        <div className="count">5 OF {Math.max(window5, 12)}</div>
      </div>

      {/* fixtures row + SAFE @ scorelines */}
      <div className="matrix-fixtures">
        <span className="corner">SAFE @</span>
        {data.fixtures.map((f, i) => (
          <div key={i} className="col">
            <span className="d">{f.date}</span>
            <span className="opp">
              <KitMini team={f.opp} />
              {f.opp}
            </span>
          </div>
        ))}
      </div>
      <div className="matrix-row" style={{ marginBottom: 16 }}>
        <span />
        {data.fixtures.map((f, i) => (
          <ScorePill key={i} result={`${f.result}${f.oppHome ? 'H' : 'A'}`} wdl={f.wdl} />
        ))}
      </div>

      {/* stat categories */}
      {cats.map(([catName, stats]) => (
        <div className="matrix-cat" key={catName}>
          <div className="cat-label">{catName}</div>
          {Object.entries(stats).map(([statName, stat]) => {
            const leg = {
              id: `${fixtureId}::team::${team}::${statName}`,
              fixtureId,
              threshold: stat.threshold || '—',
              hits: stat.hits,
              total: 5,
              tier: stat.threshold === '—' ? 'muted' : (stat.threshold && stat.threshold.startsWith('↓') ? 'amber' : 'teal'),
              title: `${t.name} ${statName.toLowerCase()}`,
              reason: `Threshold ${stat.threshold || '—'} hit in ${stat.hits} of 5 across L5`,
            };
            const isAddable = stat.threshold && stat.threshold !== '—';
            return (
              <div key={statName}>
                <div className="stat-name">{statName}</div>
                <div className="matrix-row">
                  <SafePill
                    threshold={stat.threshold || '—'}
                    hits={stat.hits}
                    tier={stat.threshold === '—' ? 'muted' : (stat.threshold && stat.threshold.startsWith('↓') ? 'amber' : 'teal')}
                    addable={isAddable ? leg : undefined}
                  />
                  {stat.values.map((v, i) => {
                    let cls = 'zero';
                    if (v > 0) {
                      if (stat.dir === 'lte' && stat.target) {
                        cls = v <= stat.target ? 'amber' : 'dim';
                      } else {
                        cls = 'amber';
                      }
                      if (v === 0) cls = 'zero';
                    }
                    return (
                      <div key={i} className={`matrix-cell ${cls}`}>{v}</div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/* PLAYER MATRIX TAB                                 */
/* ──────────────────────────────────────────────── */

function PlayerMatrixTab({ fixture, window5, setWindow }) {
  const sections = Object.keys(fixture.players);
  const [openMap, setOpenMap] = React.useState({ [sections[0]]: true });
  const toggle = (s) => setOpenMap(m => ({ ...m, [s]: !m[s] }));

  return (
    <div className="fade-up">
      <h2 className="tc-h2">Player matrix</h2>
      <p className="tc-body" style={{ color: 'var(--t-mut)', marginTop: 6 }}>
        Per-player match-by-match data across the selected window. The pill on each row shows the highest threshold each player has hit in every fixture &mdash; a safe anchor for player-prop builder legs.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginTop: 14 }}>
        <div className="glass-select">
          <span className="tc-micro" style={{ color: 'var(--t-hint)' }}>WINDOW</span>
          <span className="dot" />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Last {window5} matches</span>
          <Icon name="chevron-down" size={14} color="var(--t-mut)" style={{ marginLeft: 'auto' }} />
        </div>
        <div className="glass-select" style={{ paddingRight: 12 }}>
          <Icon name="filter" size={13} color="var(--t-mut)" />
          <span style={{ fontSize: 13, fontWeight: 500 }}>Filters</span>
          <Icon name="chevron-down" size={13} color="var(--t-mut)" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
        {sections.map((section) => (
          <PlayerSection
            key={section}
            section={section}
            data={fixture.players[section]}
            open={!!openMap[section]}
            onToggle={() => toggle(section)}
            fixture={fixture}
          />
        ))}
      </div>
    </div>
  );
}

function PlayerSection({ section, data, open, onToggle, fixture }) {
  return (
    <div className="glass" style={{ overflow: 'hidden' }}>
      <div className="tap-row" onClick={onToggle} style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 16px',
      }}>
        <span style={{ fontSize: 15, fontWeight: 500 }}>{section}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} color="var(--t-mut)" />
      </div>
      {open && (data.home.length > 0 || data.away.length > 0) && (
        <div style={{ padding: '0 16px 16px' }}>
          <PlayerSideTable side="home" team={fixture.home} rows={data.home} fixtureId={fixture.id} sectionName={section} />
          <PlayerSideTable side="away" team={fixture.away} rows={data.away} fixtureId={fixture.id} sectionName={section} />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
            <button style={{ background: 'none', border: 'none', color: 'var(--t-mut)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              Show more <Icon name="chevron-down" size={13} />
            </button>
          </div>
        </div>
      )}
      {open && data.home.length === 0 && data.away.length === 0 && (
        <div style={{ padding: '0 16px 16px' }}>
          <div className="tc-cap" style={{ color: 'var(--t-faint)' }}>No players hitting consistent thresholds for this stat in the selected window.</div>
        </div>
      )}
    </div>
  );
}

function PlayerSideTable({ side, team, rows, fixtureId, sectionName }) {
  const { TEAMS } = window.DATA;
  const slip = useSlip();
  const t = TEAMS[team];
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '0.5px solid var(--b-def)' }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</span>
        <span className="tc-micro" style={{ color: 'var(--t-hint)' }}>SAFE @ · LAST 5</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {rows.map((r, i) => {
          const isAddable = r.threshold && r.threshold !== '—';
          const hitsNum = parseInt(r.hits);
          const leg = isAddable ? {
            id: `${fixtureId}::player::${team}::${r.name}::${sectionName}`,
            fixtureId,
            threshold: r.threshold,
            hits: hitsNum,
            total: 5,
            tier: r.pillTier || (hitsNum === 5 ? 'teal' : 'amber'),
            title: `${r.name} ${(sectionName || '').toLowerCase().replace('player ', '')}`,
            reason: `Hit ${r.hits} across L5`,
          } : null;
          const inSlip = leg ? slip.isInSlip(leg.id) : false;
          const pillBg = !isAddable
            ? 'rgba(255,255,255,0.03)'
            : r.pillTier === 'teal'
              ? 'rgba(93,202,165,0.10)'
              : 'rgba(232,181,58,0.08)';
          const pillBorder = !isAddable
            ? 'var(--b-def)'
            : r.pillTier === 'teal'
              ? 'rgba(93,202,165,0.25)'
              : 'rgba(232,181,58,0.25)';
          const pillColor = !isAddable
            ? 'var(--t-hint)'
            : r.pillTier === 'teal'
              ? 'var(--teal-bright)'
              : 'var(--amber-bright)';
          return (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '28px 1fr auto auto',
              alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: i < rows.length - 1 ? '0.5px solid var(--b-fai)' : 'none',
            }}>
              <PlayerKit num={r.num} team={team} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</span>
              <span
                className={`safe-pill ${isAddable ? 'addable' : ''} ${inSlip ? 'in-slip' : ''}`}
                onClick={isAddable ? () => slip.toggleLeg(leg) : undefined}
                style={{
                  display: 'inline-flex', flexDirection: 'row', gap: 4, alignItems: 'center',
                  padding: '4px 8px', borderRadius: 6,
                  background: pillBg,
                  border: `0.5px solid ${pillBorder}`,
                  color: pillColor,
                  fontSize: 11,
                  boxShadow: r.pillTier === 'teal' ? '0 0 6px rgba(93,202,165,0.08)' : 'none',
                  cursor: isAddable ? 'pointer' : 'default',
                }}>
                <span style={{ fontWeight: 500 }}>{r.threshold}</span>
                <span style={{ opacity: 0.7, fontSize: 10 }}>{r.hits}</span>
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {r.values.map((v, j) => (
                  <PlayerValueCell key={j} v={v} highlight={v > 0} pillTier={r.pillTier} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlayerValueCell({ v, highlight, pillTier }) {
  if (v === 0) {
    return (
      <span style={{
        width: 22, height: 22, borderRadius: 4,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(255,255,255,0.02)',
        border: '0.5px solid var(--b-fai)',
        fontSize: 11, color: 'var(--t-faint)',
        fontFamily: 'var(--font-mono)',
      }}>0</span>
    );
  }
  return (
    <span style={{
      width: 22, height: 22, borderRadius: 4,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(180deg, rgba(232,181,58,0.18) 0%, rgba(232,181,58,0.08) 100%)',
      border: '0.5px solid rgba(232,181,58,0.30)',
      fontSize: 11, color: 'var(--amber-bright)',
      fontWeight: 500,
      fontFamily: 'var(--font-mono)',
      boxShadow: '0 0 4px rgba(232,181,58,0.10)',
    }}>{v}</span>
  );
}

/* ──────────────────────────────────────────────── */
/* AI TAB                                            */
/* ──────────────────────────────────────────────── */

function AITab({ fixture, onOpenBuilder, initialFilled = false }) {
  const [legCount, setLegCount] = React.useState(3);
  const [risk, setRisk] = React.useState('Safe');
  const [generated, setGenerated] = React.useState(initialFilled);
  const [generating, setGenerating] = React.useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 900);
  };

  const handleReset = () => {
    setGenerated(false);
  };

  return (
    <div className="fade-up">
      {/* ── Fixture Preview ─────────────────── */}
      <div className="glass elev" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <AISparkle />
          <span style={{ fontSize: 15, fontWeight: 500 }}>Fixture Preview</span>
        </div>
        <div className="tc-body" style={{ color: 'var(--t-sec)', lineHeight: 1.65 }}>
          <p style={{ margin: 0 }}>
            <span style={{ color: 'var(--t-pri)', fontWeight: 500 }}>Man City</span> arrive on a five-match unbeaten run with
            scoring patterns holding deep — 2+ goals in every fixture of the L5 window, paired with a corner floor of eight
            against teams that defend low. <span style={{ color: 'var(--t-pri)', fontWeight: 500 }}>Crystal Palace</span> sit
            15th and have lost three on the spin, all on the road. Their attacking returns are uneven, but they hit
            <span style={{ color: 'var(--teal-bright)' }}> 1+ SOT</span> in every fixture and have averaged 5+ fouls suffered
            against top-six opponents.
          </p>
          <p style={{ margin: '12px 0 0' }}>
            The dominant pattern is{' '}
            <span style={{ color: 'var(--amber-bright)', fontWeight: 500 }}>City corners 8+</span>, holding for the full L20
            window. Palace concede a deep block and Doku/B Silva attract repeated fouls in wide areas — both engines for the
            corner count.{' '}
            <span style={{ color: 'var(--amber-bright)', fontWeight: 500 }}>Haaland SOT 1+</span> is the cleanest player
            anchor, hit in 5/5 with 2+ in three of those.
          </p>
          <p style={{ margin: '12px 0 0' }}>
            Referee <span style={{ color: 'var(--t-pri)', fontWeight: 500 }}>Michael Oliver</span> sits above league average
            at 4.2 cards/match with a 38% home-win lean. That opens a discipline angle alongside the attack-led legs without
            relying on it.
          </p>
          <p style={{ margin: '12px 0 0' }}>
            Floors look strongest at: goals over 2.5, City corners 8+, Haaland SOT 1+, and Doku 1+ foul committed. These are
            historical tendencies, not predictions.
          </p>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginTop: 14, paddingTop: 12, borderTop: '0.5px solid var(--b-def)',
        }}>
          <Icon name="info" size={11} color="var(--t-faint)" />
          <span className="tc-cap" style={{ fontSize: 10, color: 'var(--t-faint)' }}>
            Refreshes hourly &middot; last update 06:00
          </span>
        </div>
      </div>

      {/* ── Suggested Builder ─────────────────── */}
      <div className="glass elev" style={{ padding: 16, marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <AISparkle />
          <span style={{ fontSize: 15, fontWeight: 500 }}>Suggested Builder</span>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Leg count */}
          <div>
            <div className="tc-micro" style={{ marginBottom: 6 }}>LEG COUNT</div>
            <div className="seg-control">
              {[2,3,4,5,6].map(n => (
                <button
                  key={n}
                  className={`seg-btn ${legCount === n ? 'active amber' : ''}`}
                  onClick={() => { setLegCount(n); if (generated) handleReset(); }}
                >{n}</button>
              ))}
            </div>
          </div>

          {/* Risk tier */}
          <div>
            <div className="tc-micro" style={{ marginBottom: 6 }}>RISK TIER</div>
            <div className="seg-control" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {['Safe', 'Balanced'].map(t => (
                <button
                  key={t}
                  className={`seg-btn ${risk === t ? (t === 'Safe' ? 'active teal' : 'active amber') : ''}`}
                  onClick={() => { setRisk(t); if (generated) handleReset(); }}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            className="tc-btn amber"
            onClick={handleGenerate}
            disabled={generating}
            style={{
              padding: '13px 18px', fontSize: 14, width: '100%',
              opacity: generating ? 0.6 : 1,
            }}
          >
            {generating ? (
              <>
                <span className="dot-loader"><span /><span /><span /></span>
                Building…
              </>
            ) : (
              <>
                <Icon name="sparkles" size={14} />
                {generated ? 'Regenerate builder' : 'Generate builder'}
              </>
            )}
          </button>
        </div>

        {/* Result area */}
        {generated && !generating && (
          <BuilderResultBlock legCount={legCount} risk={risk} onSaveToBuilders={() => onOpenBuilder(risk)} />
        )}
      </div>

      {/* ── Fixture Intel (coming soon) ─────────────────── */}
      <div className="glass" style={{ padding: 16, marginTop: 14, opacity: 0.75 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--t-mut)' }}>Fixture Intel</span>
          <span className="signal-badge low" style={{ fontSize: 9 }}>AVAILABLE SOON</span>
        </div>
        <div className="tc-cap" style={{ marginBottom: 14 }}>
          Cross-fixture context: line-up changes, injury alerts, weather, opponent-adjusted form.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[60, 80, 70].map((w, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 0',
              borderBottom: i < 2 ? '0.5px solid var(--b-fai)' : 'none',
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 5,
                background: 'rgba(255,255,255,0.025)',
                border: '0.5px solid var(--b-fai)',
                flexShrink: 0,
              }} />
              <span style={{
                height: 7, borderRadius: 3,
                background: 'rgba(255,255,255,0.04)',
                width: `${w}%`,
              }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AISparkle() {
  return (
    <div style={{
      width: 24, height: 24, borderRadius: 6,
      background: 'linear-gradient(135deg, rgba(232,181,58,0.20), rgba(15,110,86,0.20))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '0.5px solid rgba(232,181,58,0.30)',
      boxShadow: '0 0 10px rgba(232,181,58,0.10)',
      flexShrink: 0,
    }}>
      <Icon name="sparkles" size={12} color="var(--amber-bright)" />
    </div>
  );
}

function BuilderResultBlock({ legCount, risk, onSaveToBuilders }) {
  // Pool of legs we can pick from based on risk
  const safePool = [
    { title: 'Match over 2.5 goals',    threshold: '2.5+', hits: 5, total: 5, reason: 'City scoring 2+ in 5/5; Palace conceding 2+ in 4/5' },
    { title: 'City corners 8 or more',  threshold: '8+',   hits: 5, total: 5, reason: 'Floor of 8 across L5; Palace defends deep' },
    { title: 'Haaland shot on target',  threshold: '1+',   hits: 5, total: 5, reason: '1+ SOT every fixture; 2+ in 3 of L5' },
    { title: 'Doku committed foul',     threshold: '1+',   hits: 5, total: 5, reason: 'High carrier, attracts contact; 1+ in 5/5' },
    { title: 'BTTS — yes',              threshold: 'BTTS', hits: 4, total: 5, reason: 'Both teams scored in 4/5 recent matchups' },
    { title: 'City SOT 4 or more',      threshold: '4+',   hits: 5, total: 5, reason: 'L5 floor of 4 SOT; consistent attack volume' },
  ];
  const balancedPool = [
    ...safePool,
    { title: 'Cards over 4.5',          threshold: '↑4.5', hits: 4, total: 5, reason: 'Oliver 4.2 cards/match; both squads tackle high' },
    { title: 'Doku 2+ shots',           threshold: '2+',   hits: 4, total: 5, reason: 'Ramping role; 2.2 shot avg in L5' },
    { title: 'Combined corners 10+',    threshold: '10+',  hits: 4, total: 5, reason: 'City 10 avg, Palace 5; combined floor sticky' },
  ];

  const pool = risk === 'Safe' ? safePool : balancedPool;
  const legs = pool.slice(0, legCount);

  // Combined implied probability — multiply individual hit rates (illustrative)
  const combinedProb = legs.reduce((p, l) => p * (l.hits / l.total), 1);
  const combinedPct = Math.round(combinedProb * 100);

  return (
    <div className="fade-up" style={{
      marginTop: 16,
      paddingTop: 16,
      borderTop: '0.5px solid var(--b-def)',
    }}>
      {/* Legs list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {legs.map((leg, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 12px',
            background: 'rgba(0,0,0,0.22)',
            border: '0.5px solid var(--b-fai)',
            borderRadius: 10,
          }}>
            <SafePill
              threshold={leg.threshold}
              hits={leg.hits}
              total={leg.total}
              tier={leg.hits === leg.total ? 'teal' : 'amber'}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tc-body-em" style={{ fontSize: 12.5 }}>{leg.title}</div>
              <div className="tc-cap" style={{ marginTop: 2, color: 'var(--t-mut)', lineHeight: 1.45 }}>{leg.reason}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Combined probability stat */}
      <div style={{
        display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
        marginTop: 14, paddingTop: 14, borderTop: '0.5px solid var(--b-def)',
        gap: 12,
      }}>
        <div>
          <div className="tc-micro" style={{ fontSize: 9 }}>COMBINED IMPLIED PROBABILITY</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 500,
            color: 'var(--teal-bright)', textShadow: '0 0 14px rgba(93,202,165,0.30)',
            marginTop: 4,
          }}>
            {combinedPct}%
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="tc-micro" style={{ fontSize: 9 }}>LEGS</div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 500,
            color: 'var(--t-pri)', marginTop: 4,
          }}>
            {legs.length} &middot; {risk}
          </div>
        </div>
      </div>

      {/* Caveat */}
      <div style={{
        marginTop: 12, paddingTop: 10, borderTop: '0.5px dashed rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'flex-start', gap: 6,
      }}>
        <Icon name="info" size={11} color="var(--t-faint)" />
        <span className="tc-cap" style={{ fontSize: 10, color: 'var(--t-faint)', lineHeight: 1.5 }}>
          Built from patterns hitting 4/5 or higher &middot; historical consistency only, not a future prediction.
        </span>
      </div>

      {/* Save CTA */}
      <button
        className="tc-btn"
        onClick={onSaveToBuilders}
        style={{ marginTop: 14, width: '100%', padding: '11px 14px', fontSize: 13 }}
      >
        <Icon name="bookmark" size={13} />
        Save to Builders
      </button>
    </div>
  );
}

function AIBuilderCard({ tier, title, odds, body, onOpen }) {
  const color = tier === 'teal' ? 'var(--teal-bright)' : tier === 'amber' ? 'var(--amber-bright)' : 'var(--t-mut)';
  return (
    <div className="glass tap-row" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }} onClick={onOpen}>
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: tier === 'teal' ? 'rgba(93,202,165,0.08)' : tier === 'amber' ? 'rgba(232,181,58,0.08)' : 'rgba(255,255,255,0.03)',
        border: `0.5px solid ${tier === 'teal' ? 'rgba(93,202,165,0.25)' : tier === 'amber' ? 'rgba(232,181,58,0.25)' : 'var(--b-def)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, fontWeight: 500, color, fontFamily: 'var(--font-mono)' }}>{odds}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="tc-body-em">{title}</div>
        <div className="tc-cap" style={{ marginTop: 2 }}>{body}</div>
      </div>
      <Icon name="arrow-right" size={14} color={color} />
    </div>
  );
}

Object.assign(window, { FixtureScreen });
