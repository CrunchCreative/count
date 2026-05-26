// Top-level App — handles screen routing, tweaks, bottom nav, cross-app slip

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#E8B53A", "#F1C455", "#BA7517", "#854F0B"],
  "density": "comfortable",
  "mode": "casual"
}/*EDITMODE-END*/;

const PALETTE_OPTIONS = [
  ["#E8B53A", "#F1C455", "#BA7517", "#854F0B"], // amber (default)
  ["#F0A040", "#F8B964", "#B5621A", "#7A3C0A"], // saffron
  ["#D88454", "#E4A176", "#9C4C2A", "#5F2A14"], // copper
  ["#D4B65A", "#E8CE7C", "#A88932", "#6B5414"], // gold
];

// Seed saved builders for the Builders tab — sourced from data-builders.js
const SEED_BUILDERS = window.SEED_BUILDERS || [];

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to the document
  React.useEffect(() => {
    const scale = tweaks.density === 'compact' ? 0.94 : tweaks.density === 'spacious' ? 1.06 : 1;
    document.documentElement.style.setProperty('--type-scale', String(scale));

    const p = Array.isArray(tweaks.palette) ? tweaks.palette : PALETTE_OPTIONS[0];
    document.documentElement.style.setProperty('--amber-bright', p[0]);
    document.documentElement.style.setProperty('--amber-light', p[1]);
    document.documentElement.style.setProperty('--amber-mid', p[2]);
    document.documentElement.style.setProperty('--amber-deep', p[3]);
  }, [tweaks]);

  return (
    <SlipProvider initialBuilders={SEED_BUILDERS}>
      <AppShell tweaks={tweaks} setTweak={setTweak} />
    </SlipProvider>
  );
}

