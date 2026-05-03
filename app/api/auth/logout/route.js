import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request) {
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.delete('session');
  return response;
}

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return NextResponse.json({ success: true });
}
