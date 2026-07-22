import { NextResponse } from 'next/server';
import { getSession, setSession } from '@/lib/cookies';
import { isTokenExpired } from '@/lib/cookies';

const NO_CACHE = { 'Cache-Control': 'no-store, private, must-revalidate' };

// Simple in-memory flag to prevent race conditions across tabs
const refreshInProgress = new Set();

export async function POST(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401, headers: NO_CACHE });
    }

    if (!isTokenExpired(session)) {
      return NextResponse.json({ message: 'Token is still valid' }, { headers: NO_CACHE });
    }

    const sessionId = session.user?.sub || session.user?.id || session.user?.email || session.tokens?.access_token || Math.random().toString();
    if (refreshInProgress.has(sessionId)) {
      return NextResponse.json({ error: 'Refresh already in progress' }, { status: 429, headers: NO_CACHE });
    }

    refreshInProgress.add(sessionId);

    try {
      const { refreshAccessToken } = await import('@/lib/auth');
      const updatedSession = await refreshAccessToken();

      if (!updatedSession) {
        return NextResponse.json({ error: 'Failed to refresh token' }, { status: 401, headers: NO_CACHE });
      }

      return NextResponse.json({
        message: 'Token refreshed successfully',
        session: {
          user: updatedSession.user,
        }
      }, { headers: NO_CACHE });
    } finally {
      refreshInProgress.delete(sessionId);
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: NO_CACHE });
  }
}