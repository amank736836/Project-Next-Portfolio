import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

const NO_CACHE = { 'Cache-Control': 'no-store, private, must-revalidate' };
const ALLOWED_PROJECT_FIELDS = [
  'title', 'description', 'image', 'img', 'category',
  'is_hidden', 'details'
];

function sanitizeProjectBody(body) {
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => ALLOWED_PROJECT_FIELDS.includes(key))
  );
}

export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  return NextResponse.json(data, { headers: NO_CACHE });
}

export async function POST(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const body = await request.json();
  const safeBody = sanitizeProjectBody(body);
  if (safeBody.is_hidden === undefined) {
    safeBody.is_hidden = true;
  }

  const { data, error } = await supabase.from('projects').insert([safeBody]).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  await logAudit({ action: 'create', resourceType: 'projects', resourceId: data?.[0]?.id, newData: safeBody, request });
  return NextResponse.json(data[0], { headers: NO_CACHE });
}

export async function PUT(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const body = await request.json();
  const { id, ...rest } = body;
  const updates = sanitizeProjectBody(rest);

  const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  await logAudit({ action: 'update', resourceType: 'projects', resourceId: id, newData: updates, request });
  return NextResponse.json(data[0], { headers: NO_CACHE });
}

export async function DELETE(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  await logAudit({ action: 'delete', resourceType: 'projects', resourceId: id, request });
  return NextResponse.json({ success: true }, { headers: NO_CACHE });
}