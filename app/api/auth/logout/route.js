import { NextResponse } from 'next/server';
import { clearSession, getSession } from '@/lib/cookies';
import { getScalekitClient } from '@/lib/scalekit';

async function handleLogout(request) {
  try {
    // Get Scalekit logout URL
    const scalekit = getScalekitClient();
    const session = await getSession();

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;

    // Ensure we have a valid logout URL as fallback
    let logoutUrl = appBaseUrl.endsWith('/') ? appBaseUrl : `${appBaseUrl}/`;

    if (session && session.tokens && session.tokens.id_token) {
      // Scalekit is strict about trailing slashes, so we ensure consistency
      const postLogoutRedirectUri = appBaseUrl.endsWith('/') ? appBaseUrl : `${appBaseUrl}/`;
      
      logoutUrl = scalekit.getLogoutUrl({
        idTokenHint: session.tokens.id_token,
        postLogoutRedirectUri: postLogoutRedirectUri,
      });
      
      console.log(`[Auth] Redirecting to Scalekit logout with postLogoutRedirectUri: ${postLogoutRedirectUri}`);
    }

    // Clear local session
    await clearSession();

    // For POST requests, return JSON so client-side code can do window.location.href
    if (request.method === 'POST') {
      return NextResponse.json({ logoutUrl });
    }
    
    // For GET requests (e.g. direct link or window.location redirect), perform an HTTP Redirect
    return NextResponse.redirect(logoutUrl);
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, clear the session and redirect home
    await clearSession();
    const fallbackUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    if (request.method === 'POST') {
      return NextResponse.json({ logoutUrl: fallbackUrl });
    }
    return NextResponse.redirect(fallbackUrl);
  }
}

export async function POST(request) {
  return await handleLogout(request);
}

// Also handle GET for compatibility
export async function GET(request) {
  return await handleLogout(request);
}