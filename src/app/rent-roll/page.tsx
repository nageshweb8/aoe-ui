import type { Metadata } from 'next';
import { RentRollPage } from '@modules/rent-roll';

export const metadata: Metadata = { title: 'Rent Roll' };

export default function Page() {
  return <RentRollPage />;
}
