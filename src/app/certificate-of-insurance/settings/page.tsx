import type { Metadata } from 'next';

import { COISettingsPage } from '@modules/coi';

export const metadata: Metadata = { title: 'COI Settings' };

export default function Page() {
  return <COISettingsPage />;
}
