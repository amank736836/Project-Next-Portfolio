import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import { logAudit } from '@/lib/audit';

export const runtime = 'nodejs';
const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

export async function GET() {
  if (!await isAuthenticated()) return unauthorized();

  try {
    const supabase = await createAdminClient();
    // Admin list: return ALL links (including hidden ones) so they can be
    // managed/un-hidden. Public visibility is filtered by the public queries.
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!await isAuthenticated()) return unauthorized();

  try {
    const supabase = await createAdminClient();
    const body = await request.json();

    const { platform, url, label, icon, display_order, is_hidden } = body;

    if (!platform || !url) {
      return NextResponse.json({ error: 'Platform and URL are required' }, { status: 400 });
    }

    const newLink = {
        platform,
        url,
        label: label ?? platform,
        icon: icon ?? platform,
        display_order: display_order ?? 99,
        is_hidden: is_hidden ?? false,
      };

    const { data, error } = await supabase
      .from('social_links')
      .insert(newLink)
      .select()
      .single();

    if (error) throw error;
    await logAudit({ action: 'create', resourceType: 'social_links', resourceId: data?.id, newData: newLink, request });
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
