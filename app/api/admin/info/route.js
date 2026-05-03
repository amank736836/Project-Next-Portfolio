import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('personal_info')
    .select('*')
    .order('key', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request) {
  const supabase = await createClient();
  const info = await request.json();

  const { error } = await supabase.from('personal_info').upsert(info);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
