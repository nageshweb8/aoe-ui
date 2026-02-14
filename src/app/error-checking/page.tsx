import type { Metadata } from 'next';
import { PageShell } from '@/components/common';

export const metadata: Metadata = { title: 'Error Checking' };

export default function ErrorCheckingPage() {
  return <PageShell title="Error Checking" description="Review and resolve data validation errors" />;
}
