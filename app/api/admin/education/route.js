import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const supabase = await createClient();
  const item = await request.json();
  const { data, error } = await supabase.from('education').insert([item]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function PUT(request) {
  const supabase = await createClient();
  const item = await request.json();
  const { error } = await supabase.from('education').update(item).eq('id', item.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const supabase = await createClient();
  const { id } = await request.json();
  const { error } = await supabase.from('education').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
