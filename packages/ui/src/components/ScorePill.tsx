import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '@count/tokens';

export type ScoreOutcome = 'W' | 'D' | 'L';

export interface ScorePillProps {
  result: string;
  wdl: ScoreOutcome;
}

interface OutcomeSpec {
  gradient: readonly [string, string] | null;
  flat: string | null;
  border: string;
  text: string;
}

const outcomeSpecs: Record<ScoreOutcome, OutcomeSpec> = {
  W: {
    gradient: [colors.win.gradientTop, colors.win.gradientBottom],
    flat: null,
    border: colors.win.border,
    text: colors.win.text,
  },
  D: {
    gradient: null,
    flat: 'rgba(255,255,255,0.04)',
    border: colors.border.strong,
    text: colors.text.muted,
  },
  L: {
    gradient: ['rgba(122,34,34,0.5)', 'rgba(122,34,34,0.25)'],
    flat: null,
    border: colors.loss.border,
    text: colors.loss.text,
  },
};

export function ScorePill({ result, wdl }: ScorePillProps) {
  const spec = outcomeSpecs[wdl];

  const innerStyle: ViewStyle = {
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: spec.flat ?? 'transparent',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: spec.border,
  };

  return (
    <View style={innerStyle}>
      {spec.gradient ? (
        <LinearGradient
          colors={spec.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <Text
        style={{
          color: spec.text,
          fontFamily: typography.fontMono,
          fontSize: 10,
          fontWeight: typography.weight.medium,
          letterSpacing: 0.2,
          lineHeight: 12,
        }}
      >
        {result}
      </Text>
    </View>
  );
}
