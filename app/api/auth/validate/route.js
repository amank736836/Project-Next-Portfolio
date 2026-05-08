import { NextResponse } from 'next/server';
import { getSession } from '@/lib/cookies';
import { isTokenExpired } from '@/lib/cookies';

export async function GET(request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    if (isTokenExpired(session)) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({
      authenticated: true,
      user: session.user,
      // Don't send sensitive token data
    }, { status: 200 });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}