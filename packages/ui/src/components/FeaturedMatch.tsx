// FeaturedMatch — Dashboard "Featured match" panel. Elevated glass with meta
// row, teams row, depth row, footer. Tug-of-war chart slot deferred to
// Phase 3; the placeholder panel is omitted here to keep the layout dense.
//
// Ports `screens/dashboard.jsx <FeaturedMatch>` minus the inner .glass with
// <TugOfWar />.

import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, typography } from '@count/tokens';
import type { FixtureSummary, Team } from '@count/types';
import { GlassPanel } from './GlassPanel';
import { Icon } from './Icon';
import { Kit } from './Kit';
import { SignalBadge } from './SignalBadge';

export interface FeaturedMatchProps {
  fixture: FixtureSummary;
  homeTeam: Team;
  awayTeam: Team;
  onOpen?: () => void;
}

const containerStaticStyle: ViewStyle = { padding: 16 };

export function FeaturedMatch({
  fixture,
  homeTeam,
  awayTeam,
  onOpen,
}: FeaturedMatchProps): ReactElement {
  return (
    <GlassPanel variant="elevated" style={containerStaticStyle}>
      {/* Meta row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <Text style={metaStyle} numberOfLines={1}>
          {`${fixture.league.toUpperCase()} · ${fixture.kickoff} · ${fixture.venue.toUpperCase()}`}
        </Text>
        <SignalBadge score={fixture.signal} />
      </View>

      {/* Teams row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          gap: 8,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <Kit team={homeTeam} variant="shirt" size={22} />
          <Text style={teamNameStyle} numberOfLines={1} ellipsizeMode="tail">
            {homeTeam.name}
          </Text>
        </View>
        <Text style={[metaStyle, { fontSize: 10 }]}>vs</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
          <Text style={[teamNameStyle, { textAlign: 'right' }]} numberOfLines={1} ellipsizeMode="tail">
            {awayTeam.name}
          </Text>
          <Kit team={awayTeam} variant="shirt" size={22} />
        </View>
      </View>

      {/* Tug-of-war chart slot — empty in 2B. Chart lands in Phase 3 alongside
          fixture detail. Layout collapses; depth row sits directly beneath the
          teams row in this phase. See styles.css .tow / .tow-bar / .tow-row. */}

      {/* Depth row */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 4,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
          <Kit team={homeTeam} variant="shirt" size={14} />
          <Text style={depthNameStyle} numberOfLines={1}>
            {homeTeam.name}
          </Text>
          <Text style={depthCountStyle}>3 of 5</Text>
        </View>
        <Text style={depthCentreStyle}>RESEARCH DEPTH  7/10</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
          <Text style={depthCountStyle}>3 of 5</Text>
          <Text style={depthNameStyle} numberOfLines={1}>
            {awayTeam.name}
          </Text>
          <Kit team={awayTeam} variant="shirt" size={14} />
        </View>
      </View>

      {/* Footer */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 14,
          paddingTop: 12,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border.default,
          gap: 12,
        }}
      >
        <Text style={footerNoteStyle}>
          Bar length encodes consistency depth · longer bars hold over more fixtures.
        </Text>
        <Pressable
          onPress={onOpen}
          accessibilityRole={onOpen ? 'button' : undefined}
          accessibilityLabel="Open fixture"
          style={({ pressed }) => [
            { flexDirection: 'row', alignItems: 'center', gap: 4, flexShrink: 0 },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Text style={openCtaStyle}>Open fixture</Text>
          <Icon name="arrow-right" size={13} color={colors.amber.bright} />
        </Pressable>
      </View>
    </GlassPanel>
  );
}

const metaStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const teamNameStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 18,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.2,
  flexShrink: 1,
};

const depthNameStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  flexShrink: 1,
};

const depthCountStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 11,
  fontWeight: typography.weight.regular,
};

const depthCentreStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const footerNoteStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  flex: 1,
  lineHeight: 11 * 1.4,
};

const openCtaStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
};