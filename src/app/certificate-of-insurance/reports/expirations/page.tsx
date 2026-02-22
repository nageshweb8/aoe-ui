import type { Metadata } from 'next';

import { ExpirationReportPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Expiration Report — COI' };

export default function Page() {
  return <ExpirationReportPage />;
}
