import { NextResponse } from 'next/server';
import { getSession, isTokenExpired } from '@/lib/cookies';

const PROTECTED_PATHS = ['/admin', '/dashboard'];
const PUBLIC_API_PATHS = ['/api/auth'];

export default async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log(`[Middleware] Checking path: ${pathname}`);

  // Check if it's an API admin route (needs protection)
  const isApiAdminRoute = pathname.startsWith('/api/admin');
  
  // Check if it's a public API route (no protection needed)
  const isPublicApiRoute = PUBLIC_API_PATHS.some(path =>
    pathname.startsWith(path)
  );

  // Check if it's a protected page route
  const isProtectedPage = PROTECTED_PATHS.some(path =>
    pathname.startsWith(path)
  );

  const needsAuth = isApiAdminRoute || isProtectedPage;

  if (needsAuth && !isPublicApiRoute) {
    const session = await getSession(request.cookies);
    const expired = session ? isTokenExpired(session) : 'N/A';
    console.log(`[Middleware] Session found: ${!!session}, Expired: ${expired}`);

    // Redirect to login if no session exists or token is expired
    if (!session || expired === true) {
      console.log(`[Middleware] Redirecting to login from ${pathname}`);
      const loginUrl = new URL('/api/auth/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      
      // If it's an API route, return 401 instead of redirecting
      if (isApiAdminRoute) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico|css|js)$).*)'],
};