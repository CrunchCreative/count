// FixtureHeroPanel — top of the fixture-detail Overview tab.
//
// Three-column row: home block | centre kickoff column | away block. Beneath
// the row, separated by a hairline divider, the win-probability segmented
// bar with a micro-label head.
//
// Source: docs/design-source/the-count-v2/project/screens/fixture.jsx lines
// 73–134 (hero) + styles.css lines 806–833 (.winprob).
//
// WinProbBar is co-located in this file — the JSX surface is small enough
// that splitting would just be churn. Hits ~210 lines including styles,
// under the 250-line split threshold.

import type { ReactElement } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FormPill, GlassPanel, Kit } from '@count/ui';
import { colors, typography } from '@count/tokens';
import type {
  FixtureDetail,
  FixtureWinProb,
  FormResult,
  Team,
} from '@count/types';
import { getTeam } from '@/src/mock/teams';

export interface FixtureHeroPanelProps {
  fixture: FixtureDetail;
}

export function FixtureHeroPanel({ fixture }: FixtureHeroPanelProps): ReactElement {
  const homeTeam = getTeam(fixture.home);
  const awayTeam = getTeam(fixture.away);

  return (
    <GlassPanel variant="elevated" style={{ padding: 20 }}>
      <View style={threeColRowStyle}>
        <SideBlock team={homeTeam} fallbackCode={fixture.home} rank={fixture.homeRank} form={fixture.homeForm} />
        <KickoffColumn kickoff={fixture.kickoff} venue={fixture.venue} />
        <SideBlock team={awayTeam} fallbackCode={fixture.away} rank={fixture.awayRank} form={fixture.awayForm} />
      </View>

      <View style={winProbWrapStyle}>
        <View style={winProbHeadStyle}>
          <Text style={microStyle}>WIN PROBABILITY</Text>
          <Text style={microHintStyle}>Model · L20</Text>
        </View>
        <WinProbBar homeCode={fixture.home} winProb={fixture.winProb} />
      </View>
    </GlassPanel>
  );
}

// ─── SideBlock ──────────────────────────────────────────────────────────────

interface SideBlockProps {
  team: Team | undefined;
  fallbackCode: string;
  rank: string;
  form: FormResult[];
}

function SideBlock({ team, fallbackCode, rank, form }: SideBlockProps): ReactElement {
  const displayName = team?.name ?? fallbackCode;
  return (
    <View style={sideBlockStyle}>
      {team ? <Kit variant="shirt" team={team} size={42} /> : <View style={{ width: 42, height: 46 }} />}
      <Text style={teamNameStyle} numberOfLines={2}>{displayName}</Text>
      <Text style={rankStyle}>{rank}</Text>
      <View style={formRowStyle}>
        {form.map((f, i) => <FormPill key={i} result={f} />)}
      </View>
    </View>
  );
}

// ─── KickoffColumn ──────────────────────────────────────────────────────────

function KickoffColumn({ kickoff, venue }: { kickoff: string; venue: string }): ReactElement {
  return (
    <View style={kickoffColStyle}>
      <Text style={kickoffLabelStyle}>KICKOFF</Text>
      <View style={kickoffTimeWrapStyle}>
        <Text style={kickoffTimeStyle}>{kickoff}</Text>
      </View>
      <Text style={venueStyle} numberOfLines={1}>{venue}</Text>
    </View>
  );
}

// ─── WinProbBar ─────────────────────────────────────────────────────────────

function WinProbBar({ homeCode, winProb }: { homeCode: string; winProb: FixtureWinProb }): ReactElement {
  return (
    <View style={winProbBarStyle}>
      <View style={[winProbSegBaseStyle, { flex: winProb.home }]}>
        <LinearGradient
          colors={[colors.amber.bright, colors.amber.mid]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={winProbInsetHighlightStyle} pointerEvents="none" />
        <Text style={winProbHomeTextStyle}>{`${homeCode} ${winProb.home}%`}</Text>
      </View>
      <View style={[winProbSegBaseStyle, winProbDrawSegStyle, { flex: winProb.draw }]}>
        <Text style={winProbDrawTextStyle}>{`${winProb.draw}%`}</Text>
      </View>
      <View style={[winProbSegBaseStyle, { flex: winProb.away }]}>
        <LinearGradient
          colors={['rgba(122,34,34,0.7)', 'rgba(80,20,20,0.6)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={winProbAwayTextStyle}>{`${winProb.away}%`}</Text>
      </View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const threeColRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
};

const sideBlockStyle: ViewStyle = {
  flex: 1,
  alignItems: 'center',
};

const kickoffColStyle: ViewStyle = {
  minWidth: 90,
  alignItems: 'center',
};

const teamNameStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 18,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.2,
  marginTop: 8,
  textAlign: 'center' as const,
};

const rankStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.3,
  marginTop: 4,
  textAlign: 'center' as const,
};

const formRowStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 4,
  justifyContent: 'center',
  marginTop: 10,
};

const kickoffLabelStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
  textAlign: 'center' as const,
};

// iOS-only amber glow under the kickoff time. Source uses a CSS textShadow;
// RN text shadow is unreliable cross-platform, so we hang the glow on a
// wrapping View. Android renders the amber colour without halo.
const kickoffTimeWrapStyle: ViewStyle = {
  marginTop: 6,
  ...(Platform.OS === 'ios'
    ? {
        shadowColor: colors.amber.bright,
        shadowOpacity: 0.4,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
      }
    : {}),
};

const kickoffTimeStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontMono,
  fontSize: 27,
  fontWeight: typography.weight.medium,
  letterSpacing: 0.5,
  textAlign: 'center' as const,
};

const venueStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
  marginTop: 4,
  textAlign: 'center' as const,
};

// Divider + head + bar wrapper. Source: marginTop 18, paddingTop 16, hairline
// top border at colors.border.default (gotcha #11 — alpha 0.06 is below the
// visibility threshold; if the divider vanishes on iPhone, bump to
// 'rgba(255,255,255,0.14)' + borderTopWidth 1).
const winProbWrapStyle: ViewStyle = {
  marginTop: 18,
  paddingTop: 16,
  borderTopWidth: StyleSheet.hairlineWidth,
  borderTopColor: colors.border.default,
};

const winProbHeadStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
};

const microStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const microHintStyle = {
  ...microStyle,
  color: colors.text.faint,
};

const winProbBarStyle: ViewStyle = {
  flexDirection: 'row',
  height: 32,
  borderRadius: 6,
  overflow: 'hidden',
  backgroundColor: 'rgba(255,255,255,0.04)',
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colors.border.default,
};

const winProbSegBaseStyle: ViewStyle = {
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
};

const winProbDrawSegStyle: ViewStyle = {
  backgroundColor: 'rgba(255,255,255,0.04)',
};

const winProbInsetHighlightStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  height: 1,
  backgroundColor: 'rgba(255,255,255,0.18)',
};

const winProbHomeTextStyle = {
  color: colors.amberOnLightText,
  fontFamily: typography.fontSans,
  fontSize: 12,
  fontWeight: typography.weight.medium,
};

const winProbDrawTextStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 12,
  fontWeight: typography.weight.medium,
};

const winProbAwayTextStyle = {
  color: colors.loss.text,
  fontFamily: typography.fontSans,
  fontSize: 12,
  fontWeight: typography.weight.medium,
};
