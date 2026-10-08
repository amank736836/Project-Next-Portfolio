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
  const { data, error } = await supabase
    .from('personal_info')
    .select('*')
    .order('key', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  return NextResponse.json(data, { headers: NO_CACHE });
}

export async function POST(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const body = await request.json();
  const item = {
    key: body.key || `custom_${Date.now()}`,
    title: body.title || 'Custom Field',
    description: body.description || '',
    is_hidden: body.is_hidden || false,
  };

  const { data, error } = await supabase.from('personal_info').upsert([item]).select();
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  await logAudit({ action: 'create', resourceType: 'personal_info', resourceId: item.key, newData: item, request });
  return NextResponse.json(data[0], { headers: NO_CACHE });
}

export async function PUT(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const info = await request.json();
  const payload = Array.isArray(info) ? info : [info];

  const { error } = await supabase.from('personal_info').upsert(payload);

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  await logAudit({ action: 'update', resourceType: 'personal_info', resourceId: payload?.[0]?.key, newData: payload, request });
  return NextResponse.json({ success: true }, { headers: NO_CACHE });
}

export async function PATCH(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  const body = await request.json();

  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400, headers: NO_CACHE });
  }

  const { error } = await supabase
    .from('personal_info')
    .update({ is_hidden: body.is_hidden })
    .eq('key', key);

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  await logAudit({ action: 'visibility_toggle', resourceType: 'personal_info', resourceId: key, newData: { is_hidden: body.is_hidden }, request });
  return NextResponse.json({ success: true }, { headers: NO_CACHE });
}

export async function DELETE(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (!key) {
    return NextResponse.json({ error: 'Missing key' }, { status: 400, headers: NO_CACHE });
  }

  const { error } = await supabase.from('personal_info').delete().eq('key', key);
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  await logAudit({ action: 'delete', resourceType: 'personal_info', resourceId: key, request });
  return NextResponse.json({ success: true }, { headers: NO_CACHE });
}