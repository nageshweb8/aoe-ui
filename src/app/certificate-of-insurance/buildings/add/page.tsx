import type { Metadata } from 'next';

import { AddBuildingPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Add Building — COI' };

export default function Page() {
  return <AddBuildingPage />;
}
