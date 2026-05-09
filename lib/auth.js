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
    const refreshResponse = await scalekit.refreshAccessToken(session.tokens.refresh_token);

    // Decode the new access token to get expiration
    const decodedToken = decodeJwt(refreshResponse.access_token);
    const expiresAt = decodedToken.exp; // expires in seconds
    const expiresIn = refreshResponse.expires_in || 3600; // fallback to 1 hour

    // Update session with new tokens
    const updatedSession = {
      ...session,
      tokens: {
        ...session.tokens,
        access_token: refreshResponse.access_token,
        refresh_token: refreshResponse.refresh_token || session.tokens.refresh_token, // use new if provided, else keep old
        expires_at: expiresAt,
        expires_in: expiresIn,
      },
    };

    await setSession(updatedSession);
    return updatedSession;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    await clearSession();
    return null;
  }
}