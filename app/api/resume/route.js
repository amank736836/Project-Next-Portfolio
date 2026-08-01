import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createAdminClient();

    const { data, error } = await supabase
      .from('resumes')
      .select('id, title, file_url, file_name, file_size, is_active, is_favorite, uploaded_at')
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No active resume in DB, check local fallback
        return NextResponse.json({
          id: 0,
          title: 'Resume',
          file_url: '/api/resume/view',
          file_name: 'Aman_Resume.pdf',
          file_size: 0,
          is_active: true,
          is_favorite: false,
          uploaded_at: new Date().toISOString(),
        });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}