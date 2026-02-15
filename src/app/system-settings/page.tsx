import type { Metadata } from 'next';
import { SystemSettingsPage } from '@modules/system-settings';

export const metadata: Metadata = { title: 'System Settings' };

export default function Page() {
  return <SystemSettingsPage />;
}
