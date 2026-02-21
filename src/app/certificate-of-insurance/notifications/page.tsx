import type { Metadata } from 'next';

import { NotificationSettingsPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Notifications — COI' };

export default function Page() {
  return <NotificationSettingsPage />;
}