function AppShell({ tweaks, setTweak }) {
  // Screen state
  const [screen, setScreen] = React.useState({ name: 'dashboard' });
  const [navTab, setNavTab] = React.useState('home');

  const scrollTop = () => {
    setTimeout(() => {
      const el = document.querySelector('.tc-app');
      if (el) el.scrollTo({ top: 0, behavior: 'instant' });
    }, 0);
  };
  const openFixture = (id, tab = 'overview') => {
    setScreen({ name: 'fixture', fixtureId: id, tab });
    setNavTab('fixtures');
    scrollTop();
  };
  const openFixturesList = () => {
    setScreen({ name: 'fixtures-list' });
    setNavTab('fixtures');
    scrollTop();
  };
  const openBuildersTab = () => {
    setScreen({ name: 'builders-tab' });
    setNavTab('builders');
    scrollTop();
  };
  const openBuilder = (tier) => {
    setScreen({ name: 'builder', tier });
    setNavTab('builders');
    scrollTop();
  };
  const goHome = () => {
    setScreen({ name: 'dashboard' });
    setNavTab('home');
    scrollTop();
  };

  const advanced = tweaks.mode === 'advanced';

  return (
    <div className="stage">
      <div style={{
        width: 402, height: 874,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        background: 'var(--bg-page)',
        boxShadow: '0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
        fontFamily: 'var(--font-sans)',
        WebkitFontSmoothing: 'antialiased',
      }}>
        {/* Static page-level radial gradients (sit beneath all content) */}
        <div className="bg-gradients" />
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
          width: 122, height: 35, borderRadius: 22, background: '#000', zIndex: 100,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
        }} />
        {/* status bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 54, zIndex: 80,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 30px 0',
          fontFamily: '-apple-system, "SF Pro", system-ui',
          color: '#F2F0E8',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.3 }}>9:41</span>
          <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <svg width="17" height="11" viewBox="0 0 17 11" fill="#F2F0E8">
              <rect x="0" y="6.5" width="2.5" height="4" rx="0.5" />
              <rect x="4" y="4" width="2.5" height="6.5" rx="0.5" />
              <rect x="8" y="2" width="2.5" height="8.5" rx="0.5" />
              <rect x="12" y="0" width="2.5" height="10.5" rx="0.5" />
            </svg>
            <svg width="24" height="11" viewBox="0 0 24 11">
              <rect x="0.5" y="0.5" width="20" height="10" rx="3" fill="none" stroke="#F2F0E8" strokeOpacity="0.5"/>
              <rect x="2" y="2" width="17" height="7" rx="1.5" fill="#F2F0E8"/>
              <path d="M22 4v3c0.6-0.3 1-0.8 1-1.5C23 4.8 22.6 4.3 22 4z" fill="#F2F0E8" fillOpacity="0.5"/>
            </svg>
          </span>
        </div>

        {/* App content */}
        <div className="tc-app" style={{ height: '100%' }}>
          {screen.name === 'dashboard' && (
            <Dashboard onOpenFixture={openFixture} advanced={advanced} />
          )}
          {screen.name === 'fixtures-list' && (
            <FixturesList onOpenFixture={openFixture} />
          )}
          {screen.name === 'fixture' && (
            <FixtureScreen
              fixtureId={screen.fixtureId}
              initialTab={screen.tab}
              onBack={openFixturesList}
              onOpenBuilder={openBuilder}
              advanced={advanced}
            />
          )}
          {screen.name === 'builders-tab' && (
            <BuildersTab onOpenFixture={openFixture} onBack={goHome} />
          )}
          {screen.name === 'builder' && (
            <BuilderResult
              tier={screen.tier}
              onBack={() => openFixture('mci-cry', 'overview')}
            />
          )}
        </div>

        {/* Slip bar — sticky above bottom nav */}
        <SlipBar />

        {/* Bottom nav */}
        <BottomNav active={navTab} onChange={(tab) => {
          setNavTab(tab);
          if (tab === 'home') setScreen({ name: 'dashboard' });
          else if (tab === 'fixtures') setScreen({ name: 'fixtures-list' });
          else if (tab === 'builders') setScreen({ name: 'builders-tab' });
          else if (tab === 'search' || tab === 'profile') setScreen({ name: 'dashboard' });
          scrollTop();
        }} />

        {/* Slip overlays (above everything) */}
        <SlipSheet />
        <SaveBuilderModal />

        {/* home indicator */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 100,
          height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
          paddingBottom: 8, pointerEvents: 'none',
        }}>
          <div style={{
            width: 139, height: 5, borderRadius: 100,
            background: 'rgba(255,255,255,0.6)',
          }} />
        </div>
      </div>

      {/* Tweaks panel — outside bezel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent">
          <TweakColor
            label="Accent palette"
            value={tweaks.palette}
            onChange={(v) => setTweak('palette', v)}
            options={PALETTE_OPTIONS}
          />
        </TweakSection>
        <TweakSection label="Density">
          <TweakRadio
            label="Type scale"
            value={tweaks.density}
            onChange={(v) => setTweak('density', v)}
            options={['compact', 'comfortable', 'spacious']}
          />
        </TweakSection>
        <TweakSection label="Mode">
          <TweakRadio
            label="User type"
            value={tweaks.mode}
            onChange={(v) => setTweak('mode', v)}
            options={['casual', 'advanced']}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

function BottomNav({ active, onChange }) {
  const items = [
    { id: 'home',     label: 'Home',     icon: 'home' },
    { id: 'fixtures', label: 'Fixtures', icon: 'calendar' },
    { id: 'search',   label: 'Search',   icon: 'search' },
    { id: 'builders', label: 'Builders', icon: 'builders' },
    { id: 'profile',  label: 'Profile',  icon: 'profile' },
  ];
  return (
    <div className="bottom-nav">
      {items.map(i => (
        <div key={i.id} className={`item ${active === i.id ? 'active' : ''}`} onClick={() => onChange(i.id)}>
          <span className="ic"><Icon name={i.icon} size={20} /></span>
          <span>{i.label}</span>
        </div>
      ))}
    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
