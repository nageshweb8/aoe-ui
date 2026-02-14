import type { Metadata } from 'next';
import { PageShell } from '@/components/common';

export const metadata: Metadata = { title: 'Rent Roll' };

export default function RentRollPage() {
  return <PageShell title="Rent Roll" description="View and manage tenant rent rolls" />;
}
