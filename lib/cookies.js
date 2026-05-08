import { cookies } from 'next/headers';

// Session cookie name
const SESSION_COOKIE_NAME = 'scalekit_session';
// OAuth state cookie name
const OAUTH_STATE_COOKIE_NAME = 'oauth_state';
// Cookie expiration for OAuth state (10 minutes)
const OAUTH_STATE_COOKIE_MAX_AGE = 60 * 10;

// Session data interface
/**
 * @typedef {Object} SessionData
 * @property {Object} user - User information
 * @property {string} user.sub - Subject identifier
 * @property {string} user.email - User email
 * @property {string} user.name - User full name
 * @property {string} [user.given_name] - Given name
 * @property {string} [user.family_name] - Family name
 * @property {string} [user.preferred_username] - Preferred username
 * @property {Object} tokens - Token information
 * @property {string} tokens.access_token - Access token
 * @property {string} tokens.refresh_token - Refresh token
 * @property {string} tokens.id_token - ID token
 * @property {number} tokens.expires_at - Expiration timestamp (seconds)
 * @property {number} tokens.expires_in - Expires in (seconds)
 * @property {string[]} [roles] - User roles
 * @property {string[]} [permissions] - User permissions
 */

/**
 * Get session from cookies
 * @returns {Promise<SessionData|null>} Session data or null if not found
 */
export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  try {
    return JSON.parse(sessionCookie.value);
  } catch (error) {
    console.error('Failed to parse session cookie:', error);
    return null;
  }
}

/**
 * Set session cookie
 * @param {SessionData} session - Session data to store
 */
export async function setSession(session) {
  const cookieStore = await cookies();

  // Calculate expiration from token expires_at or default to 1 hour
  const expiresAt = session.tokens.expires_at
    ? new Date(session.tokens.expires_at * 1000)
    : new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/**
 * Clear session cookie
 */
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME, {
    path: '/',
  });
}

/**
 * Check if token is expired (within 5 minutes)
 * @param {SessionData} session - Session data
 * @returns {boolean} True if token is expired or will expire within 5 minutes
 */
export function isTokenExpired(session) {
  if (!session || !session.tokens || !session.tokens.expires_at) {
    return true;
  }

  const fiveMinutesInSeconds = 5 * 60;
  const expiresAt = session.tokens.expires_at;
  const now = Math.floor(Date.now() / 1000);

  return (expiresAt - now) <= fiveMinutesInSeconds;
}

/**
 * Get OAuth state cookie
 * @returns {Promise<string|null>} OAuth state or null
 */
export async function getOAuthState() {
  const cookieStore = await cookies();
  const stateCookie = cookieStore.get(OAUTH_STATE_COOKIE_NAME);
  return stateCookie ? stateCookie.value : null;
}

/**
 * Set OAuth state cookie
 * @param {string} state - OAuth state value
 */
export async function setOAuthState(state) {
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: OAUTH_STATE_COOKIE_MAX_AGE,
  });
}

/**
 * Clear OAuth state cookie
 */
export async function clearOAuthState() {
  const cookieStore = await cookies();
  cookieStore.delete(OAUTH_STATE_COOKIE_NAME, {
    path: '/',
  });
}