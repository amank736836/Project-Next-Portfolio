import { scalekit } from '@/lib/scalekit';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const redirectUri = 'http://localhost:3000/api/auth/callback';

  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  try {
    const authResult = await scalekit.authenticateWithCode(code, redirectUri);
    const { user, accessToken } = authResult;

    // Save session in a cookie and redirect to admin dashboard
    const response = NextResponse.redirect(new URL('/admin', request.url));
    response.cookies.set('session', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Authentication failed:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 400 });
  }
}
