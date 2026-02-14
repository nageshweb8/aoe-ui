import type { Metadata } from 'next';
import { PageShell } from '@/components/common';

export const metadata: Metadata = { title: 'Report Options' };

export default function ReportOptionsPage() {
  return <PageShell title="Report Options" description="Configure and generate escalation reports" />;
}
