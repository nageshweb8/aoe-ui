import type { Metadata } from 'next';
import { PageShell } from '@/components/common';

export const metadata: Metadata = { title: 'Copy / Import' };

export default function CopyImportPage() {
  return <PageShell title="Copy / Import" description="Copy and import data between buildings and years" />;
}
