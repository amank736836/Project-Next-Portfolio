import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase.from('projects').insert([body]).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function PUT(request) {
  const supabase = await createClient();
  const body = await request.json();
  const { id, ...updates } = body;

  const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function DELETE(request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
