import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_hidden', false)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = await createAdminClient();
    const body = await request.json();

    const { platform, url, label, icon, display_order, is_hidden } = body;

    if (!platform || !url) {
      return NextResponse.json({ error: 'Platform and URL are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('social_links')
      .insert({
        platform,
        url,
        label: label || platform,
        icon: icon || platform,
        display_order: display_order || 99,
        is_hidden: is_hidden || false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}