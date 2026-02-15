import type { Metadata } from 'next';

import { CertificateOfInsurancePage } from '@modules/coi';

export const metadata: Metadata = { title: 'COI Verification' };

export default function Page() {
  return <CertificateOfInsurancePage />;
}
