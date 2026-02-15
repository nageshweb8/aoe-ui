import type { Metadata } from 'next';
import { WalkThroughsPage } from '@modules/walk-throughs';

export const metadata: Metadata = { title: 'Walk Throughs' };

export default function Page() {
  return <WalkThroughsPage />;
}
