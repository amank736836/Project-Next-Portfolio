import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

const NO_CACHE = { 'Cache-Control': 'no-store, private, must-revalidate' };

export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('skill_categories')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  return NextResponse.json(data, { headers: NO_CACHE });
}

export async function POST(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { name } = await request.json();

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'Category name required' }, { status: 400, headers: NO_CACHE });
  }

  const { data: maxOrder } = await supabase
    .from('skill_categories')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (maxOrder?.display_order || 0) + 1;

  const { data, error } = await supabase
    .from('skill_categories')
    .insert({ name: name.trim(), display_order: nextOrder, is_default: false })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409, headers: NO_CACHE });
    }
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  }

  return NextResponse.json(data, { headers: NO_CACHE });
}

export async function DELETE(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Category ID required' }, { status: 400, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();

  const { data: cat } = await supabase
    .from('skill_categories')
    .select('is_default')
    .eq('id', id)
    .single();

  if (cat?.is_default) {
    return NextResponse.json({ error: 'Cannot delete default categories' }, { status: 403, headers: NO_CACHE });
  }

  const { error } = await supabase
    .from('skill_categories')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });

  await supabase
    .from('skills')
    .update({ category: 'General' })
    .eq('category', cat?.name);

  return NextResponse.json({ success: true }, { headers: NO_CACHE });
}

export async function PUT(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const supabase = await createAdminClient();
  const { id, display_order } = await request.json();

  const { error } = await supabase
    .from('skill_categories')
    .update({ display_order })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE });
  return NextResponse.json({ success: true }, { headers: NO_CACHE });
}