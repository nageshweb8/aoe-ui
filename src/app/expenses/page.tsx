import type { Metadata } from 'next';
import { PageShell } from '@/components/common';

export const metadata: Metadata = { title: 'Expenses' };

export default function ExpensesPage() {
  return <PageShell title="Expenses" description="Track and manage building expenses" />;
}
