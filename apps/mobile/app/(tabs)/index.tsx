// Dashboard — Home tab. Ports docs/design-source/the-count-v2/project/screens/dashboard.jsx.
// Hero carousel → greeting → today's row → featured match (minus tug-of-war) →
// top research → pickup → scan.
//
// Logo + profile chrome live in the persistent AppHeader at the tab-layout
// level; the dashboard no longer renders its own header. RadialBackdrop is
// rendered once at the root layout — not here.
//
// Page horizontal padding: 12. Panels use their own 16-20px internal padding
// for content breathing room.

import { useCallback, useRef, type ReactElement } from 'react';
import { Animated, type ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import {
  APP_HEADER_CONTENT_HEIGHT,
  FeaturedMatch,
  FixtureCard,
  HeroCarousel,
  HScroll,
  Icon,
  PickupCard,
  ResearchCard,
  ScanCard,
  SectionHead,
  useResetScroll,
  useScrollY,
} from '@count/ui';
import { colors, typography } from '@count/tokens';

import { CAROUSEL } from '@/src/mock/carousel';
import { TODAY } from '@/src/mock/fixtures';
import { TOP_RESEARCH } from '@/src/mock/research';
import { FEATURED } from '@/src/mock/featured';
import { getTeam } from '@/src/mock/teams';

const PAGE_X = 12;

export default function HomeScreen(): ReactElement {
  const insets = useSafeAreaInsets();
  const scrollY = useScrollY();
  const resetScroll = useResetScroll();
  const scrollRef = useRef<ScrollView>(null);
  const featuredHome = getTeam(FEATURED.home);
  const featuredAway = getTeam(FEATURED.away);

  // Snap to top + reset the shared scroll value whenever this tab gains focus.
  // Without this, switching from a scrolled-down Fixtures tab to Dashboard
  // would inherit the previous offset and the AppHeader would stay opaque.
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      resetScroll();
    }, [resetScroll]),
  );

  return (
    <Animated.ScrollView
      ref={scrollRef}
      contentContainerStyle={{
        paddingHorizontal: PAGE_X,
        paddingTop: insets.top + APP_HEADER_CONTENT_HEIGHT + 16,
        paddingBottom: 200,
      }}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true },
      )}
    >
      {/* Hero carousel */}
      <HeroCarousel slides={CAROUSEL} />

      {/* Greeting */}
      <View style={{ marginTop: 24 }}>
        <Text style={metaStyle}>SATURDAY · 13 MAY</Text>
        <Text style={greetingStyle}>Good morning, Ben</Text>
        <Text style={greetingBodyStyle}>
          14 fixtures today. The pattern engine has surfaced{' '}
          <Text style={{ color: colors.teal.bright, fontWeight: typography.weight.medium }}>
            11 strong angles
          </Text>
          {' '}with 5/5 hit rates across your followed leagues.
        </Text>
      </View>

      {/* Today's fixtures */}
      <SectionHead label="TODAY’S FIXTURES" tone="utility" meta="Premier League · 1 of 6" />
      <HScroll
        data={TODAY}
        keyExtractor={(f) => f.id}
        renderItem={(f) => {
          const home = getTeam(f.home);
          const away = getTeam(f.away);
          const homeName = home?.name ?? f.home;
          const awayName = away?.name ?? f.away;
          const label = `${homeName} versus ${awayName}, ${f.kickoff}, signal ${f.signal}`;
          return (
            <FixtureCard
              fixture={f}
              accessibilityLabel={label}
              onPress={() => router.push(`/fixture/${f.id}`)}
            />
          );
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          marginTop: 12,
        }}
      >
        <Icon name="chevron-left" size={12} color={colors.amber.bright} />
        <Text style={hintRowStyle}>Swipe through 42 fixtures</Text>
        <Icon name="chevron-right" size={12} color={colors.amber.bright} />
      </View>

      {/* Featured match */}
      <SectionHead label="FEATURED MATCH" tone="engine" meta="Highest signal today" />
      {featuredHome && featuredAway ? (
        <FeaturedMatch
          fixture={FEATURED}
          homeTeam={featuredHome}
          awayTeam={featuredAway}
          onOpen={() => router.push(`/fixture/${FEATURED.id}`)}
        />
      ) : null}

      {/* Top Research Today */}
      <SectionHead label="TOP RESEARCH TODAY" tone="engine" meta="Ranked 2–4" />
      <View style={{ gap: 12 }}>
        {TOP_RESEARCH.map((r) => {
          const home = getTeam(r.home);
          const away = getTeam(r.away);
          if (!home || !away) return null;
          return (
            <ResearchCard
              key={r.id}
              item={r}
              homeTeam={home}
              awayTeam={away}
              onPress={() => router.push(`/fixture/${r.id}`)}
            />
          );
        })}
      </View>

      {/* Pick up where you left off — each card flex:1 inside the row. */}
      <SectionHead label="PICK UP WHERE YOU LEFT OFF" tone="utility" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <PickupCard
            meta="LAST VIEWED · 22 MIN AGO"
            title="Newcastle vs Brighton"
            sub="Player matrix · Last 5"
          />
        </View>
        <View style={{ flex: 1 }}>
          <PickupCard
            meta="SAVED BUILDER · YESTERDAY"
            title="Weekend corner build"
            sub={
              <Text style={pickupAmberSubStyle}>
                +4.20 · 2 fixtures remaining
              </Text>
            }
          />
        </View>
      </View>

      {/* Scan across fixtures */}
      <SectionHead label="SCAN ACROSS FIXTURES" tone="utility" />
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <ScanCard icon="flag" title="High corners" sub="7 fixtures · 8+ floor" />
          </View>
          <View style={{ flex: 1 }}>
            <ScanCard icon="card" title="Cards-heavy refs" sub="3 fixtures today" />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <ScanCard icon="target" title="Shots on target" sub="Player props · L5" />
          </View>
          <View style={{ flex: 1 }}>
            <ScanCard icon="sparkles" title="Ask the AI" sub="Natural language" />
          </View>
        </View>
      </View>
    </Animated.ScrollView>
  );
}

const metaStyle = {
  color: colors.text.hint,
  fontFamily: typography.fontMono,
  fontSize: 10,
  fontWeight: typography.weight.regular,
  letterSpacing: 0.4,
  textTransform: 'uppercase' as const,
};

const greetingStyle = {
  color: colors.text.primary,
  fontFamily: typography.fontSans,
  fontSize: 27,
  fontWeight: typography.weight.medium,
  letterSpacing: -0.4,
  lineHeight: 27 * 1.15,
  marginTop: 4,
};

const greetingBodyStyle = {
  color: colors.text.secondary,
  fontFamily: typography.fontSans,
  fontSize: 13,
  fontWeight: typography.weight.regular,
  lineHeight: 13 * 1.55,
  marginTop: 6,
};

const hintRowStyle = {
  color: colors.text.muted,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
};

const pickupAmberSubStyle = {
  color: colors.amber.bright,
  fontFamily: typography.fontSans,
  fontSize: 11,
  fontWeight: typography.weight.regular,
};
