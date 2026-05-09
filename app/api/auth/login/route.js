import { getScalekitClient } from '@/lib/scalekit';
import { getDefaultScopes } from '@/lib/scalekit';
import { setOAuthState } from '@/lib/cookies';
import { cookies, headers } from 'next/headers';
import crypto from 'node:crypto';

export async function GET(request) {
  const scalekit = getScalekitClient();
  const requestUrl = new URL(request.url);

  // Get the 'next' parameter for deep link preservation
  const { searchParams } = requestUrl;
  const nextUrl = searchParams.get('next') || '/dashboard';

  // Validate next URL to prevent open redirect attacks
  let safeNextUrl = '/dashboard';
  try {
    const url = new URL(nextUrl, requestUrl);
    // Only allow relative paths (same origin)
    if (url.origin === requestUrl.origin && url.pathname.startsWith('/')) {
      safeNextUrl = url.pathname + url.search;
    }
  } catch (error) {
    // If URL parsing fails, use default
    console.warn('Invalid next URL:', nextUrl);
  }

  // Generate cryptographically secure state for CSRF protection
  const state = crypto.randomBytes(32).toString('base64url');

  // Store state and next URL in cookie for validation in callback
  const cookieStore = await cookies();
  cookieStore.set('auth_next', safeNextUrl, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
  });

  await setOAuthState(state);

  // Get redirect URI - must match exactly what's configured in Scalekit dashboard
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const redirectUri = `${protocol}://${host}/api/auth/callback`;

  // Get default scopes
  const scopes = getDefaultScopes();

  // Generate authorization URL
  const authUrl = scalekit.getAuthorizationUrl(redirectUri, {
    state,
    scopes,
  });

  // Redirect to Scalekit authorization endpoint
  return Response.redirect(authUrl);
}