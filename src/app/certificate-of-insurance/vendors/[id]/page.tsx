import type { Metadata } from 'next';

import { VendorDetailPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Vendor Details — COI' };

export default function Page() {
  return <VendorDetailPage />;
}
