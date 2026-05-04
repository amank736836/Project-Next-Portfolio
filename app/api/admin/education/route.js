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
  const body = await request.json();
  const { id, ...updates } = body;

  // Only allow specific fields to be updated
  const allowedUpdates = {};
  ['year', 'title', 'description', 'is_hidden'].forEach(field => {
    if (field in updates) allowedUpdates[field] = updates[field];
  });

  const { error } = await supabase.from('education').update(allowedUpdates).eq('id', id);
  if (error) {
    console.error('Education Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request) {
  const supabase = await createClient();
  const { id } = await request.json();
  const { error } = await supabase.from('education').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
