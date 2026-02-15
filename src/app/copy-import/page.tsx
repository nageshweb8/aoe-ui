import type { Metadata } from 'next';
import { CopyImportPage } from '@modules/copy-import';

export const metadata: Metadata = { title: 'Copy / Import' };

export default function Page() {
  return <CopyImportPage />;
}
