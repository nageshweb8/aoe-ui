import type { Metadata } from 'next';

import { BuildingListPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Buildings — COI' };

export default function Page() {
  return <BuildingListPage />;
}
