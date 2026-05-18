import { NextResponse } from 'next/server';
import { getScalekitClient } from '@/lib/scalekit';
import { getOAuthState, clearOAuthState, setSession, setOAuthState } from '@/lib/cookies';
import { cookies, headers } from 'next/headers';
import { decodeJwt } from 'jose';
import crypto from 'node:crypto';

// Premium Glassmorphic Cyber-Luxe Error Screen
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function renderErrorPage(title, description, code = 'AUTH_ERROR') {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCode = escapeHtml(code);
  return new NextResponse(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Node Alert - ${safeTitle}</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #030712;
      --card-bg: rgba(15, 23, 42, 0.45);
      --border: rgba(255, 255, 255, 0.08);
      --text: #f8fafc;
      --text-muted: #94a3b8;
      --accent: #6366f1;
      --accent-glow: rgba(99, 102, 241, 0.15);
      --error-glow: rgba(244, 63, 94, 0.15);
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      overflow: hidden;
      position: relative;
    }

    /* Ambient cyber glow background */
    body::before {
      content: '';
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      top: -150px;
      left: -150px;
      z-index: 0;
      pointer-events: none;
    }

    body::after {
      content: '';
      position: absolute;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, var(--error-glow) 0%, transparent 70%);
      bottom: -150px;
      right: -150px;
      z-index: 0;
      pointer-events: none;
    }

    .error-card {
      background: var(--card-bg);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 48px;
      width: 100%;
      max-width: 540px;
      text-align: center;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05);
      z-index: 10;
      animation: scaleUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .icon-container {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      background: rgba(244, 63, 94, 0.1);
      border: 1px solid rgba(244, 63, 94, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 32px;
      color: #f43f5e;
      box-shadow: 0 0 30px rgba(244, 63, 94, 0.15);
      animation: pulse 2s infinite ease-in-out;
    }

    .node-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      border-radius: 100px;
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 24px;
    }

    .node-badge-dot {
      width: 6px;
      height: 6px;
      background: #f43f5e;
      border-radius: 50%;
      box-shadow: 0 0 10px #f43f5e;
    }

    h1 {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    p {
      color: var(--text-muted);
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 36px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 16px 24px;
      background: var(--accent);
      color: #ffffff;
      border: none;
      border-radius: 14px;
      font-size: 14px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 20px var(--accent-glow);
    }

    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
      opacity: 0.95;
    }

    .btn:active {
      transform: translateY(0);
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
      box-shadow: none;
      margin-top: 12px;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.03);
      box-shadow: none;
      transform: translateY(-2px);
    }

    @keyframes scaleUp {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 30px rgba(244, 63, 94, 0.15);
      }
      50% {
        transform: scale(1.03);
        box-shadow: 0 0 40px rgba(244, 63, 94, 0.3);
      }
    }
  </style>
</head>
<body>
  <div class="error-card">
    <div class="icon-container">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    </div>

    <div class="node-badge">
      <div class="node-badge-dot"></div>
      Security Node // Error [${safeCode}]
    </div>

    <h1>${safeTitle}</h1>
    <p>${safeDescription}</p>

    <a href="/admin" class="btn">Retry Authentication</a>
    <a href="/" class="btn btn-secondary">Return Home</a>
  </div>
</body>
</html>
  `, {
    status: 400,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const idp_initiated_login = searchParams.get('idp_initiated_login');

  // Handle IdP-initiated SSO flow
  if (idp_initiated_login) {
    try {
      console.log('[Auth Callback] Intercepted IdP-initiated login request token.');
      const scalekit = getScalekitClient();
      const claims = await scalekit.getIdpInitiatedLoginClaims(idp_initiated_login);

      // Generate cryptographically secure state for CSRF protection
      const stateVal = crypto.randomBytes(32).toString('base64url');

      // Store state and next URL in cookie for validation in callback
      const cookieStore = await cookies();
      cookieStore.set('auth_next', '/dashboard', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 10, // 10 minutes
      });

      await setOAuthState(stateVal);

      // Get redirect URI
      const headersList = await headers();
      const host = headersList.get('host');
      const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
      const redirectUri = `${protocol}://${host}/api/auth/callback`;

      // Build authorization URL with claims to bounce user to Identity Provider
      const authUrl = scalekit.getAuthorizationUrl(redirectUri, {
        connectionId: claims.connection_id,
        organizationId: claims.organization_id,
        loginHint: claims.login_hint,
        state: stateVal,
      });

      console.log('[Auth Callback] Bouncing to authorization flow:', authUrl);
      return NextResponse.redirect(authUrl);
    } catch (error) {
      console.error('[Auth Callback] IdP-initiated login claims decoding failed:', error);
      return renderErrorPage(
        'IdP Signature Failure',
        'The unsolicited identity provider token could not be decrypted, verified, or is expired. Please try launching from your organization portal again.',
        'IDP_SIGNATURE_INVALID'
      );
    }
  }

  // Standard SP-initiated OAuth flow
  if (!code) {
    console.log('[Auth Callback] Request received with no authorization code.');
    return renderErrorPage(
      'Authorization Code Missing',
      'The security handshake expects a valid authorization code from the identity provider. No code was received in this callback request.',
      'CODE_MISSING'
    );
  }

  try {
    // Validate state to prevent CSRF attacks
    const savedState = await getOAuthState();
    if (!state || state !== savedState) {
      console.warn(`[Auth Callback] CSRF State mismatch. Expected: ${savedState}, Received: ${state}`);
      return renderErrorPage(
        'CSRF Shield Active',
        'The anti-forgery token received from the identity provider is invalid or expired. Please re-initiate login.',
        'INVALID_STATE'
      );
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

        permissions =
          decodedIdToken.permissions ||
          decodedIdToken['https://scalekit.com/permissions'] ||
          decodedIdToken['scalekit:permissions'] ||
          [];

        roles = decodedIdToken.roles || decodedIdToken['https://scalekit.com/roles'] || [];
      } catch (error) {
        console.error('[Auth Callback] Failed to decode ID token:', error);
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

    // Authorized Email Check
    const AUTHORIZED_EMAIL = process.env.AUTHORIZED_ADMIN_EMAIL || 'amankarguwal0@gmail.com';
    if (user.email !== AUTHORIZED_EMAIL) {
      console.log(`[Auth Callback] Unauthorized email: ${user.email}. Restricting to ${AUTHORIZED_EMAIL}`);
      return renderErrorPage(
        'Access Level Restriction',
        `Your identity node (${user.email || 'unknown'}) is authenticated, but is not present in the master terminal control list. Only authorized operators are permitted access.`,
        'UNAUTHORIZED_EMAIL'
      );
    }

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
    console.error('[Auth Callback] Token exchange failed:', error);
    return renderErrorPage(
      'Gateway Authentication Failure',
      'The identity provider rejected the authorization token exchange request. Please check the network connectivity or retry logging in.',
      'EXCHANGE_FAILED'
    );
  }
}