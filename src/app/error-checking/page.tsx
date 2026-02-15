import type { Metadata } from 'next';
import { ErrorCheckingPage } from '@modules/error-checking';

export const metadata: Metadata = { title: 'Error Checking' };

export default function Page() {
  return <ErrorCheckingPage />;
}
