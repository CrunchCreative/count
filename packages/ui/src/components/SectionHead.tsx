// SectionHead — horizontal divider row: uppercase label, gradient line, optional meta.
// Ports the `.section-head` pattern from the design source.

import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '@count/tokens';

export type SectionHeadTone = 'engine' | 'utility';

export interface SectionHeadProps {
  label: string;
  /** Engine = teal-bright; utility = muted text. Defaults to utility. */
  tone?: SectionHeadTone;
  /** Optional right-side mono caption. */
  meta?: string;
}

export function SectionHead({
  label,
  tone = 'utility',
  meta,
}: SectionHeadProps): ReactElement {
  const labelColor = tone === 'engine' ? colors.teal.bright : colors.text.muted;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 22,
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          color: labelColor,
          fontFamily: typography.fontSans,
          fontSize: 11,
          fontWeight: typography.weight.medium,
          letterSpacing: 0.6,
          textTransform: 'uppercase',
        }}
        numberOfLines={1}
      >
        {label}
      </Text>
      <LinearGradient
        colors={['rgba(255,255,255,0.10)', 'rgba(255,255,255,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ flex: 1, height: StyleSheet.hairlineWidth }}
      />
      {meta ? (
        <Text
          style={{
            color: colors.text.hint,
            fontFamily: typography.fontMono,
            fontSize: 10,
            fontWeight: typography.weight.regular,
            letterSpacing: 0.3,
          }}
          numberOfLines={1}
        >
          {meta}
        </Text>
      ) : null}
    </View>
  );
}
