import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

const NO_CACHE = { 'Cache-Control': 'no-store, private, must-revalidate' };

export async function GET() {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  try {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from('resumes')
      .select('id, title, file_url, file_name, file_size, is_active, is_favorite, uploaded_at, updated_at')
      .order('uploaded_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || [], { headers: NO_CACHE });
  } catch (error) {
    console.error('Fetch resumes error:', error);
    return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500, headers: NO_CACHE });
  }
}

export async function PUT(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  try {
    const supabase = await createAdminClient();
    const body = await request.json();
    const { id, is_active, is_favorite, title } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing resume ID' }, { status: 400, headers: NO_CACHE });
    }

    const updates = {};
    if (typeof is_active === 'boolean') updates.is_active = is_active;
    if (typeof is_favorite === 'boolean') updates.is_favorite = is_favorite;
    if (title) updates.title = title;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400, headers: NO_CACHE });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { headers: NO_CACHE });
  } catch (error) {
    console.error('Update resume error:', error);
    return NextResponse.json({ error: 'Failed to update resume' }, { status: 500, headers: NO_CACHE });
  }
}

export async function DELETE(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  try {
    const supabase = await createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing resume ID' }, { status: 400, headers: NO_CACHE });
    }

    // Get resume to find file path
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('file_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete from Supabase Storage
    if (resume?.file_url) {
      const url = new URL(resume.file_url);
      const pathParts = url.pathname.split('/portfolio-resumes/');
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        await supabase.storage.from('portfolio-resumes').remove([filePath]);
      }
    }

    // Delete from database
    const { error } = await supabase.from('resumes').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true }, { headers: NO_CACHE });
  } catch (error) {
    console.error('Delete resume error:', error);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500, headers: NO_CACHE });
  }
}