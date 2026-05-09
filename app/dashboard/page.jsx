import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

// Prevent caching of protected pages
export const dynamic = 'force-dynamic';
// Alternative: export const revalidate = 0;

export default async function Dashboard() {
  const user = await getCurrentUser();

  // Redirect to login if not authenticated (extra protection)
  if (!user) {
    return redirect('/api/auth/login');
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name || 'User'}!</p>
      <p>Email: {user.email}</p>
      <p>User ID: {user.sub}</p>

      <div>
        <h2>User Details</h2>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>

      <div>
        <LogoutButton />
      </div>
    </div>
  );
}