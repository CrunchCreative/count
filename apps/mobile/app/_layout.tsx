import '../global.css';
import { DarkTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import { NotePadProvider, NotePadSheet, RadialBackdrop } from '@count/ui';
import { colors } from '@count/tokens';

export const unstable_settings = {
  anchor: '(tabs)',
};

// React Navigation's DarkTheme paints `colors.background` (rgb(1,1,1)) onto
// every screen container — that opaque layer sits ABOVE our root View and
// hides the RadialBackdrop. Override both `background` and `card` to keep
// every navigator transparent; the root View below owns the actual page tint.
const TransparentDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'transparent',
    card: 'transparent',
  },
};

export default function RootLayout() {
  return (
    <NotePadProvider>
      <View style={{ flex: 1, backgroundColor: colors.bg.page }}>
        {/* Page-level chrome — sits behind every route, never blocks touches. */}
        <RadialBackdrop />
        <ThemeProvider value={TransparentDarkTheme}>
          <Stack
            screenOptions={{
              contentStyle: { backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="fixture/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
        </ThemeProvider>
        {/* Note Pad sheet — absolute-positioned sibling, above all navigators.
            Mounts always; renders nothing while closed (gotcha-free). */}
        <NotePadSheet />
        <StatusBar style="light" />
      </View>
    </NotePadProvider>
  );
}
