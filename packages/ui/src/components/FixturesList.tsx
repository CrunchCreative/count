// FixturesList — Fixtures tab screen body. Ports `screens/fixtures-list.jsx`.
//
// Layout (column):
//   1. Header row    — H1 + sub-line | filter / search icon buttons
//   2. Date strip    — four DateChips, today active by default
//   3. Comp filter   — All-comps CompChip + GlassSelect dropdown (filters list)
//   4. League list   — visible leagues stacked, each via FixtureLeagueSection
//
// Date strip is visually selectable but doesn't filter (date-aware filtering
// is real-data territory, out of scope this phase). Comp dropdown is wired.

import { useMemo, useState, type ReactElement } from 'react';
import { ScrollView, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography } from '@count/tokens';
import type { FixturesByLeague, Team } from '@count/types';
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

export interface FixturesListProps {
  fixturesByLeague: FixturesByLeague;
  resolveTeam: (code: string) => Team | undefined;
  onOpenFixture?: (id: string) => void;
  onPressSearch?: () => void;
  onPressFilter?: () => void;
}

export function FixturesList({
  fixturesByLeague,
  resolveTeam,
  onOpenFixture,
  onPressSearch,
  onPressFilter,
}: FixturesListProps): ReactElement {
  const [day, setDay] = useState('today');
  const [comp, setComp] = useState<string>(ALL_COMPS);

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
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: PAGE_X,
          paddingTop: 16,
          paddingBottom: BOTTOM_SCROLL_PAD,
        }}
        showsVerticalScrollIndicator={false}
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
            <IconButton icon="search" accessibilityLabel="Search" onPress={onPressSearch} />
          </View>
        </View>

        {/* Date strip */}
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
      </ScrollView>
    </SafeAreaView>
  );
}

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

const dateStripStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 6,
  marginTop: 24,
};

const compRowStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 8,
  marginTop: 18,
  zIndex: 30,
};

const sectionsWrapStyle: ViewStyle = {
  marginTop: 24,
};
