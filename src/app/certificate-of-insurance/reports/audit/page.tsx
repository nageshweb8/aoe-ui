import type { Metadata } from 'next';

import { AuditTrailPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Audit Trail — COI' };

export default function Page() {
  return <AuditTrailPage />;
}
