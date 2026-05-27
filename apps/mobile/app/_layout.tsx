import '../global.css';
import { DarkTheme, ThemeProvider, type Theme } from '@react-navigation/native';
import { Stack, useRouter, useSegments, type Href } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import 'react-native-reanimated';

import {
  BottomNav,
  NotePadBar,
  NotePadProvider,
  NotePadSheet,
  RadialBackdrop,
  type BottomNavTab,
} from '@count/ui';
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

// Bottom-nav metadata is owned at root so the nav can mount above every
// route (Phase 4A.2). It used to live inside `(tabs)/_layout.tsx` as the
// `tabBar` render prop's wrapper.
const TABS: BottomNavTab[] = [
  { key: 'index',    label: 'Home',     icon: 'home' },
  { key: 'fixtures', label: 'Fixtures', icon: 'calendar' },
  { key: 'search',   label: 'Search',   icon: 'search' },
  { key: 'builders', label: 'Builders', icon: 'builders' },
  { key: 'profile',  label: 'Profile',  icon: 'profile' },
];

const ROUTE_FOR_KEY: Record<string, Href> = {
  index: '/',
  fixtures: '/fixtures',
  search: '/search',
  builders: '/builders',
  profile: '/profile',
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
        {/* Persistent bottom chrome — mounted at root so it stays visible on
            every route, including fixture/[id]. NotePadBar sits above
            BottomNav via its own absolute positioning (insets.bottom + 70). */}
        <RootBottomNav />
        <NotePadBar />
        {/* Note Pad sheet — absolute-positioned sibling, above all navigators.
            Mounts always; renders nothing while closed (gotcha-free). */}
        <NotePadSheet />
        <StatusBar style="light" />
      </View>
    </NotePadProvider>
  );
}

// Active-key derivation uses `useSegments()` so non-(tabs) routes (e.g.
// fixture/[id]) cleanly produce no match — `''` doesn't equal any tab.key,
// so no tab highlights. The legacy path-suffix logic fell through to
// 'index' for unknown paths, which would have lit Home on fixture detail.
function RootBottomNav() {
  const segments = useSegments();
  const router = useRouter();

  const inTabs = segments[0] === '(tabs)';
  const activeKey = inTabs ? (segments[1] ?? 'index') : '';

  return (
    <BottomNav
      tabs={TABS}
      activeKey={activeKey}
      onSelect={(key) => {
        const route = ROUTE_FOR_KEY[key];
        if (route) router.navigate(route);
      }}
    />
  );
}
