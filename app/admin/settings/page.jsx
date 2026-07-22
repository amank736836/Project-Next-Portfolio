import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Prevent caching of protected pages
export const dynamic = 'force-dynamic';

export default async function AdminSettings() {
  // Only the authorized operator can hold a session, so an authenticated
  // session is sufficient to view settings.
  const user = await getCurrentUser();
  if (!user) {
    return redirect('/api/auth/login');
  }

  return (
    <div>
      <h1>Admin Settings</h1>
      <p>Operator-only configuration and system settings.</p>

      <div>
        <h2>Settings</h2>
        <p>Manage organization settings, user roles, and permissions.</p>
      </div>
    </div>
  );
}

// Also create a metadata block for the page.
export async function generateMetadata() {
  return {
    title: "Admin Settings",
    description: "Manage operator account and dashboard settings."
  };
}