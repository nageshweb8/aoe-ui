import type { Metadata } from 'next';

import { COITrackingListPage } from '@modules/coi';

export const metadata: Metadata = { title: 'COI Tracking' };

export default function Page() {
  return <COITrackingListPage />;
}
