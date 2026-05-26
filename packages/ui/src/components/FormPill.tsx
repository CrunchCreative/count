import { StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, glows, typography } from '@count/tokens';
import { glowStyle, shouldRenderAndroidGlow, type GlowSpec } from '../utils/glow';
import { AndroidGlowUnderlay } from '../utils/AndroidGlowUnderlay';

export type FormResult = 'W' | 'D' | 'L';

export interface FormPillProps {
  result: FormResult;
}

interface ResultSpec {
  gradient: readonly [string, string] | null;
  flat: string | null;
  border: string | null;
  glow: GlowSpec | null;
  text: string;
}

const resultSpecs: Record<FormResult, ResultSpec> = {
  W: {
    gradient: [colors.amber.bright, colors.amber.mid],
    flat: null,
    border: null,
    glow: glows.amber.formW,
    text: colors.amberOnLightText,
  },
  D: {
    gradient: null,
    flat: 'rgba(255,255,255,0.06)',
    border: null,
    glow: null,
    text: colors.text.muted,
  },
  L: {
    gradient: null,
    flat: 'rgba(255,255,255,0.02)',
    border: colors.border.faintest,
    glow: null,
    text: colors.text.faint,
  },
};

export function FormPill({ result }: FormPillProps) {
  const spec = resultSpecs[result];

  const innerStyle: ViewStyle = {
    width: 15,
    height: 15,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: spec.flat ?? 'transparent',
    borderWidth: spec.border ? StyleSheet.hairlineWidth : 0,
    borderColor: spec.border ?? 'transparent',
  };

  return (
    <View style={[{ borderRadius: 3 }, spec.glow ? glowStyle(spec.glow) : null]}>
      {spec.glow && shouldRenderAndroidGlow ? (
        <AndroidGlowUnderlay glow={spec.glow} radius={3} />
      ) : null}
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
            fontFamily: typography.fontSans,
            fontSize: 9,
            fontWeight: typography.weight.medium,
            lineHeight: 10,
          }}
        >
          {result}
        </Text>
      </View>
    </View>
  );
}

