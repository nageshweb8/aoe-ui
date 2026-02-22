import type { Metadata } from 'next';

import { COIDashboardPage } from '@modules/coi';

export const metadata: Metadata = { title: 'COI Dashboard' };

export default function Page() {
  return <COIDashboardPage />;
}
