// XGContextBlock — compact, read-only xG / xGoT context above the matrix
// card. 4B.1 redesign: two narrow paired GlassPanels, each panel reading
// as a tight two-line block.
//
// Line 1: [kit mini] + team name (sans 14 medium primary).
// Line 2: `XG : 2.4 | XGOT : 1.6` — all-mono one-liner. Labels in hint,
//         separators (`:`, `|`) faded, values in amber-bright with an iOS
//         text-shadow glow. All metric-line text shares METRIC_FONT_SIZE
//         for the consistent typography requirement.
//
// xG is reasoning context, not a betting market — the block is deliberately
// non-addable (no Pressable, no leg construction).

import type { ReactElement } from 'react';
import { Platform, Text, View, type ViewStyle } from 'react-native';
import type { FixtureXG, XGData } from '@count/types';
import { GlassPanel, Kit } from '@count/ui';
import { colors, typography } from '@count/tokens';
import { TEAMS } from '../../mock/teams';

export interface XGContextBlockProps {
  xg: FixtureXG;
  homeCode: string;
  awayCode: string;
}

export function XGContextBlock({ xg, homeCode, awayCode }: XGContextBlockProps): ReactElement {
  return (
    <View style={wrapStyle}>
      <View style={{ flex: 1 }}>
        <GlassPanel variant="standard" style={panelInnerStyle}>
          <XGSide code={homeCode} data={xg.home} />
        </GlassPanel>
      </View>
      <View style={{ flex: 1 }}>
        <GlassPanel variant="standard" style={panelInnerStyle}>
          <XGSide code={awayCode} data={xg.away} />
        </GlassPanel>
      </View>
    </View>
  );
}

function XGSide({ code, data }: { code: string; data: XGData }): ReactElement {
  const team = TEAMS[code];
  const displayName = team?.name ?? code;
  return (
    <View>
      <View style={nameRowStyle}>
        {team ? <Kit variant="mini" team={team} /> : null}
        <Text style={teamNameStyle} numberOfLines={1}>
          {displayName}
        </Text>
      </View>
      <View style={metricsRowStyle}>
        <Text style={metricLabelStyle}>XG</Text>
        <Text style={metricSepStyle}>:</Text>
        <Text style={metricValueStyle}>{data.xg.toFixed(1)}</Text>
        <Text style={metricDividerStyle}>|</Text>
        <Text style={metricLabelStyle}>XGOT</Text>
        <Text style={metricSepStyle}>:</Text>
        <Text style={metricValueStyle}>{data.xgot.toFixed(1)}</Text>
      </View>
    </View>
  );
}

const wrapStyle: ViewStyle = {
  flexDirection: 'row',
  gap: 10,
  marginTop: 14,
};

const panelInnerStyle: ViewStyle = {
  padding: 12,
};

const nameRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8,
  marginBottom: 8,
};

const teamNameStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 14,
  fontWeight: typography.weight.medium,
  flexShrink: 1,
};

const metricsRowStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 4,
};

// All metrics-row text shares the same fontSize per the consistent-typography
// requirement — only colour differs. iOS gets a subtle text-shadow halo on
// the value glyphs (Android ignores textShadow, falls back to flat amber).
const METRIC_FONT_SIZE = 12;

const metricLabelStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: METRIC_FONT_SIZE,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
};

const metricSepStyle = {
  color: colors.text.faint,
  fontFamily: typography.fontMono,
  fontSize: METRIC_FONT_SIZE,
  fontWeight: typography.weight.regular,
};

const metricValueStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontMono,
  fontSize: METRIC_FONT_SIZE,
  fontWeight: typography.weight.medium,
  ...(Platform.OS === 'ios'
    ? {
        textShadowColor: colors.amber.bright,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 6,
      }
    : {}),
};

const metricDividerStyle = {
  color: 'rgba(255,255,255,0.15)',
  fontFamily: typography.fontMono,
  fontSize: METRIC_FONT_SIZE,
  fontWeight: typography.weight.regular,
  marginHorizontal: 4,
};
