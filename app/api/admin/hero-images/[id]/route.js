import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

export async function PATCH(request, { params }) {
  if (!await isAuthenticated()) return unauthorized();

  let id = 'unknown';
  try {
    ({ id } = await params);
    const body = await request.json();
    const supabase = await createAdminClient();

    // If setting as hero, unset others
    if (body.is_hero === true) {
      await supabase.from('hero_images').update({ is_hero: false }).eq('is_hero', true);
    }

    const { data, error } = await supabase
      .from('hero_images')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    console.error(`PATCH /api/admin/hero-images/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to update hero image' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!await isAuthenticated()) return unauthorized();

  let id = 'unknown';
  try {
    ({ id } = await params);
    const supabase = await createAdminClient();

    // Get image URL first for Cloudinary cleanup
    const { error } = await supabase.from('hero_images').delete().eq('id', id);
    if (error) throw error;

    // TODO: Delete from Cloudinary if needed

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`DELETE /api/admin/hero-images/${id} error:`, error);
    return NextResponse.json({ error: 'Failed to delete hero image' }, { status: 500 });
  }
}
