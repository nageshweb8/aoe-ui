import type { Metadata } from 'next';

import { DataTablePage } from '@/modules/uicomponents/views/DataTablePage';

export const metadata: Metadata = { title: 'UI Components' };

export default function Page() {
  return <DataTablePage />;
}
