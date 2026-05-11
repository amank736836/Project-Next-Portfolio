import { NextResponse } from 'next/server';
import { getValidationSummary } from '@/lib/auth';

export async function GET() {
  try {
    const validation = await getValidationSummary();
    return NextResponse.json(validation, { status: 200 });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}