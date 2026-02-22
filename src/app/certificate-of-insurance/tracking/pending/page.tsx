import type { Metadata } from 'next';

import { PendingReviewPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Pending Review — COI' };

export default function Page() {
  return <PendingReviewPage />;
}
