import type { Metadata } from 'next';
import { PageShell } from '@/components/common';

export const metadata: Metadata = { title: 'Walk Throughs' };

export default function WalkThroughsPage() {
  return <PageShell title="Walk Throughs" description="Manage building walk-through inspections" />;
}
