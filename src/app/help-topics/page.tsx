import type { Metadata } from 'next';
import { HelpTopicsPage } from '@modules/help-topics';

export const metadata: Metadata = { title: 'Help Topics' };

export default function Page() {
  return <HelpTopicsPage />;
}
