import type { Metadata } from 'next';
import { PageShell } from '@/components/common';

export const metadata: Metadata = { title: 'System Settings' };

export default function SystemSettingsPage() {
  return <PageShell title="System Settings" description="Configure system preferences and parameters" />;
}
