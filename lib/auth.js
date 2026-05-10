import { getScalekitClient } from './scalekit.js';
import { getSession, setSession, clearSession, isTokenExpired } from './cookies.js';
import { decodeJwt } from 'jose';

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session && !isTokenExpired(session);
}

/**
 * Get current user from session
 * @returns {Promise<Object|null>} User object or null
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session ? session.user : null;
}

/**
 * Get access token from session
 * @returns {Promise<string|null>} Access token or null
 */
export async function getAccessToken() {
  const session = await getSession();
  return session ? session.tokens.access_token : null;
}

/**
 * Get refresh token from session
 * @returns {Promise<string|null>} Refresh token or null
 */
export async function getRefreshToken() {
  const session = await getSession();
  return session ? session.tokens.refresh_token : null;
}

/**
 * Check if user has specific permission
 * @param {string} permission - Permission to check (e.g., 'read:data')
 * @returns {Promise<boolean>} True if user has permission
 */
export async function hasPermission(permission) {
  const session = await getSession();
  if (!session) return false;

  // Check if token is expired
  if (isTokenExpired(session)) {
    return false;
  }

  // Check permissions in session
  const userPermissions = session.permissions || [];
  if (userPermissions.includes(permission)) {
    return true;
  }

  // Check roles that might imply permissions
  const userRoles = session.roles || [];
  // You can add role-based permission checking here if needed
  // For example: if (userRoles.includes('admin')) return true;

  return false;
}

/**
 * Refresh access token using refresh token
 * @returns {Promise<Object|null>} New session data or null if failed
 */
export async function refreshAccessToken() {
  const session = await getSession();
  if (!session) return null;

  try {
    const scalekit = getScalekitClient();

    // Call the SDK. Different SDK versions may return different shapes;
    // be tolerant to either camelCase or snake_case, or wrapped tokens.
    const raw = await scalekit.refreshAccessToken(session.tokens.refresh_token);

    // Normalize possible return shapes
    let accessToken = raw?.accessToken || raw?.access_token || raw?.data?.access_token || raw?.data?.accessToken;
    let refreshToken = raw?.refreshToken || raw?.refresh_token || raw?.data?.refresh_token || raw?.data?.refreshToken;
    let expiresIn = raw?.expires_in || raw?.expiresIn || raw?.data?.expires_in || raw?.data?.expiresIn || 3600;

    if (!accessToken) {
      // Some SDKs return a token object
      const maybeTokens = raw?.tokens || raw?.data?.tokens;
      accessToken = accessToken || maybeTokens?.access_token || maybeTokens?.accessToken;
      refreshToken = refreshToken || maybeTokens?.refresh_token || maybeTokens?.refreshToken;
      expiresIn = expiresIn || maybeTokens?.expires_in || maybeTokens?.expiresIn;
    }

    if (!accessToken) {
      throw new Error('No access token returned from Scalekit refresh');
    }

    // Decode the new access token to get expiration (seconds)
    const decodedToken = decodeJwt(accessToken);
    const expiresAt = decodedToken?.exp || Math.floor(Date.now() / 1000) + (expiresIn || 3600);

    // Update session with new tokens
    const updatedSession = {
      ...session,
      tokens: {
        ...session.tokens,
        access_token: accessToken,
        refresh_token: refreshToken || session.tokens.refresh_token,
        expires_at: expiresAt,
        expires_in: expiresIn,
      },
    };

    await setSession(updatedSession);
    return updatedSession;
  } catch (error) {
    console.error('Failed to refresh access token:', error);

    // Only clear session on explicit invalid_grant or token revocation errors.
    const message = error?.message || '';
    const status = error?.response?.status || error?.status;
    if (message.includes('invalid_grant') || status === 400 || status === 401) {
      await clearSession();
    }

    return null;
  }
}