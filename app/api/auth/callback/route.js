import { NextResponse } from 'next/server';
import { getScalekitClient } from '@/lib/scalekit';
import { getOAuthState, clearOAuthState, setSession } from '@/lib/cookies';
import { cookies, headers } from 'next/headers';
import { decodeJwt } from 'jose';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  // No code provided
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    // Validate state to prevent CSRF attacks
    const savedState = await getOAuthState();
    if (!state || state !== savedState) {
      return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
    }

    // Clear the OAuth state cookie after validation
    await clearOAuthState();

    // Get redirect URI - must match exactly what's configured in Scalekit dashboard
    const headersList = await headers();
    const host = headersList.get('host');
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    // Exchange code for tokens
    const scalekit = getScalekitClient();
    const authResult = await scalekit.authenticateWithCode(code, redirectUri);
    const { accessToken, refreshToken, idToken, expiresIn } = authResult;

    // Decode ID token to get user information
    let user = {};
    let roles = [];
    let permissions = [];

    if (idToken) {
      try {
        const decodedIdToken = decodeJwt(idToken);
        // Extract user information from ID token with priority order
        user = {
          sub: decodedIdToken.sub,
          email: decodedIdToken.email || '',
          name: decodedIdToken.name ||
                `${decodedIdToken.given_name || ''} ${decodedIdToken.family_name || ''}`.trim() ||
                decodedIdToken.preferred_username ||
                decodedIdToken.email ||
                'User',
          given_name: decodedIdToken.given_name,
          family_name: decodedIdToken.family_name,
          preferred_username: decodedIdToken.preferred_username,
        };

        // Extract roles and permissions from token claims
        // Check various places where permissions might be stored
        permissions =
          decodedIdToken.permissions ||
          decodedIdToken['https://scalekit.com/permissions'] ||
          decodedIdToken['scalekit:permissions'] ||
          [];

        roles = decodedIdToken.roles || decodedIdToken['https://scalekit.com/roles'] || [];
      } catch (error) {
        console.error('Failed to decode ID token:', error);
        // Fallback to minimal user info
        user = {
          sub: 'unknown',
          email: '',
          name: 'User',
        };
      }
    }

    // Calculate expiration time
    const expiresAt = Math.floor(Date.now() / 1000) + (expiresIn || 3600);

    // Create session object
    const session = {
      user,
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        id_token: idToken,
        expires_at: expiresAt,
        expires_in: expiresIn || 3600,
      },
      roles,
      permissions,
    };

    // Save session in cookie
    await setSession(session);

    // Get the stored next URL for deep link preservation
    const cookieStore = await cookies();
    const nextUrlCookie = cookieStore.get('auth_next');
    const nextUrl = nextUrlCookie ? nextUrlCookie.value : '/dashboard';

    // Clear the next URL cookie
    cookieStore.delete('auth_next', { path: '/' });

    // Redirect to the stored URL or dashboard
    return NextResponse.redirect(new URL(nextUrl, request.url));
  } catch (error) {
    console.error('Authentication failed:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
  }
}