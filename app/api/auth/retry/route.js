import { NextResponse } from 'next/server';
import { clearSession, clearOAuthState } from '@/lib/cookies';
import { cookies } from 'next/headers';

export async function GET(request) {
  // Clear all auth-related cookies
  const cookieStore = await cookies();
  
  // Clear session cookie
  cookieStore.delete('scalekit_session', { path: '/' });
  
  // Clear OAuth state cookie
  cookieStore.delete('scalekit_oauth_state', { path: '/' });
  
  // Clear next URL cookie
  cookieStore.delete('auth_next', { path: '/' });
  
  // Also call the utility functions for consistency
  await clearSession();
  await clearOAuthState();

  // Redirect to login page to start fresh OAuth flow
  const loginUrl = new URL('/api/auth/login', request.url);
  return NextResponse.redirect(loginUrl);
}