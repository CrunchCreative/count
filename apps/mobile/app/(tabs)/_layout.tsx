import { Tabs, useRouter } from 'expo-router';
import { View } from 'react-native';
import { AppHeader, ScrollProvider } from '@count/ui';

// Phase 4A.2: `BottomNav` and `NotePadBar` moved to root `_layout.tsx` so
// they stay mounted across non-tab routes (fixture/[id]). The Tabs navigator
// stays — it preserves per-tab scroll state (decision: keep tab semantics).
// We suppress its default tab bar via `tabBar={() => null}` AND
// `tabBarStyle: { display: 'none' }` so no native bar paints over the
// hoisted custom one. AppHeader stays scoped here (decision 13 — header
// hides on fixture detail).

export default function TabLayout() {
  return (
    // ScrollProvider holds the shared Animated.Value that drives the
    // AppHeader's background fade. Tab screens push their scroll-offset
    // into it via `useScrollY()`.
    <ScrollProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          tabBar={() => null}
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        />
        {/* Persistent app header — absolute at the top of every tab screen. */}
        <TabsAppHeader />
      </View>
    </ScrollProvider>
  );
}

function TabsAppHeader() {
  const router = useRouter();
  return (
    <AppHeader
      logo={require('../../assets/count-logo.png')}
      onPressProfile={() => router.navigate('/profile')}
    />
  );
}
