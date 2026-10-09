import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';
const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

export async function PATCH(request, { params }) {
  if (!await isAuthenticated()) return unauthorized();

  try {
    const supabase = await createAdminClient();
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('social_links')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await logAudit({ action: 'update', resourceType: 'social_links', resourceId: id, newData: body, request });
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  if (!await isAuthenticated()) return unauthorized();

  try {
    const supabase = await createAdminClient();
    const { id } = await params;

    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('id', id);

    if (error) throw error;
    await logAudit({ action: 'delete', resourceType: 'social_links', resourceId: id, request });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
