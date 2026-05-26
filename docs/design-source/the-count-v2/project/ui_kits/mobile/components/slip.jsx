// Slip — cross-app betting slip
// Exports: SlipProvider, useSlip, SlipBar, SlipSheet, SaveBuilderModal

const SlipContext = React.createContext(null);

function SlipProvider({ children, initialLegs = [], initialBuilders = [] }) {
  const [legs, setLegs] = React.useState(initialLegs);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [saveModalOpen, setSaveModalOpen] = React.useState(false);
  const [builders, setBuilders] = React.useState(initialBuilders);

  const isInSlip = (id) => legs.some(l => l.id === id);
  const addLeg = (leg) => {
    setLegs(prev => prev.find(l => l.id === leg.id) ? prev : [...prev, leg]);
  };
  const removeLeg = (id) => setLegs(prev => prev.filter(l => l.id !== id));
  const toggleLeg = (leg) => isInSlip(leg.id) ? removeLeg(leg.id) : addLeg(leg);
  const clearAll = () => setLegs([]);

  const saveBuilder = (name) => {
    const builder = {
      id: `builder-${Date.now()}`,
      name,
      legs: [...legs],
      savedAt: new Date().toISOString(),
      status: 'active',
    };
    setBuilders(prev => [builder, ...prev]);
    setLegs([]); // clear slip after save
    setSaveModalOpen(false);
    setSheetOpen(false);
    return builder;
  };

  const loadBuilderToSlip = (builder) => {
    setLegs(builder.legs);
  };

  const deleteBuilder = (id) => {
    setBuilders(prev => prev.filter(b => b.id !== id));
  };

  return (
    <SlipContext.Provider value={{
      legs, sheetOpen, setSheetOpen, saveModalOpen, setSaveModalOpen,
      builders, addLeg, removeLeg, toggleLeg, clearAll, isInSlip,
      saveBuilder, loadBuilderToSlip, deleteBuilder,
    }}>
      {children}
    </SlipContext.Provider>
  );
}

function useSlip() {
  return React.useContext(SlipContext) || {
    legs: [], builders: [],
    sheetOpen: false, setSheetOpen: () => {},
    saveModalOpen: false, setSaveModalOpen: () => {},
    addLeg: () => {}, removeLeg: () => {}, toggleLeg: () => {}, clearAll: () => {}, isInSlip: () => false,
    saveBuilder: () => {}, loadBuilderToSlip: () => {}, deleteBuilder: () => {},
  };
}

/* ──────────────────────────────────────────────── */
/* SLIP BAR — sticky above bottom nav               */
/* ──────────────────────────────────────────────── */

