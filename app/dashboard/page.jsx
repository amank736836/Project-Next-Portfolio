import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/api/auth/login');
  }

  // Redirect authenticated users directly to the high-fidelity Admin Portal
  redirect('/admin');

  return null; // Should not be reached
}