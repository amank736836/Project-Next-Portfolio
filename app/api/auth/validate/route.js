import { NextResponse } from 'next/server';
import { getValidationSummary } from '@/lib/auth';

const NO_CACHE = { 'Cache-Control': 'no-store, private, must-revalidate' };

export async function GET() {
  try {
    const validation = await getValidationSummary();
    return NextResponse.json(validation, { status: 200, headers: NO_CACHE });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500, headers: NO_CACHE });
  }
}