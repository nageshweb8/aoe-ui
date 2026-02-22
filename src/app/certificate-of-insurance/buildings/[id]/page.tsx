import type { Metadata } from 'next';

import { BuildingDetailPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Building Details — COI' };

export default function Page() {
  return <BuildingDetailPage />;
}
