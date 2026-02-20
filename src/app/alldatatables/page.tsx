import type { Metadata } from 'next';

import { AllDataTablePage } from '@/modules/alldatatables/views/AllDataTable';

export const metadata: Metadata = { title: 'AllDataTable' };

export default function Page() {
  return <AllDataTablePage />;
}
