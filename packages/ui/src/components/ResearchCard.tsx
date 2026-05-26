// ResearchCard — Dashboard "Top Research Today" item. Meta row + teams row +
// angle inset (SafePill + title/body + arrow on one row).
// Ports `screens/dashboard.jsx <ResearchCard>`.

import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, typography } from '@count/tokens';
import type { ResearchItem, Team } from '@count/types';
import { GlassPanel } from './GlassPanel';
import { Icon } from './Icon';
import { Kit } from './Kit';
import { SafePill, type SafePillTier } from './SafePill';
import { SignalBadge } from './SignalBadge';

export interface ResearchCardProps {
  item: ResearchItem;
  homeTeam: Team;
  awayTeam: Team;
  onPress?: () => void;
}

const containerStaticStyle: ViewStyle = { padding: 14 };

export function ResearchCard({
  item,
  homeTeam,
  awayTeam,
  onPress,
}: ResearchCardProps): ReactElement {
  const a = item.angle;
  const tier: SafePillTier = a.tier ?? (a.hits === '5/5' ? 'teal' : 'amber');
  const hits = parseInt(a.hits, 10);

  const accessibilityLabel = `${homeTeam.name} versus ${awayTeam.name}, ${item.kickoff}, signal ${item.signal}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [pressed && { opacity: 0.7 }]}
    >
      <GlassPanel variant="standard" style={containerStaticStyle}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text style={metaStyle} numberOfLines={1}>
            {`${item.league.toUpperCase()} · ${item.kickoff} · ${item.venue.toUpperCase()}`}
          </Text>
          <SignalBadge score={item.signal} />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
            gap: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
            <Kit team={homeTeam} variant="shirt" size={20} />
            <Text style={teamNameStyle} numberOfLines={1} ellipsizeMode="tail">
              {homeTeam.name}
            </Text>
          </View>
          <Text style={[metaStyle, { fontSize: 10 }]}>vs</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0, justifyContent: 'flex-end' }}>
            <Text style={[teamNameStyle, { textAlign: 'right' }]} numberOfLines={1} ellipsizeMode="tail">
              {awayTeam.name}
            </Text>
            <Kit team={awayTeam} variant="shirt" size={20} />
          </View>
        </View>

        {/* Angle inset — plain View (not GlassPanel) so we own the flex layout.
            GlassPanel's internal content View was forcing column-alignment,
            stacking the pill above the title instead of placing them in a row. */}
        <View style={angleInsetStyle}>
          <SafePill threshold={a.threshold} hits={hits} tier={tier} addable />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={angleTitleStyle}>{a.title}</Text>
            <Text style={angleBodyStyle} numberOfLines={2}>
              {a.body}
            </Text>
          </View>
          <Icon name="arrow-right" size={14} color={colors.amber.bright} />
        </View>
      </GlassPanel>
    </Pressable>
  );
}

const angleInsetStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 10,
  backgroundColor: 'rgba(0,0,0,0.20)',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.default,
};

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
  fontSize: 16,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.2,
  flexShrink: 1,
};

const angleTitleStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.medium,
};

const angleBodyStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  marginTop: 2,
  lineHeight: 11 * 1.4,
};