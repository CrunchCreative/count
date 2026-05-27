// Fixtures tab — landing page for the Fixtures bottom-nav tab.
// Wires the typed mock `FIXTURES_ALL` to the FixturesList screen primitive
// and routes each card press to `/fixture/[id]`. On tab focus, scrolls the
// list back to the top and resets the shared scroll value so the AppHeader
// renders transparent on entry.

import { useCallback, useRef, type ReactElement } from 'react';
import { router, useFocusEffect } from 'expo-router';
import { FixturesList, useResetScroll, type FixturesListHandle } from '@count/ui';

import { FIXTURES_ALL } from '@/src/mock/fixtures-all';
import { getTeam } from '@/src/mock/teams';

export default function FixturesScreen(): ReactElement {
  const ref = useRef<FixturesListHandle>(null);
  const resetScroll = useResetScroll();

  useFocusEffect(
    useCallback(() => {
      ref.current?.scrollToTop();
      resetScroll();
    }, [resetScroll]),
  );

  return (
    <FixturesList
      ref={ref}
      fixturesByLeague={FIXTURES_ALL}
      resolveTeam={getTeam}
      onOpenFixture={(id) => router.push(`/fixture/${id}`)}
    />
  );
}
