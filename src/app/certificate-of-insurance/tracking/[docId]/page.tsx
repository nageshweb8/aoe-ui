import type { Metadata } from 'next';

import { COIDocumentDetailPage } from '@modules/coi';

export const metadata: Metadata = { title: 'COI Document Detail' };

interface PageProps {
  readonly params: Promise<{ docId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { docId } = await params;
  return <COIDocumentDetailPage documentId={docId} />;
}
