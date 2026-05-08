import { hasPermission } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Prevent caching of protected pages
export const dynamic = 'force-dynamic';

export default async function AdminSettings() {
  // Check if user has admin permissions
  const hasAdminAccess = await hasPermission('org:admin');

  // If not authorized, redirect to permission denied page
  if (!hasAdminAccess) {
    return redirect('/permission-denied');
  }

  return (
    <div>
      <h1>Admin Settings</h1>
      <p>This page is only accessible to users with organization admin permissions.</p>

      <div>
        <h2>Settings</h2>
        <p>Manage organization settings, user roles, and permissions.</p>
      </div>
    </div>
  );
}

// Also create a permission denied page
export async function generateMetadata() {
  return {
    title: "Permission Denied",
    description: "You don't have permission to access this page."
  };
}