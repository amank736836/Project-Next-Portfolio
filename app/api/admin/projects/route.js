import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

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
  console.log('[API] GET /api/admin/projects hit');
  // Check authentication
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createAdminClient();
  const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request) {
  // Check authentication
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createAdminClient();
  const body = await request.json();
  const safeBody = sanitizeProjectBody(body);
  if (safeBody.is_hidden === undefined) {
    safeBody.is_hidden = true;
  }

  const { data, error } = await supabase.from('projects').insert([safeBody]).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function PUT(request) {
  // Check authentication
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createAdminClient();
  const body = await request.json();
  const { id, ...rest } = body;
  const updates = sanitizeProjectBody(rest);

  const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data[0]);
}

export async function DELETE(request) {
  // Check authentication
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = await createAdminClient();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { error } = await supabase.from('projects').delete().eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
