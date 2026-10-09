import { NextResponse } from 'next/server';
import { getSession, isTokenExpired } from '@/lib/cookies';
import { refreshAccessToken } from '@/lib/auth';

const NO_CACHE = { 'Cache-Control': 'no-store, private, must-revalidate' };

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      console.log('[Validate] No session found');
      return NextResponse.json({ authenticated: false }, { status: 200, headers: NO_CACHE });
    }
    
    const tokenExpired = isTokenExpired(session);
    
    if (tokenExpired) {
      // Check if token is actually expired (not just within buffer)
      const expiresAt = session.tokens?.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const actuallyExpired = expiresAt && now >= expiresAt;
      
      if (actuallyExpired) {
        console.log('[Validate] Token actually expired, attempting refresh...');
        // Try to refresh the token
        const updatedSession = await refreshAccessToken();
        
        if (updatedSession) {
          console.log('[Validate] Token refreshed successfully');
          const newExpiresAt = Number(updatedSession?.tokens?.expires_at);
          const newExpiresIn = Number(updatedSession?.tokens?.expires_in);
          const sessionStartedAt = Number.isFinite(newExpiresAt) && Number.isFinite(newExpiresIn)
            ? Math.max(0, newExpiresAt - newExpiresIn)
            : null;
          
          return NextResponse.json({
            authenticated: true,
            user: updatedSession.user,
            sessionStartedAt,
          }, { status: 200, headers: NO_CACHE });
        }
        
        // Refresh failed
        console.log('[Validate] Token refresh failed');
        return NextResponse.json({ authenticated: false }, { status: 200, headers: NO_CACHE });
      } else {
        // Token is within buffer but not actually expired - return authenticated
        console.log('[Validate] Token within buffer but not expired, returning authenticated');
        const sessionStartedAt = Number.isFinite(expiresAt) && Number.isFinite(session.tokens?.expires_in)
          ? Math.max(0, expiresAt - session.tokens.expires_in)
          : null;
        
        return NextResponse.json({
          authenticated: true,
          user: session.user,
          sessionStartedAt,
        }, { status: 200, headers: NO_CACHE });
      }
    }
    
    // Token is still valid
    console.log('[Validate] Token valid');
    const expiresAt = Number(session?.tokens?.expires_at);
    const expiresIn = Number(session?.tokens?.expires_in);
    const sessionStartedAt = Number.isFinite(expiresAt) && Number.isFinite(expiresIn)
      ? Math.max(0, expiresAt - expiresIn)
      : null;
    
    return NextResponse.json({
      authenticated: true,
      user: session.user,
      sessionStartedAt,
    }, { status: 200, headers: NO_CACHE });
  } catch (error) {
    console.error('[Validate] Validation error:', error);
    return NextResponse.json({ authenticated: false }, { status: 200, headers: NO_CACHE });
  }
}