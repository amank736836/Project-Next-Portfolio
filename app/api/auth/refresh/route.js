import { NextResponse } from 'next/server';
import { getSession, setSession } from '@/lib/cookies';
import { isTokenExpired } from '@/lib/cookies';

// Simple in-memory flag to prevent race conditions across tabs
// In production, you might want to use a more robust solution like Redis
const refreshInProgress = new Set();

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    // Check if token is expired (or will expire soon)
    if (!isTokenExpired(session)) {
      // Token is still valid, no need to refresh
      return NextResponse.json({ message: 'Token is still valid' });
    }

    // Prevent concurrent refresh attempts from same session
    const sessionId = session.tokens?.access_token || Math.random().toString();
    if (refreshInProgress.has(sessionId)) {
      return NextResponse.json({ error: 'Refresh already in progress' }, { status: 429 });
    }

    refreshInProgress.add(sessionId);

    try {
      // Import here to avoid circular dependencies
      const { refreshAccessToken } = await import('@/lib/auth');
      const updatedSession = await refreshAccessToken();

      if (!updatedSession) {
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401 });
      }

      return NextResponse.json({
        message: 'Token refreshed successfully',
        session: {
          user: updatedSession.user,
          // Don't send tokens to client
        }
      });
    } finally {
      refreshInProgress.delete(sessionId);
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}