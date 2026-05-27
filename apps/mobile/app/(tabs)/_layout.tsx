import { Tabs, usePathname, useRouter, type Href } from 'expo-router';
import { View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AppHeader, BottomNav, NotePadBar, type BottomNavTab } from '@count/ui';

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

function activeKeyFromPath(pathname: string): string {
  if (pathname.endsWith('/fixtures')) return 'fixtures';
  if (pathname.endsWith('/search')) return 'search';
  if (pathname.endsWith('/builders')) return 'builders';
  if (pathname.endsWith('/profile')) return 'profile';
  return 'index';
}

function CustomTabBar(_: BottomTabBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeKey = activeKeyFromPath(pathname);

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

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      />
      {/* NotePadBar lives OUTSIDE the React Navigation tabBar slot.
          Earlier passes nested it inside the tabBar wrapper alongside
          BottomNav; v7 RN's BottomTabBarHeightContext + slot positioning
          made the inner absolute child unpredictable on device (sometimes
          missing, sometimes mis-positioned). Mounting it here against
          this `flex: 1` View — which has known measurable bounds — makes
          its `bottom: insets.bottom + NAV_CONTENT_HEIGHT` anchor reliably
          to the screen bottom. */}
      <NotePadBar />
      {/* Persistent app header — absolute at the top of every tab screen. */}
      <TabsAppHeader />
    </View>
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
