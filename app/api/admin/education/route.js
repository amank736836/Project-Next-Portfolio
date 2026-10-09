import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

const NO_CACHE = { 'Cache-Control': 'no-store, private, must-revalidate' };

export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { data, error } = await supabase.from('education').select('*').order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  return NextResponse.json(data, { headers: NO_CACHE });
}

export async function POST(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const item = await request.json();
  const { data, error } = await supabase.from('education').insert([item]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  await logAudit({ action: 'create', resourceType: 'education', resourceId: data?.[0]?.id, newData: item, request });
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

  const { error } = await supabase.from('education').update(allowedUpdates).eq('id', id);
  if (error) {
    console.error('Education Update Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  }
  await logAudit({ action: 'update', resourceType: 'education', resourceId: id, newData: allowedUpdates, request });
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

    const { error } = await supabase.from('education').delete().eq('id', Number(id));

    if (error) {
      console.error('[API] Education Delete Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
    }

    await logAudit({ action: 'delete', resourceType: 'education', resourceId: id, request });
    return NextResponse.json({ success: true }, { headers: NO_CACHE });
  } catch (err) {
    console.error('[API] Education Delete Runtime Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500, headers: NO_CACHE });
  }
}
