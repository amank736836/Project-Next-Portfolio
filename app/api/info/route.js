import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('personal_info')
    .select('*')
    // Public surface: never expose rows the admin has marked as hidden.
    .eq('is_hidden', false)
    .order('key', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  });
}