// Fixture detail route stub — header + H1 + 4-tab strip + placeholder.
//
// Phase 3 ships the route empty. Phase 4 fills Overview / Team stats /
// Player stats tab contents; Phase 5 fills The Count tab. The tab labels
// here are locked per PROJECT-STATE decision 11:
//   Overview · Team stats · Player stats · The Count
// "AI" never appears in user-facing copy; "Matrix" never appears as a tab
// label (it remains acceptable internally for the comparative-grid shape).

import { useState, type ReactElement } from 'react';
import { ScrollView, Text, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { IconButton, TabStrip } from '@count/ui';
import { colors, typography } from '@count/tokens';

import { OverviewTab } from '@/src/components/fixture/OverviewTab';
import { TabPlaceholder } from '@/src/components/fixture/TabPlaceholder';
import { TeamStatsTab } from '@/src/components/fixture/TeamStatsTab';
import { getFixtureDetail } from '@/src/mock/fixture-details';
import { getTeam } from '@/src/mock/teams';

type TabId = 'overview' | 'team' | 'player' | 'count';

const PAGE_X = 16;

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'team', label: 'Team stats' },
  { id: 'player', label: 'Player stats' },
  { id: 'count', label: 'The Count' },
];

export default function FixtureDetailScreen(): ReactElement {
  const params = useLocalSearchParams<{ id?: string }>();
  const fixture = params.id ? getFixtureDetail(params.id) : undefined;
  const [tab, setTab] = useState<TabId>('overview');

  const homeTeam = fixture ? getTeam(fixture.home) : undefined;
  const awayTeam = fixture ? getTeam(fixture.away) : undefined;
  const homeName = homeTeam?.name ?? fixture?.home ?? '';
  const awayName = awayTeam?.name ?? fixture?.away ?? '';

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: PAGE_X,
          paddingTop: 16,
          paddingBottom: 200,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row */}
        <View style={headerRowStyle}>
          <View style={headerLeftStyle}>
            <IconButton
              icon="chevron-left"
              accessibilityLabel="Back"
              onPress={() => router.back()}
            />
            <Text style={metaStyle} numberOfLines={1}>
              {fixture
                ? `${fixture.league.toUpperCase()} · SAT ${fixture.kickoff}`
                : 'UNKNOWN FIXTURE'}
            </Text>
          </View>
          <View style={headerRightStyle}>
            <IconButton icon="share" accessibilityLabel="Share fixture" />
            <IconButton icon="bookmark" accessibilityLabel="Bookmark" />
          </View>
        </View>

        {/* H1 */}
        {fixture ? (
          <Text style={h1Style}>
            {homeName}
            {'  '}
            <Text style={vsInlineStyle}>vs</Text>
            {'  '}
            {awayName}
          </Text>
        ) : (
          <Text style={h1Style}>Unknown fixture</Text>
        )}

        {/* Tab strip */}
        <View style={tabStripWrapStyle}>
          <TabStrip tabs={TABS} activeId={tab} onChange={(id) => setTab(id as TabId)} />
        </View>

        {/* Tab content router. Each branch guards on `fixture` — the H1's
            "Unknown fixture" path handles the no-fixture case visually; tab
            content shouldn't try to render without a record. */}
        {tab === 'overview' && fixture ? <OverviewTab fixture={fixture} /> : null}
        {tab === 'team' && fixture ? (
          <TeamStatsTab fixture={fixture} />
        ) : null}
        {tab === 'player' && fixture ? (
          <TabPlaceholder phase="4C" tabName="Player stats" />
        ) : null}
        {tab === 'count' && fixture ? (
          <TabPlaceholder phase="5" tabName="The Count" />
        ) : null}
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

const headerLeftStyle: ViewStyle = {
  flex: 1,
  minWidth: 0,
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
};

const headerRightStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 6,
  flexShrink: 0,
};

const metaStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
  flex: 1,
  minWidth: 0,
};

const h1Style = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 27,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.4,
  lineHeight: 27 * 1.15,
  marginTop: 6,
};

const vsInlineStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 27,
  fontWeight: typography.weight.regular,
};

const tabStripWrapStyle: ViewStyle = {
  marginTop: 16,
};
