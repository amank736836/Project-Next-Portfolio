import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/cookies';
import { getScalekitClient } from '@/lib/scalekit';

export async function POST(request) {
  try {
    // Get Scalekit logout URL
    const scalekit = getScalekitClient();
    const session = await (await import('@/lib/cookies')).getSession();

    let logoutUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}`; // Default fallback

    if (session && session.tokens && session.tokens.id_token) {
      logoutUrl = scalekit.getLogoutUrl({
        idTokenHint: session.tokens.id_token,
        postLogoutRedirectUri: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      });
    }

    // Clear local session
    await clearSession();

    // Return logout URL for client-side redirect
    return NextResponse.json({ logoutUrl });
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, clear the session and redirect home
    await clearSession();
    return NextResponse.json({ logoutUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}` });
  }
}

// Also handle GET for compatibility
export async function GET(request) {
  return await POST(request);
}