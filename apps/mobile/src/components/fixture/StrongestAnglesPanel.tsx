// StrongestAnglesPanel — engine-toned section head + glass panel containing
// addable angle rows. Each row is the press target that toggles the angle's
// Leg in/out of the Note Pad; the right-side +/✓ glyph is a visual affordance
// only (no own press handler).
//
// Source: docs/design-source/the-count-v2/project/screens/fixture.jsx lines
// 136–179 + styles.css lines 838–848 (.angle-row).

import type { ReactElement } from 'react';
import {
  Pressable,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import {
  GlassPanel,
  Icon,
  SafePill,
  SectionHead,
  useNotePad,
} from '@count/ui';
import { colors, typography } from '@count/tokens';
import type { FixtureDetail, Leg, StrongestAngle } from '@count/types';

export interface StrongestAnglesPanelProps {
  fixture: FixtureDetail;
}

function parseHits(hits: string): number {
  const head = hits.split('/')[0];
  const n = parseInt(head ?? '0', 10);
  return Number.isFinite(n) ? n : 0;
}

export function StrongestAnglesPanel({ fixture }: StrongestAnglesPanelProps): ReactElement {
  return (
    <>
      <SectionHead label="STRONGEST ANGLES" tone="engine" meta="Last 5" />
      <GlassPanel variant="standard" style={glassPanelStyle}>
        {fixture.strongestAngles.map((angle, i) => {
          const hits = parseHits(angle.hits);
          const leg: Leg = {
            id: `${fixture.id}::strongest::${i}`,
            fixtureId: fixture.id,
            threshold: angle.threshold,
            hits,
            total: 5,
            tier: angle.hits === '5/5' ? 'teal' : 'amber',
            title: angle.title,
            reason: angle.body,
          };
          return <AngleRow key={leg.id} angle={angle} leg={leg} isFirst={i === 0} />;
        })}
      </GlassPanel>
    </>
  );
}

// ─── AngleRow ───────────────────────────────────────────────────────────────

interface AngleRowProps {
  angle: StrongestAngle;
  leg: Leg;
  isFirst: boolean;
}

function AngleRow({ angle, leg, isFirst }: AngleRowProps): ReactElement {
  const notePad = useNotePad();
  const inPad = notePad.isInPad(leg.id);
  const hits = parseHits(angle.hits);
  const tier = angle.hits === '5/5' ? 'teal' : 'amber';

  // Pressable's `style` is a SINGLE static object (gotcha #10). Its only job
  // is the conditional border-top for non-first rows; everything else —
  // flexDirection, gap, padding, press-feedback opacity — lives on the
  // children-as-function inner View, where RN style flattening is reliable.
  const outerStyle = isFirst ? angleRowFirstStyle : angleRowWithBorderStyle;

  return (
    <Pressable
      onPress={() => notePad.toggleLeg(leg)}
      accessibilityRole="button"
      accessibilityState={{ selected: inPad }}
      accessibilityLabel={`${inPad ? 'Remove' : 'Add'} ${angle.title} to Note Pad`}
      style={outerStyle}
    >
      {({ pressed }) => (
        <View style={pressed ? rowInnerPressedStyle : rowInnerStyle}>
          <SafePill threshold={angle.threshold} hits={hits} tier={tier} />
          <View style={angleTextWrapStyle}>
            <Text style={angleTitleStyle} numberOfLines={1}>{angle.title}</Text>
            <Text style={angleBodyStyle} numberOfLines={2}>{angle.body}</Text>
          </View>
          <View style={inPad ? addGlyphBoxInPadStyle : addGlyphBoxStyle}>
            <Icon
              name={inPad ? 'check' : 'plus'}
              size={12}
              color={inPad ? colors.teal.bright : colors.text.muted}
            />
          </View>
        </View>
      )}
    </Pressable>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

// Rows flush to panel edges with their own internal padding; the GlassPanel
// inner View provides the rounded surface and the rows' hairline dividers
// clip to it.
const glassPanelStyle: ViewStyle = {
  overflow: 'hidden',
  padding: 0,
};

// Pressable outer styles — single static objects. The first row has no top
// border (the GlassPanel surface above is the seam); subsequent rows paint
// a 1pt divider at 0.14 alpha (gotcha #11 — default hairline @ 0.06 alpha
// vanishes on dark backgrounds).
const angleRowFirstStyle: ViewStyle = {};

const angleRowWithBorderStyle: ViewStyle = {
  borderTopWidth: 1,
  borderTopColor: 'rgba(255,255,255,0.14)',
};

// Inner View — owns the row's horizontal layout: SafePill | title block
// (flex-grow) | glyph box.
const rowInnerStyle: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 14,
  paddingHorizontal: 14,
  paddingVertical: 12,
};

const rowInnerPressedStyle: ViewStyle = {
  ...rowInnerStyle,
  opacity: 0.85,
};

const angleTextWrapStyle: ViewStyle = {
  flex: 1,
  minWidth: 0,
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

// Glyph box — 1pt strong-alpha border (gotcha #11), bumped from the previous
// hairline @ 0.06 so the box reads on dark backgrounds.
const addGlyphBoxStyle: ViewStyle = {
  width: 22,
  height: 22,
  borderRadius: 6,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,0.025)',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.14)',
  flexShrink: 0,
};

const addGlyphBoxInPadStyle: ViewStyle = {
  ...addGlyphBoxStyle,
  backgroundColor: 'rgba(93,202,165,0.10)',
  borderColor: 'rgba(93,202,165,0.30)',
};
