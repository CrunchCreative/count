// Shared stub-screen scaffold used by the four placeholder tabs while Phases
// 2B–5 build out the real Dashboard, Fixtures, Search, Builders, and Profile.
//
// RadialBackdrop is hoisted to the root layout (apps/mobile/app/_layout.tsx)
// — do not render it here.

import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@count/tokens';

export interface StubScreenProps {
  /** Display name shown centred in the page. */
  name: string;
}

export function StubScreen({ name }: StubScreenProps): ReactElement {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: spacing.pageX,
        }}
      >
        <Text
          style={{
            color: colors.text.secondary,
            fontFamily: typography.fontSans,
            fontSize: typography.size.body,
            fontWeight: typography.weight.regular,
            lineHeight: typography.size.body * typography.lineHeight.body,
            textAlign: 'center',
          }}
        >
          {name}
        </Text>
      </View>
    </SafeAreaView>
  );
}
