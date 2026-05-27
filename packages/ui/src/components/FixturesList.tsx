// FixturesList — Fixtures tab screen body. Ports `screens/fixtures-list.jsx`.
//
// Layout (column):
//   1. Header row    — H1 + sub-line | filter icon button
//   2. Date strip    — single bordered container with four DateChip segments
//                      inside (ports .date-strip from styles.css line 895).
//                      grid-auto-columns: 1fr → segments share width equally
//                      via flex: 1 on each child.
//   3. Comp filter   — All-comps CompChip + GlassSelect dropdown (filters list)
//   4. League list   — visible leagues stacked, each via FixtureLeagueSection
//
// Date strip is visually selectable but doesn't filter (date-aware filtering
// is real-data territory, out of scope this phase). Comp dropdown is wired.
//
// Phase 3.6.1: exposes an imperative `scrollToTop()` handle via `forwardRef`
// so the (tabs)/fixtures.tsx wrapper can snap the list back to the top on
// tab focus.

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ForwardedRef,
  type ReactElement,
} from 'react';
import {
  Animated,
  StyleSheet,
  type ScrollView,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '@count/tokens';
import type { FixturesByLeague, Team } from '@count/types';
import { APP_HEADER_CONTENT_HEIGHT } from './AppHeader';
import { useScrollY } from '../context/ScrollContext';
import { CompChip } from './CompChip';
import { DateChip } from './DateChip';
import { FixtureLeagueSection } from './FixtureLeagueSection';
import { GlassSelect, type GlassSelectOption } from './GlassSelect';
import { IconButton } from './IconButton';

const PAGE_X = 16;
const BOTTOM_SCROLL_PAD = 200;

const DAY_OPTIONS = [
  { id: 'today', label: 'Today' },
  { id: 'tomorrow', label: 'Tomorrow' },
  { id: 'sat-14', label: 'Sat 14' },
  { id: 'sun-15', label: 'Sun 15' },
];

const ALL_COMPS = 'all';

export interface FixturesListHandle {
  /** Snap the scrollview to the top. No animation. */
  scrollToTop: () => void;
}

export interface FixturesListProps {
  fixturesByLeague: FixturesByLeague;
  resolveTeam: (code: string) => Team | undefined;
  onOpenFixture?: (id: string) => void;
  onPressFilter?: () => void;
}

function FixturesListInner(
  {
    fixturesByLeague,
    resolveTeam,
    onOpenFixture,
    onPressFilter,
  }: FixturesListProps,
  ref: ForwardedRef<FixturesListHandle>,
): ReactElement {
  const insets = useSafeAreaInsets();
  const scrollY = useScrollY();
  const scrollRef = useRef<ScrollView>(null);
  const [day, setDay] = useState('today');
  const [comp, setComp] = useState<string>(ALL_COMPS);

  useImperativeHandle(
    ref,
    () => ({
      scrollToTop: () => {
        scrollRef.current?.scrollTo({ y: 0, animated: false });
      },
    }),
    [],
  );

  const allLeagues = useMemo(() => Object.keys(fixturesByLeague), [fixturesByLeague]);
  const total = useMemo(
    () => allLeagues.reduce((n, l) => n + (fixturesByLeague[l]?.length ?? 0), 0),
    [allLeagues, fixturesByLeague],
  );

  const leagueOptions: GlassSelectOption[] = useMemo(
    () => [
      { id: ALL_COMPS, label: 'All competitions', count: total },
      ...allLeagues.map((l) => ({
        id: l,
        label: l,
        count: fixturesByLeague[l]?.length ?? 0,
      })),
    ],
    [allLeagues, fixturesByLeague, total],
  );

  const visibleLeagues = comp === ALL_COMPS ? allLeagues : [comp];
  const filteringActive = comp !== ALL_COMPS;

  return (
    <Animated.ScrollView
      ref={scrollRef}
      contentContainerStyle={{
        paddingHorizontal: PAGE_X,
        paddingTop: insets.top + APP_HEADER_CONTENT_HEIGHT + 16,
        paddingBottom: BOTTOM_SCROLL_PAD,
      }}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true },
      )}
    >
      {/* Header row */}
      <View style={headerRowStyle}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={h1Style}>Fixtures</Text>
          <Text style={subLineStyle}>
            {`${total} fixtures across ${allLeagues.length} competitions`}
          </Text>
        </View>
        <View style={headerActionsStyle}>
          <IconButton icon="filter" accessibilityLabel="Filter" onPress={onPressFilter} />
        </View>
      </View>

      {/* Date strip — single bordered container with four equal-width segments */}
      <View style={dateStripStyle}>
        {DAY_OPTIONS.map((d) => (
          <DateChip
            key={d.id}
            label={d.label}
            active={day === d.id}
            onPress={() => setDay(d.id)}
          />
        ))}
      </View>

      {/* Comp filter row — z-index high so the dropdown panel lifts above
          the league sections below it. */}
      <View style={compRowStyle}>
        <CompChip
          label="All comps"
          active={!filteringActive}
          onPress={() => setComp(ALL_COMPS)}
        />
        <GlassSelect
          value={comp}
          options={leagueOptions}
          onChange={setComp}
          filteringActive={filteringActive}
        />
      </View>

      {/* League sections */}
      <View style={sectionsWrapStyle}>
        {visibleLeagues.map((league, idx) => (
          <FixtureLeagueSection
            key={league}
            league={league}
            fixtures={fixturesByLeague[league] ?? []}
            resolveTeam={resolveTeam}
            onOpenFixture={onOpenFixture}
            firstSection={idx === 0}
          />
        ))}
      </View>
    </Animated.ScrollView>
  );
}

export const FixturesList = forwardRef<FixturesListHandle, FixturesListProps>(
  FixturesListInner,
);

const headerRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12,
};

const headerActionsStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 6,
  flexShrink: 0,
};

const h1Style = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 27,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.4,
  lineHeight: 27 * 1.15,
};

const subLineStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.regular,
  marginTop: 6,
  lineHeight: 13 * 1.45,
};

// Date strip container — `.date-strip` in styles.css line 895.
// One bordered rounded box; segments inside share width via flex: 1.
const dateStripStyle: ViewStyle = {
  flexDirection: 'row',
  marginTop: 24,
  padding: 4,
  borderRadius: 11,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.10)',
  backgroundColor: 'rgba(255,255,255,0.015)',
};

const compRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginTop: 18,
  zIndex: 30,
};

const sectionsWrapStyle: ViewStyle = {
  marginTop: 24,
};