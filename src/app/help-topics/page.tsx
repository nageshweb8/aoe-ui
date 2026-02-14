import type { Metadata } from 'next';
import { PageShell } from '@/components/common';

export const metadata: Metadata = { title: 'Help Topics' };

export default function HelpTopicsPage() {
  return <PageShell title="Help Topics" description="Documentation and support resources" />;
}
