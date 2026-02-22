import type { Metadata } from 'next';

import { ComplianceReportPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Reports — COI' };

export default function Page() {
  return <ComplianceReportPage />;
}
