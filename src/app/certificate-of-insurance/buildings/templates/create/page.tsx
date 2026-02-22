import type { Metadata } from 'next';

import { CreateTemplatePage } from '@modules/coi';

export const metadata: Metadata = { title: 'Create Template — COI' };

export default function Page() {
  return <CreateTemplatePage />;
}
