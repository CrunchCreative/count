import { Tabs, usePathname, useRouter, type Href } from 'expo-router';
import { View } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BottomNav, NotePadBar, type BottomNavTab } from '@count/ui';

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

function TabBar(_: BottomTabBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const activeKey = activeKeyFromPath(pathname);

  // Single wrapper View — React Navigation's tabBar slot expects one
  // measurable container, not a fragment. NotePadBar + BottomNav are both
  // absolute-positioned children inside this wrapper.
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
      <NotePadBar />
      <BottomNav
        tabs={TABS}
        activeKey={activeKey}
        onSelect={(key) => {
          const route = ROUTE_FOR_KEY[key];
          if (route) router.navigate(route);
        }}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}