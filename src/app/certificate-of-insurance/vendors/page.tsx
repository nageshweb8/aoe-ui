import type { Metadata } from 'next';

import { VendorListPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Vendors — COI' };

export default function Page() {
  return <VendorListPage />;
}
