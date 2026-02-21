import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Certificate of Insurance' };

export default function Page() {
  redirect('/certificate-of-insurance/dashboard');
}
