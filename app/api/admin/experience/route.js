import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

const NO_CACHE = { 'Cache-Control': 'no-store, private, must-revalidate' };

export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { data, error } = await supabase.from('experience').select('*').order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  return NextResponse.json(data, { headers: NO_CACHE });
}

export async function POST(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const item = await request.json();
  const { data, error } = await supabase.from('experience').insert([item]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  return NextResponse.json(data[0], { headers: NO_CACHE });
}

export async function PUT(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const body = await request.json();
  const { id, ...updates } = body;

  const allowedUpdates = {};
  ['year', 'title', 'description', 'category', 'is_hidden'].forEach(field => {
    if (field in updates) allowedUpdates[field] = updates[field];
  });

  const { error } = await supabase.from('experience').update(allowedUpdates).eq('id', id);
  if (error) {
    console.error('Experience Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  }
  return NextResponse.json({ success: true }, { headers: NO_CACHE });
}

export async function DELETE(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  try {
    const supabase = await createAdminClient();
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400, headers: NO_CACHE });
    }

    const { error } = await supabase.from('experience').delete().eq('id', Number(id));

    if (error) {
      console.error('[API] Experience Delete Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
    }

    return NextResponse.json({ success: true }, { headers: NO_CACHE });
  } catch (err) {
    console.error('[API] Experience Delete Runtime Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: NO_CACHE });
  }
}