function SlipBar({ onExpand }) {
  const slip = useSlip();
  const count = slip.legs.length;
  const isPopulated = count > 0;
  const lastLeg = slip.legs[slip.legs.length - 1];

  return (
    <div
      className={`slip-bar ${isPopulated ? 'populated' : 'empty'}`}
      onClick={() => (onExpand ? onExpand() : slip.setSheetOpen(true))}
      role="button"
      aria-label={isPopulated ? `Open slip with ${count} legs` : 'Open empty slip'}
    >
      <div className="slip-bar-left">
        <div className="slip-bar-icon">
          {isPopulated ? (
            <span className="slip-count-badge">{count}</span>
          ) : (
            <Icon name="layers" size={14} color="var(--t-mut)" />
          )}
        </div>
        <div className="slip-bar-info">
          <div className="slip-bar-title">Slip</div>
          {isPopulated ? (
            <div className="slip-bar-preview">
              <span style={{ color: 'var(--amber-bright)' }}>{count} leg{count !== 1 ? 's' : ''}</span>
              {lastLeg && (
                <>
                  <span className="slip-bar-sep">·</span>
                  <span style={{
                    color: 'var(--t-mut)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    minWidth: 0,
                  }}>
                    {lastLeg.title}
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="slip-bar-preview empty">0 legs</div>
          )}
        </div>
      </div>
      <Icon name="chevron-up" size={16} color={isPopulated ? 'var(--amber-bright)' : 'var(--t-mut)'} />
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/* SLIP SHEET — slide-up                            */
/* ──────────────────────────────────────────────── */

function SlipSheet() {
  const slip = useSlip();
  const { TEAMS, FIXTURES_ALL } = window.DATA;

  if (!slip.sheetOpen) return null;

  // Build a fixture lookup
  const fixtureMap = {};
  Object.entries(FIXTURES_ALL).forEach(([league, fixtures]) => {
    fixtures.forEach(f => { fixtureMap[f.id] = { ...f, league }; });
  });

  // Group legs by fixtureId
  const groups = {};
  slip.legs.forEach(leg => {
    if (!groups[leg.fixtureId]) groups[leg.fixtureId] = [];
    groups[leg.fixtureId].push(leg);
  });

  const groupedIds = Object.keys(groups);

  return (
    <>
      <div className="slip-backdrop" onClick={() => slip.setSheetOpen(false)} />
      <div className="slip-sheet">
        <div className="slip-sheet-handle" />
        <div className="slip-sheet-header">
          <div>
            <div style={{ fontSize: 18, fontWeight: 500 }}>Slip</div>
            <div className="tc-cap" style={{ marginTop: 2 }}>
              {slip.legs.length} leg{slip.legs.length !== 1 ? 's' : ''}{' '}
              {groupedIds.length > 0 && (
                <>· across {groupedIds.length} fixture{groupedIds.length !== 1 ? 's' : ''}</>
              )}
            </div>
          </div>
          <button className="icon-btn" onClick={() => slip.setSheetOpen(false)} aria-label="Close slip">
            <Icon name="close" size={14} />
          </button>
        </div>

        <div className="slip-sheet-body">
          {slip.legs.length === 0 ? (
            <div className="slip-empty">
              <div className="slip-empty-icon">
                <Icon name="layers" size={28} color="var(--t-hint)" />
              </div>
              <div style={{ fontSize: 15, fontWeight: 500, marginTop: 14 }}>Your slip is empty</div>
              <div className="tc-cap" style={{ marginTop: 6, textAlign: 'center', maxWidth: 260, lineHeight: 1.55 }}>
                Tap any angle in the app to add it to your slip. Strongest Angles, Safe @ pills, and player matrix rows are all tap-to-add.
              </div>
            </div>
          ) : (
            groupedIds.map(fid => {
              const fix = fixtureMap[fid];
              if (!fix) return null;
              const home = TEAMS[fix.home];
              const away = TEAMS[fix.away];
              return (
                <div key={fid} className="slip-fixture-group">
                  <div className="slip-fixture-meta">
                    {fix.league.toUpperCase()} &nbsp;·&nbsp; {fix.kickoff} &nbsp;·&nbsp; {home?.name?.toUpperCase()} vs {away?.name?.toUpperCase()}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                    {groups[fid].map(leg => (
                      <div key={leg.id} className="slip-leg-row glass">
                        <span className={`safe-pill ${leg.tier || 'teal'}`} style={{ flexShrink: 0 }}>
                          <span className="v">{leg.threshold}</span>
                          <span className="r">{leg.hits}/{leg.total || 5}</span>
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="tc-body-em" style={{ fontSize: 13 }}>{leg.title}</div>
                          {leg.reason && (
                            <div className="tc-cap" style={{ marginTop: 2, color: 'var(--t-mut)' }}>{leg.reason}</div>
                          )}
                        </div>
                        <button
                          className="slip-leg-remove"
                          onClick={() => slip.removeLeg(leg.id)}
                          aria-label="Remove leg"
                        >
                          <Icon name="close" size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="slip-sheet-footer">
          <div className="slip-sheet-total">
            <span className="tc-micro" style={{ fontSize: 9 }}>TOTAL LEGS</span>
            <span style={{ fontSize: 22, fontWeight: 500, color: 'var(--amber-bright)', fontFamily: 'var(--font-mono)', marginLeft: 8 }}>
              {slip.legs.length}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {slip.legs.length > 0 && (
              <button className="tc-btn" onClick={() => slip.clearAll()}>
                Clear all
              </button>
            )}
            <button
              className="tc-btn amber"
              onClick={() => slip.setSaveModalOpen(true)}
              disabled={slip.legs.length === 0}
              style={{ opacity: slip.legs.length === 0 ? 0.4 : 1 }}
            >
              <Icon name="bookmark" size={13} />
              Save Builder
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────── */
/* SAVE BUILDER MODAL                                */
/* ──────────────────────────────────────────────── */

function SaveBuilderModal() {
  const slip = useSlip();
  const { FIXTURES_ALL } = window.DATA;

  // Default name suggestion
  const defaultName = React.useMemo(() => {
    const fixtureIds = new Set(slip.legs.map(l => l.fixtureId));
    const fixtureCount = fixtureIds.size;
    const today = new Date();
    const weekday = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][today.getDay()];
    return `${weekday} research · ${fixtureCount} fixture${fixtureCount !== 1 ? 's' : ''}`;
  }, [slip.legs, slip.saveModalOpen]);

  const [name, setName] = React.useState(defaultName);

  React.useEffect(() => {
    if (slip.saveModalOpen) setName(defaultName);
  }, [slip.saveModalOpen, defaultName]);

  if (!slip.saveModalOpen) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    slip.saveBuilder(name.trim());
  };

  return (
    <>
      <div className="modal-backdrop" onClick={() => slip.setSaveModalOpen(false)} />
      <div className="modal-card glass elev">
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <Icon name="bookmark" size={16} color="var(--amber-bright)" />
            <span style={{ fontSize: 16, fontWeight: 500 }}>Save Builder</span>
          </div>
          <div className="tc-cap" style={{ marginBottom: 16 }}>
            {slip.legs.length} leg{slip.legs.length !== 1 ? 's' : ''} will be saved to your Builders.
          </div>

          <label className="tc-micro" style={{ display: 'block', marginBottom: 6 }}>BUILDER NAME</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Give it a name…"
            autoFocus
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.25)',
              border: '0.5px solid var(--b-str)',
              borderRadius: 9,
              padding: '11px 13px',
              fontSize: 14,
              fontFamily: 'var(--font-sans)',
              color: 'var(--t-pri)',
              outline: 'none',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 0 0 0.5px rgba(232,181,58,0.08)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{
          display: 'flex', gap: 8, padding: '14px 20px 20px',
          borderTop: '0.5px solid var(--b-def)',
        }}>
          <button
            className="tc-btn"
            onClick={() => slip.setSaveModalOpen(false)}
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            className="tc-btn amber"
            onClick={handleSave}
            disabled={!name.trim()}
            style={{ flex: 1, opacity: !name.trim() ? 0.4 : 1 }}
          >
            <Icon name="check" size={13} />
            Save
          </button>
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  SlipContext, SlipProvider, useSlip,
  SlipBar, SlipSheet, SaveBuilderModal,
});
