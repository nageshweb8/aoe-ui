import type { Metadata } from 'next';
import { ReportOptionsPage } from '@modules/report-options';

export const metadata: Metadata = { title: 'Report Options' };

export default function Page() {
  return <ReportOptionsPage />;
}
