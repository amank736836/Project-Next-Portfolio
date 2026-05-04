'use client';

import { usePathname } from 'next/navigation';

/**
 * RootShell — conditionally hides portfolio-level chrome (Navbar, Themes, etc.)
 * on admin routes, since the admin layout provides its own isolated UI shell.
 */
export default function RootShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return null;

  return <>{children}</>;
}
