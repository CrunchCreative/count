// FixtureListCard — a single fixture row inside a league section on the
// Fixtures-list screen. Ports `screens/fixtures-list.jsx <FixtureListCard>`
// with the slip → leg translation.
//
// Layout (column):
//   1. Meta row    — `LEAGUE · KICKOFF · VENUE` + SignalBadge
//   2. Teams row   — home block (col) | "vs" | away block (col).
//                    Each block: name row first, form-pill row BELOW,
//                    indented past the kit width (gotcha — form pills sit
//                    under, not beside, the team name).
//   3. Top angle   — SafePill (addable + actionable when a real `Leg` exists)
//                    + title + chevron-right.

import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { colors, typography } from '@count/tokens';
import type { FixtureListItem, Leg, Team } from '@count/types';
import { FormPill } from './FormPill';
import { GlassPanel } from './GlassPanel';
import { Icon } from './Icon';
import { Kit } from './Kit';
import { SafePill } from './SafePill';
import { SignalBadge } from './SignalBadge';

export interface FixtureListCardProps {
  fixture: FixtureListItem;
  homeTeam: Team;
  awayTeam: Team;
  onPress?: () => void;
}

const panelStyle: ViewStyle = { padding: 14 };

export function FixtureListCard({
  fixture,
  homeTeam,
  awayTeam,
  onPress,
}: FixtureListCardProps): ReactElement {
  const variant = fixture.signal >= 85 ? 'elevated' : 'standard';
  const angle = fixture.topAngle;
  // Real Safe pills only — muted / "—" placeholders aren't bindable.
  const isRealAngle = angle.tier !== 'muted' && angle.threshold !== '—';
  const hits = parseInt(angle.hits, 10);
  const leg: Leg | undefined = isRealAngle
    ? {
        id: `${fixture.id}::list-top`,
        fixtureId: fixture.id,
        threshold: angle.threshold,
        hits,
        total: 5,
        tier: angle.tier,
        title: angle.title,
      }
    : undefined;

  const accessibilityLabel = `${homeTeam.name} versus ${awayTeam.name}, ${fixture.kickoff}, signal ${fixture.signal}`;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [pressed && pressedStyle]}
    >
      <GlassPanel variant={variant} style={panelStyle}>
        {/* Meta row */}
        <View style={metaRowStyle}>
          <Text style={metaTextStyle} numberOfLines={1}>
            {`${fixture.league.toUpperCase()} · ${fixture.kickoff} · ${fixture.venue.toUpperCase()}`}
          </Text>
          <SignalBadge score={fixture.signal} />
        </View>

        {/* Teams row */}
        <View style={teamsRowStyle}>
          {/* Home block — column stack: name row above, form-pill row below */}
          <View style={homeBlockStyle}>
            <View style={teamNameRowStyle}>
              <Kit team={homeTeam} variant="shirt" size={22} />
              <Text style={teamNameStyle} numberOfLines={1} ellipsizeMode="tail">
                {homeTeam.name}
              </Text>
            </View>
            <View style={homeFormRowStyle}>
              {(homeTeam.form ?? []).map((r, i) => (
                <FormPill key={i} result={r} />
              ))}
            </View>
          </View>

          <Text style={vsStyle}>vs</Text>

          {/* Away block — mirrored */}
          <View style={awayBlockStyle}>
            <View style={awayTeamNameRowStyle}>
              <Text
                style={[teamNameStyle, awayNameStyle]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {awayTeam.name}
              </Text>
              <Kit team={awayTeam} variant="shirt" size={22} />
            </View>
            <View style={awayFormRowStyle}>
              {(awayTeam.form ?? []).map((r, i) => (
                <FormPill key={i} result={r} />
              ))}
            </View>
          </View>
        </View>

        {/* Referee row — name + yellow cpm + red cpm, centred. */}
        <View style={refereeWrapStyle}>
          <Text style={refereeLabelStyle}>REFEREE</Text>
          <View style={refereeRowStyle}>
            <Text style={refereeNameStyle} numberOfLines={1}>
              {fixture.referee.name}
            </Text>
            <View style={refereeStatPairStyle}>
              <Icon name="card-yellow" size={14} />
              <Text style={refereeStatStyle}>
                {fixture.referee.cardsPerMatch.toFixed(1)}
              </Text>
            </View>
            <View style={refereeStatPairStyle}>
              <Icon name="card-red" size={14} />
              <Text style={refereeStatStyle}>
                {fixture.referee.redsPerMatch.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Top angle inset row */}
        <View style={angleInsetStyle}>
          {leg ? (
            <SafePill
              threshold={angle.threshold}
              hits={hits}
              total={5}
              tier={angle.tier}
              size="std"
              leg={leg}
            />
          ) : (
            <SafePill
              threshold={angle.threshold}
              hits={hits}
              total={5}
              tier={angle.tier}
              size="std"
            />
          )}
          <Text style={angleTitleStyle} numberOfLines={1}>
            {angle.title}
          </Text>
          <Icon name="chevron-right" size={13} color={colors.text.hint} />
        </View>
      </GlassPanel>
    </Pressable>
  );
}

const pressedStyle: ViewStyle = { opacity: 0.7 };

const metaRowStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 8,
  marginBottom: 12,
};

const metaTextStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
  flex: 1,
  flexShrink: 1,
};

const teamsRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
  gap: 10,
};

const homeBlockStyle: ViewStyle = {
  flex: 1,
  minWidth: 0,
  flexDirection: 'column',
  alignItems: 'flex-start',
};

const awayBlockStyle: ViewStyle = {
  flex: 1,
  minWidth: 0,
  flexDirection: 'column',
  alignItems: 'flex-end',
};

const teamNameRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  minWidth: 0,
};

const awayTeamNameRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  justifyContent: 'flex-end',
  minWidth: 0,
};

const homeFormRowStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 3,
  marginTop: 6,
  marginLeft: 30,
};

const awayFormRowStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 3,
  marginTop: 6,
  marginRight: 30,
  justifyContent: 'flex-end',
};

const teamNameStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 15,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.2,
  flexShrink: 1,
};

const awayNameStyle = {
  textAlign: 'right' as const,
};

const vsStyle = {
  color: colors.text.faint,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const refereeWrapStyle: ViewStyle = {
  alignItems: 'center',
  marginBottom: 12,
};

const refereeLabelStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 9,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
  marginBottom: 4,
};

const refereeRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
};

const refereeNameStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 12,
  fontWeight: typography.weight.regular,
};

const refereeStatPairStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
};

const refereeStatStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontMono,
  fontSize: 12,
  fontWeight: typography.weight.regular,
};

const angleInsetStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderRadius: 9,
  backgroundColor: 'rgba(0,0,0,0.22)',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.faintest,
};

const angleTitleStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 12,
  fontWeight: typography.weight.medium,
  flex: 1,
  minWidth: 0,
};
