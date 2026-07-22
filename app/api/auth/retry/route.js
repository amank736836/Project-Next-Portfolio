import { NextResponse } from 'next/server';
import { clearSession, getSession } from '@/lib/cookies';
import { getScalekitClient } from '@/lib/scalekit';
import { getSiteUrl } from '@/lib/config';

export async function GET(request) {
  try {
    // Get Scalekit logout URL using current session's id_token
    const scalekit = getScalekitClient();
    const session = await getSession();

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const appBaseUrl = getSiteUrl() || `${protocol}://${host}`;
    const postLogoutRedirectUri = appBaseUrl.endsWith('/') ? appBaseUrl : `${appBaseUrl}/`;

    let logoutUrl = postLogoutRedirectUri;

    if (session && session.tokens && session.tokens.id_token) {
      logoutUrl = scalekit.getLogoutUrl({
        idTokenHint: session.tokens.id_token,
        postLogoutRedirectUri,
      });
    }

    // Clear local session
    await clearSession();

    // Redirect to Scalekit logout, which will then redirect to postLogoutRedirectUri
    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    console.error('Retry auth error:', error);
    // Even if there's an error, clear the session and redirect to login
    await clearSession();
    const loginUrl = new URL('/api/auth/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
}