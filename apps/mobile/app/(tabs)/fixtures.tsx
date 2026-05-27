// Fixtures tab — landing page for the Fixtures bottom-nav tab.
// Wires the typed mock `FIXTURES_ALL` to the FixturesList screen primitive
// and routes each card press to `/fixture/[id]`.

import type { ReactElement } from 'react';
import { router } from 'expo-router';
import { FixturesList } from '@count/ui';

import { FIXTURES_ALL } from '@/src/mock/fixtures-all';
import { getTeam } from '@/src/mock/teams';

export default function FixturesScreen(): ReactElement {
  return (
    <FixturesList
      fixturesByLeague={FIXTURES_ALL}
      resolveTeam={getTeam}
      onOpenFixture={(id) => router.push(`/fixture/${id}`)}
    />
  );
}
