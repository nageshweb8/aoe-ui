import type { Metadata } from 'next';

import { RequirementTemplatesPage } from '@modules/coi';

export const metadata: Metadata = { title: 'Requirement Templates — COI' };

export default function Page() {
  return <RequirementTemplatesPage />;
}
