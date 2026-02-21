import type { Metadata } from 'next';

import { AddVendorPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Add Vendor — COI' };

export default function Page() {
  return <AddVendorPage />;
}
