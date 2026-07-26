import { NextResponse } from 'next/server';
import { clearSession, getSession, setOAuthState } from '@/lib/cookies';
import { getScalekitClient } from '@/lib/scalekit';
import { getSiteUrl, getAuthCallbackUrl } from '@/lib/config';
import { cookies } from 'next/headers';
import crypto from 'node:crypto';

export async function GET(request) {
  try {
    const scalekit = getScalekitClient();
    const session = await getSession();

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const appBaseUrl = getSiteUrl() || `${protocol}://${host}`;

    // Get next URL - default to home (/) instead of /admin for unauthorized users
    const nextUrl = request.nextUrl.searchParams.get('next') || '/';
    
    // Store next URL for after re-login
    const cookieStore = await cookies();
    cookieStore.set('auth_next', nextUrl, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 10,
    });

    // Generate new OAuth state
    const state = crypto.randomBytes(32).toString('base64url');
    await setOAuthState(state);

    // Clear local session
    await clearSession();

    // Redirect to Scalekit logout, then directly to login page
    const loginUrl = `${appBaseUrl}/api/auth/login?next=${encodeURIComponent(nextUrl)}`;
    let logoutUrl = loginUrl;

    if (session && session.tokens && session.tokens.id_token) {
      logoutUrl = scalekit.getLogoutUrl({
        idTokenHint: session.tokens.id_token,
        postLogoutRedirectUri: loginUrl,
      });
    }

    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    console.error('Retry auth error:', error);
    await clearSession();
    const loginUrl = new URL('/api/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}