// Shared stub-screen scaffold used by the four placeholder tabs while Phases
// 2B–7 build out the real Dashboard, Fixtures, Search, Builders, and Profile.
//
// RadialBackdrop is hoisted to the root layout, AppHeader is hoisted to the
// (tabs) layout — do not render either here. The stub adds enough top padding
// to clear the persistent app header.

import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { APP_HEADER_CONTENT_HEIGHT } from '@count/ui';
import { colors, spacing, typography } from '@count/tokens';

export interface StubScreenProps {
  /** Display name shown centred in the page. */
  name: string;
}

export function StubScreen({ name }: StubScreenProps): ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: insets.top + APP_HEADER_CONTENT_HEIGHT,
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
  );
}
