import type { Metadata } from 'next';

import { UploadCOIPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Upload COI' };

export default function Page() {
  return <UploadCOIPage />;
}
