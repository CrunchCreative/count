// Builders tab + Builder detail + Performance sub-page

function BuildersTab({ onOpenFixture, onBack }) {
  const slip = useSlip();
  const initialFilter = slip.builders.some(b => b.status === 'pending') ? 'open' : 'all';
  const [filter, setFilter] = React.useState(initialFilter);
  const [openBuilderId, setOpenBuilderId] = React.useState(null);
  const [openPerformance, setOpenPerformance] = React.useState(false);

  // Performance sub-page
  if (openPerformance) {
    return <PerformancePage onBack={() => setOpenPerformance(false)} />;
  }

  // Detail view
  if (openBuilderId) {
    const builder = slip.builders.find(b => b.id === openBuilderId);
    if (!builder) {
      setOpenBuilderId(null);
      return null;
    }
    return (
      <BuilderDetail
        builder={builder}
        onBack={() => setOpenBuilderId(null)}
        onOpenFixture={onOpenFixture}
      />
    );
  }

  // ─── Empty state ───
  if (slip.builders.length === 0) {
    return (
      <div className="tc-content fade-up" style={{ paddingTop: 60 }}>
        <BuildersHeader />
        <BuildersEmptyState />
      </div>
    );
  }

  const settled = slip.builders.filter(b => b.status !== 'pending');
  const open = slip.builders.filter(b => b.status === 'pending');
  const wonCount = settled.filter(b => b.status === 'won').length;
  const lostCount = settled.filter(b => b.status === 'lost').length;

  // Compute filter counts
  const filtered = slip.builders.filter(b => {
    if (filter === 'open') return b.status === 'pending';
    if (filter === 'settled') return b.status !== 'pending';
    return true;
  });

  // Sort: open first (most recent), then settled most-recent first
  filtered.sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (b.status === 'pending' && a.status !== 'pending') return 1;
    return new Date(b.savedAt) - new Date(a.savedAt);
  });

  return (
    <div className="tc-content fade-up" style={{ paddingTop: 60 }}>
      <BuildersHeader />

      {/* Performance summary card */}
      {settled.length > 0 && (
        <PerformanceSummary
          settled={settled}
          wonCount={wonCount}
          allBuilders={slip.builders}
          onViewFull={() => setOpenPerformance(true)}
        />
      )}

      {/* Filter strip */}
      <div className="seg-control" style={{
        marginTop: settled.length > 0 ? 18 : 22,
        gridTemplateColumns: 'repeat(3, 1fr)',
      }}>
        {[
          { id: 'open',    label: 'Open',    count: open.length },
          { id: 'settled', label: 'Settled', count: settled.length },
          { id: 'all',     label: 'All',     count: slip.builders.length },
        ].map(t => (
          <button
            key={t.id}
            className={`seg-btn ${filter === t.id ? 'active teal' : ''}`}
            onClick={() => setFilter(t.id)}
          >
            {t.label}
            <span style={{
              marginLeft: 5, fontSize: 10, fontFamily: 'var(--font-mono)',
              opacity: 0.65,
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* Builders list */}
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div className="glass" style={{ padding: 28, textAlign: 'center' }}>
            <div className="tc-cap" style={{ color: 'var(--t-mut)' }}>
              No {filter === 'open' ? 'open' : filter === 'settled' ? 'settled' : ''} builders to show.
            </div>
          </div>
        ) : (
          filtered.map(b => (
            <BuilderCard key={b.id} builder={b} onOpen={() => setOpenBuilderId(b.id)} />
          ))
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   HEADER
   ──────────────────────────────────────────────── */

function BuildersHeader() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
      <div>
        <h1 className="tc-h1">Builders</h1>
        <p className="tc-body" style={{ color: 'var(--t-mut)', marginTop: 6 }}>
          Your research, tracked.
        </p>
      </div>
      <button className="icon-btn" aria-label="Filter and sort">
        <Icon name="filter" size={15} />
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────
   PERFORMANCE SUMMARY (3 numbers + link)
   ──────────────────────────────────────────────── */

function PerformanceSummary({ settled, wonCount, allBuilders, onViewFull }) {
  const winRate = settled.length > 0 ? Math.round((wonCount / settled.length) * 100) : 0;

  // Compute current streak — looking at settled builders by date desc
  const settledDesc = [...settled].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  let streak = 0;
  let streakType = settledDesc[0]?.status;
  for (const b of settledDesc) {
    if (b.status === streakType) streak += 1;
    else break;
  }
  const streakLabel = streakType === 'won'
    ? `${streak} win${streak !== 1 ? 's' : ''}`
    : `${streak} loss${streak !== 1 ? 'es' : ''}`;
  const streakColor = streakType === 'won' ? 'var(--teal-bright)' : 'var(--t-mut)';

  return (
    <div className="glass elev" style={{ padding: 16, marginTop: 22 }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 12,
      }}>
        <SummaryStat
          label="Settled"
          value={settled.length}
        />
        <SummaryStat
          label="Win rate"
          value={`${winRate}%`}
          sub="Last 30 days"
          color={winRate >= 50 ? 'var(--teal-bright)' : 'var(--t-pri)'}
          glow={winRate >= 50 ? 'rgba(93,202,165,0.30)' : 'transparent'}
        />
        <SummaryStat
          label="Streak"
          value={streakLabel}
          color={streakColor}
          glow={streakType === 'won' ? 'rgba(93,202,165,0.30)' : 'transparent'}
        />
      </div>

      <div
        className="tap-row"
        onClick={onViewFull}
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: '0.5px solid var(--b-def)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--amber-bright)' }}>
          View full performance
        </span>
        <Icon name="arrow-right" size={14} color="var(--amber-bright)" />
      </div>
    </div>
  );
}

function SummaryStat({ label, value, sub, color = 'var(--t-pri)', glow = 'transparent' }) {
  return (
    <div>
      <div className="tc-micro" style={{ fontSize: 9 }}>{label.toUpperCase()}</div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 22,
        fontWeight: 500,
        color,
        marginTop: 4,
        textShadow: glow !== 'transparent' ? `0 0 14px ${glow}` : 'none',
        lineHeight: 1.1,
      }}>
        {value}
      </div>
      {sub && (
        <div className="tc-cap" style={{ marginTop: 2, fontSize: 10 }}>{sub}</div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────
   BUILDER CARD
   ──────────────────────────────────────────────── */

function BuilderCard({ builder, onOpen }) {
  const { TEAMS, FIXTURES_ALL } = window.DATA;

  // Fixture lookup
  const fixtureMap = {};
  Object.entries(FIXTURES_ALL).forEach(([league, fixtures]) => {
    fixtures.forEach(f => { fixtureMap[f.id] = { ...f, league }; });
  });

  const fixtureIds = [...new Set(builder.legs.map(l => l.fixtureId))];

  // Unique team codes
  const teamCodes = [];
  fixtureIds.forEach(fid => {
    const f = fixtureMap[fid];
    if (f) {
      if (!teamCodes.includes(f.home)) teamCodes.push(f.home);
      if (!teamCodes.includes(f.away)) teamCodes.push(f.away);
    }
  });

  const dateStr = new Date(builder.savedAt).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric',
  });

  const statusConfig = {
    pending: { label: 'Pending', cls: 'pending' },
    won:     { label: 'Won',     cls: 'won' },
    lost:    { label: 'Lost',    cls: 'lost' },
  };
  const sc = statusConfig[builder.status] || statusConfig.pending;

  return (
    <div className="glass tap-row" style={{ padding: 14 }} onClick={onOpen}>
      {/* Top row: name + status pill */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10,
        marginBottom: 4,
      }}>
        <h3 className="tc-h3" style={{ minWidth: 0, flex: 1, fontSize: 15 }}>{builder.name}</h3>
        <span className={`status-pill ${sc.cls}`}>{sc.label}</span>
      </div>

      {/* Meta line */}
      <div className="tc-cap" style={{ marginBottom: 10 }}>
        {builder.legs.length} leg{builder.legs.length !== 1 ? 's' : ''} ·{' '}
        {fixtureIds.length} fixture{fixtureIds.length !== 1 ? 's' : ''} ·{' '}
        <span style={{ color: 'var(--t-faint)' }}>{dateStr}</span>
      </div>

      {/* Team kits */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
        marginBottom: 10,
      }}>
        {teamCodes.slice(0, 10).map((code, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
            <Kit team={code} size={18} />
            <span className="tc-cap" style={{
              fontSize: 10, color: 'var(--t-mut)',
              fontFamily: 'var(--font-mono)', letterSpacing: 0.3,
            }}>{code}</span>
          </span>
        ))}
        {teamCodes.length > 10 && (
          <span className="tc-cap" style={{ color: 'var(--t-hint)' }}>+{teamCodes.length - 10}</span>
        )}
      </div>

      {/* Leg preview strip (thresholds only) */}
      <div className="leg-strip">
        {builder.legs.map((l, i) => {
          // Tier override for settled builders to reflect actual outcome
          let pillCls = `safe-pill ${l.tier || 'teal'}`;
          if (builder.status !== 'pending' && l.legStatus === 'lost') {
            pillCls = 'safe-pill leg-strip-lost';
          }
          return (
            <span key={i} className={pillCls} style={{ padding: '4px 8px' }}>
              <span className="v" style={{ fontSize: 11 }}>{l.threshold}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   EMPTY STATE
   ──────────────────────────────────────────────── */

function BuildersEmptyState() {
  return (
    <div style={{
      marginTop: 60,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      padding: '0 12px',
    }}>
      <div style={{
        width: 64, height: 64,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.025)',
        border: '0.5px solid var(--b-def)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 0.5px rgba(232,181,58,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
      }}>
        <Icon name="layers" size={28} color="var(--t-hint)" />
      </div>
      <h3 className="tc-h2" style={{ fontSize: 18 }}>No builders yet</h3>
      <p className="tc-body" style={{
        color: 'var(--t-mut)', marginTop: 8, maxWidth: 280, lineHeight: 1.55,
      }}>
        Tap any angle in the app to start your first one.
      </p>

      {/* Example illustration */}
      <div className="glass" style={{
        marginTop: 26,
        padding: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <span className="safe-pill teal addable" style={{ position: 'relative' }}>
          <span className="v">8+</span>
          <span className="r">5/5</span>
          <span style={{
            position: 'absolute',
            top: -3, right: -3,
            width: 14, height: 14, borderRadius: '50%',
            background: 'var(--amber-bright)',
            border: '0.5px solid var(--bg-page)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#1A1408', fontWeight: 600, fontSize: 11, lineHeight: 1,
            boxShadow: '0 0 8px rgba(232,181,58,0.5)',
          }}>+</span>
        </span>
        <Icon name="arrow-right" size={14} color="var(--t-hint)" />
        <div style={{ flex: 1, textAlign: 'left' }}>
          <div style={{ fontSize: 12, fontWeight: 500 }}>Tap a Safe @ pill</div>
          <div className="tc-cap" style={{ marginTop: 2 }}>It lands in your slip</div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   BUILDER DETAIL
   ──────────────────────────────────────────────── */

function BuilderDetail({ builder, onBack, onOpenFixture }) {
  const slip = useSlip();
  const { TEAMS, FIXTURES_ALL } = window.DATA;

  const fixtureMap = {};
  Object.entries(FIXTURES_ALL).forEach(([league, fixtures]) => {
    fixtures.forEach(f => { fixtureMap[f.id] = { ...f, league }; });
  });

  // Group legs by fixture (preserve original order)
  const groups = {};
  const groupOrder = [];
  builder.legs.forEach(leg => {
    if (!groups[leg.fixtureId]) {
      groups[leg.fixtureId] = [];
      groupOrder.push(leg.fixtureId);
    }
    groups[leg.fixtureId].push(leg);
  });

  const dateStr = new Date(builder.savedAt).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'short',
  });

  const statusConfig = {
    pending: { label: 'Pending', cls: 'pending' },
    won:     { label: 'Won',     cls: 'won' },
    lost:    { label: 'Lost',    cls: 'lost' },
  };
  const sc = statusConfig[builder.status] || statusConfig.pending;

  // Outcome summary for settled
  const hitCount = builder.legs.filter(l => l.legStatus === 'won').length;
  const totalCount = builder.legs.length;
  const outcomeText = builder.status === 'pending'
    ? null
    : builder.status === 'won'
      ? 'All legs hit · builder won'
      : `${hitCount} of ${totalCount} legs hit · builder lost`;

  const [copyTip, setCopyTip] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleCopy = () => {
    const text = `${builder.name}\n\n` +
      groupOrder.map(fid => {
        const f = fixtureMap[fid];
        const home = TEAMS[f?.home];
        const away = TEAMS[f?.away];
        return `${f?.league} · ${f?.kickoff} · ${home?.name} vs ${away?.name}\n` +
          groups[fid].map(l => `  · ${l.threshold} ${l.title} (${l.hits}/${l.total || 5}) ${l.legStatus === 'won' ? '✓' : l.legStatus === 'lost' ? '✗' : ''}`).join('\n');
      }).join('\n\n');
    if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
    setCopyTip(true);
    setTimeout(() => setCopyTip(false), 1500);
  };

  const handleDuplicate = () => {
    slip.loadBuilderToSlip(builder);
    slip.setSheetOpen(true);
    onBack();
  };

  const handleDelete = () => {
    slip.deleteBuilder(builder.id);
    onBack();
  };

  return (
    <div className="tc-content fixture fade-up" style={{ paddingTop: 56, paddingBottom: 200 }}>
      {/* Header row */}
      <div className="fix-header-row">
        <div className="left">
          <button className="icon-btn solo" onClick={onBack}>
            <Icon name="chevron-left" size={18} />
          </button>
          <div className="tc-meta">BUILDER · {dateStr.toUpperCase()}</div>
        </div>
        <div style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setMenuOpen(o => !o)} aria-label="More">
            <Icon name="more" size={14} />
          </button>
          {menuOpen && (
            <>
              <div
                onClick={() => setMenuOpen(false)}
                style={{ position: 'fixed', inset: 0, zIndex: 50 }}
              />
              <div className="glass elev" style={{
                position: 'absolute',
                top: 38, right: 0,
                zIndex: 60,
                background: 'rgba(15,16,18,0.97)',
                backdropFilter: 'blur(20px)',
                padding: 6,
                minWidth: 160,
              }}>
                <div
                  className="tap-row"
                  onClick={handleDelete}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 8,
                    display: 'flex', alignItems: 'center', gap: 8,
                    color: '#F09595', fontSize: 13,
                  }}
                >
                  <Icon name="trash" size={13} />
                  Delete builder
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Name + status */}
      <h1 className="tc-h1" style={{ marginTop: 4 }}>{builder.name}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <span className={`status-pill ${sc.cls}`}>{sc.label}</span>
        <span className="tc-cap">
          {builder.legs.length} leg{builder.legs.length !== 1 ? 's' : ''} ·{' '}
          {Object.keys(groups).length} fixture{Object.keys(groups).length !== 1 ? 's' : ''}
          {builder.riskTier && <> · {builder.riskTier}</>}
        </span>
      </div>

      {/* Outcome summary for settled */}
      {outcomeText && (
        <div className="glass elev" style={{
          padding: '14px 16px',
          marginTop: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: builder.status === 'won'
            ? 'linear-gradient(180deg, rgba(93,202,165,0.10) 0%, rgba(93,202,165,0.03) 100%)'
            : 'linear-gradient(180deg, rgba(180,55,55,0.10) 0%, rgba(180,55,55,0.03) 100%)',
          boxShadow: builder.status === 'won'
            ? 'inset 0 1px 0 rgba(93,202,165,0.18), 0 0 0 0.5px rgba(93,202,165,0.30), 0 1px 24px rgba(93,202,165,0.06)'
            : 'inset 0 1px 0 rgba(180,55,55,0.18), 0 0 0 0.5px rgba(180,55,55,0.30), 0 1px 24px rgba(180,55,55,0.06)',
        }}>
          <Icon
            name={builder.status === 'won' ? 'check-circle' : 'x-circle'}
            size={18}
            color={builder.status === 'won' ? 'var(--teal-bright)' : '#F09595'}
          />
          <span style={{
            fontSize: 13, fontWeight: 500,
            color: builder.status === 'won' ? 'var(--teal-bright)' : '#F09595',
          }}>
            {outcomeText}
          </span>
        </div>
      )}

      {copyTip && (
        <div style={{
          marginTop: 12, padding: '8px 12px',
          background: 'rgba(93,202,165,0.10)',
          border: '0.5px solid rgba(93,202,165,0.25)',
          borderRadius: 8,
          fontSize: 12, color: 'var(--teal-bright)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <Icon name="check" size={12} />
          Copied to clipboard
        </div>
      )}

      {/* Legs grouped by fixture */}
      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {groupOrder.map(fid => {
          const f = fixtureMap[fid];
          if (!f) return null;
          const home = TEAMS[f.home];
          const away = TEAMS[f.away];
          return (
            <div key={fid}>
              {/* Fixture section header */}
              <div className="tc-meta" style={{ marginBottom: 8 }}>
                {f.league.toUpperCase()} · {f.kickoff} · {f.venue.toUpperCase()}
              </div>
              <div
                className="tap-row"
                onClick={() => onOpenFixture(fid)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: 10,
                  gap: 8,
                  borderBottom: '0.5px solid var(--b-def)',
                  marginBottom: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <Kit team={f.home} size={18} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{home.name}</span>
                  <span className="tc-meta" style={{ fontSize: 10 }}>vs</span>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{away.name}</span>
                  <Kit team={f.away} size={18} />
                </div>
                <Icon name="chevron-right" size={13} color="var(--t-hint)" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {groups[fid].map(leg => (
                  <LegRow key={leg.id} leg={leg} builderStatus={builder.status} fixture={f} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom action bar */}
      <div className="builder-action-bar">
        <button className="tc-btn" onClick={handleCopy}>
          <Icon name="copy" size={13} />
          Copy as text
        </button>
        <button className="tc-btn">
          <Icon name="share" size={13} />
          Share
        </button>
        <button className="tc-btn amber" onClick={handleDuplicate}>
          <Icon name="duplicate" size={13} />
          Duplicate
        </button>
      </div>
    </div>
  );
}

function LegRow({ leg, builderStatus, fixture }) {
  const isSettled = builderStatus !== 'pending';
  const won = leg.legStatus === 'won';
  const lost = leg.legStatus === 'lost';

  // Time until fixture starts (mock — for pending legs)
  // For canvas/seed data, just show "Sat 17:30" style label
  const timeUntil = `${fixture.kickoff} kick-off`;

  return (
    <div className="glass" style={{
      padding: 12,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      opacity: lost ? 0.78 : 1,
    }}>
      <SafePill
        threshold={leg.threshold}
        hits={leg.hits}
        total={leg.total || 5}
        tier={leg.tier}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="tc-body-em" style={{ fontSize: 13 }}>{leg.title}</div>
        {leg.reason && (
          <div className="tc-cap" style={{ marginTop: 2, color: 'var(--t-mut)' }}>{leg.reason}</div>
        )}
      </div>

      {/* Outcome / time-until indicator */}
      {!isSettled ? (
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div className="tc-micro" style={{ fontSize: 9, color: 'var(--t-faint)' }}>STARTS</div>
          <div className="tc-cap" style={{ fontSize: 11, color: 'var(--t-mut)', marginTop: 2 }}>{timeUntil}</div>
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 4,
          flexShrink: 0,
          maxWidth: 110,
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22, height: 22, borderRadius: 6,
            background: won ? 'rgba(93,202,165,0.12)' : 'rgba(180,55,55,0.12)',
            border: `0.5px solid ${won ? 'rgba(93,202,165,0.30)' : 'rgba(180,55,55,0.30)'}`,
            color: won ? 'var(--teal-bright)' : '#F09595',
            boxShadow: won ? '0 0 6px rgba(93,202,165,0.20)' : '0 0 6px rgba(180,55,55,0.20)',
          }}>
            <Icon name={won ? 'check' : 'x'} size={12} />
          </span>
          {leg.actualResult && (
            <span className="tc-cap" style={{
              fontSize: 10,
              color: won ? 'var(--teal-bright)' : '#F09595',
              textAlign: 'right',
              lineHeight: 1.3,
              opacity: 0.85,
            }}>{leg.actualResult}</span>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────
   PERFORMANCE SUB-PAGE
   ──────────────────────────────────────────────── */

function PerformancePage({ onBack }) {
  const slip = useSlip();
  const P = window.PERFORMANCE_DATA;

  const settled = slip.builders.filter(b => b.status !== 'pending');
  const total = settled.length;
  const wins = settled.filter(b => b.status === 'won').length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  const avgLegs = total > 0
    ? (settled.reduce((s, b) => s + b.legs.length, 0) / total).toFixed(1)
    : '0';

  // Best streak — find longest run of wins
  const sortedAsc = [...settled].sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt));
  let bestStreak = 0, run = 0;
  for (const b of sortedAsc) {
    if (b.status === 'won') { run += 1; bestStreak = Math.max(bestStreak, run); }
    else run = 0;
  }

  return (
    <div className="tc-content fixture fade-up" style={{ paddingTop: 56, paddingBottom: 200 }}>
      <div className="fix-header-row">
        <div className="left">
          <button className="icon-btn solo" onClick={onBack}>
            <Icon name="chevron-left" size={18} />
          </button>
          <div className="tc-meta">BUILDERS</div>
        </div>
      </div>

      <h1 className="tc-h1" style={{ marginTop: 4 }}>Performance</h1>
      <p className="tc-body" style={{ color: 'var(--t-mut)', marginTop: 6 }}>
        Your research, settled and analysed.
      </p>

      {/* Overall stats — 2×2 grid */}
      <div className="glass elev" style={{ padding: 16, marginTop: 22 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          rowGap: 18,
          columnGap: 16,
        }}>
          <BigStat label="Total settled" value={total} sub="across 6 months" />
          <BigStat
            label="Win rate"
            value={`${winRate}%`}
            sub="all time"
            color={winRate >= 50 ? 'var(--teal-bright)' : 'var(--t-pri)'}
            glow={winRate >= 50 ? 'rgba(93,202,165,0.35)' : 'transparent'}
          />
          <BigStat label="Avg legs / builder" value={avgLegs} sub="per saved build" />
          <BigStat
            label="Best streak"
            value={`${bestStreak} wins`}
            sub="all time"
            color="var(--teal-bright)"
            glow="rgba(93,202,165,0.35)"
          />
        </div>
      </div>

      {/* Win rate over time */}
      <div className="section-head">
        <span className="tc-section-label engine">WIN RATE OVER TIME</span>
        <span className="line" />
        <span className="meta">Rolling 30d · last 6 months</span>
      </div>
      <div className="glass" style={{ padding: '16px 12px 10px' }}>
        <LineChart data={P.winRateTrend} height={170} />
      </div>

      {/* Win rate by leg type */}
      <div className="section-head">
        <span className="tc-section-label engine">BY LEG TYPE</span>
        <span className="line" />
      </div>
      <div className="glass" style={{ padding: '16px 14px' }}>
        <HBarChart data={P.byLegType} />
      </div>

      {/* Win rate by risk tier */}
      <div className="section-head">
        <span className="tc-section-label engine">BY RISK TIER</span>
        <span className="line" />
      </div>
      <div className="glass" style={{ padding: '20px 16px 16px' }}>
        <VBarChart data={P.byRiskTier} height={180} />
      </div>

      {/* Win rate by league */}
      <div className="section-head">
        <span className="tc-section-label engine">BY LEAGUE</span>
        <span className="line" />
        <span className="meta">Top 5 by build count</span>
      </div>
      <div className="glass" style={{ padding: '16px 14px' }}>
        <HBarChart data={P.byLeague} showCount />
      </div>

      {/* What's working */}
      <div className="section-head">
        <span className="tc-section-label engine">WHAT&rsquo;S WORKING</span>
        <span className="line" />
      </div>
      <div className="glass" style={{ padding: 16 }}>
        <ul className="insight-list working">
          {P.insights.working.map((line, i) => (
            <li key={i}>
              <span className="insight-marker working" />
              <span className="tc-body" style={{ color: 'var(--t-sec)', lineHeight: 1.55 }}>{line}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Watch out for */}
      <div className="section-head">
        <span className="tc-section-label utility">WATCH OUT FOR</span>
        <span className="line" />
      </div>
      <div className="glass" style={{ padding: 16 }}>
        <ul className="insight-list watch">
          {P.insights.watchOut.map((line, i) => (
            <li key={i}>
              <span className="insight-marker watch" />
              <span className="tc-body" style={{ color: 'var(--t-sec)', lineHeight: 1.55 }}>{line}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function BigStat({ label, value, sub, color = 'var(--t-pri)', glow = 'transparent' }) {
  return (
    <div>
      <div className="tc-micro" style={{ fontSize: 9 }}>{label.toUpperCase()}</div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 28,
        fontWeight: 500,
        color,
        marginTop: 5,
        textShadow: glow !== 'transparent' ? `0 0 16px ${glow}` : 'none',
        lineHeight: 1.05,
      }}>{value}</div>
      <div className="tc-cap" style={{ marginTop: 3, fontSize: 10, color: 'var(--t-faint)' }}>{sub}</div>
    </div>
  );
}

Object.assign(window, { BuildersTab });
