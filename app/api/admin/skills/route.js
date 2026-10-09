import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

const NO_CACHE = { 'Cache-Control': 'no-store, private, must-revalidate' };
const ALLOWED_SKILL_FIELDS = [
  'title', 'percentage', 'category', 'icon', 'color', 'is_featured', 'is_hidden'
];

function sanitizeSkill(body) {
  return Object.fromEntries(
    Object.entries(body).filter(([key]) => ALLOWED_SKILL_FIELDS.includes(key))
  );
}

export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  return NextResponse.json(data, { headers: NO_CACHE });
}

export async function POST(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const skill = sanitizeSkill(await request.json());
  if (!skill.title?.trim()) {
    return NextResponse.json({ error: 'Skill title is required' }, { status: 400, headers: NO_CACHE });
  }
  const { data, error } = await supabase.from('skills').insert([skill]).select().single();

  if (error) {
    console.error('Skill Create Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  }
  await logAudit({ action: 'create', resourceType: 'skills', resourceId: data?.id, newData: skill, request });
  return NextResponse.json(data, { headers: NO_CACHE });
}

export async function PUT(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400, headers: NO_CACHE });

  const { data, error } = await supabase
    .from('skills')
    .update(sanitizeSkill(body))
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  await logAudit({ action: 'update', resourceType: 'skills', resourceId: id, newData: sanitizeSkill(body), request });
  return NextResponse.json(data, { headers: NO_CACHE });
}

export async function PATCH(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const body = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400, headers: NO_CACHE });
  }

  const { error } = await supabase
    .from('skills')
    .update({ is_hidden: body.is_hidden })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  await logAudit({ action: 'visibility_toggle', resourceType: 'skills', resourceId: id, newData: { is_hidden: body.is_hidden }, request });
  return NextResponse.json({ success: true }, { headers: NO_CACHE });
}

export async function DELETE(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400, headers: NO_CACHE });

  const { error } = await supabase.from('skills').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  await logAudit({ action: 'delete', resourceType: 'skills', resourceId: id, request });
  return NextResponse.json({ success: true }, { headers: NO_CACHE });
}
