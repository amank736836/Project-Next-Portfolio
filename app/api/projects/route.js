import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const revalidate = 60;

export async function GET() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_hidden', false)
    .order('id', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Filter projects to guarantee mandatory details are complete before public display
  const verifiedProjects = (data || []).filter(project => {
    // 1. Mandatory Title check
    if (!project.title || project.title.trim() === '') return false;

    // 2. Image is optional now — card falls back to live screenshot from
    //    the Production Preview URL (see lib/projectPreview.js).
    // 3. Mandatory Details validation
    try {
      const details = typeof project.details === 'string' ? JSON.parse(project.details) : project.details;
      if (!Array.isArray(details) || details.length === 0) return false;

      // Verify that Git repository is defined and populated
      const hasGithub = details.some(d => 
        d.title && 
        d.title.toLowerCase().includes('github') && 
        d.desc && 
        d.desc.trim().startsWith('http')
      );

      // Verify that Live Preview/External Link is defined and populated
      const hasPreview = details.some(d => 
        d.title && 
        (d.title.toLowerCase().includes('preview') || d.title.toLowerCase().includes('link')) && 
        d.desc && 
        d.desc.trim().startsWith('http')
      );

      // Verify that Primary Language/Tech stack is declared
      const hasLanguage = details.some(d => 
        d.title && 
        (d.title.toLowerCase().includes('language') || d.title.toLowerCase().includes('code')) && 
        d.desc && 
        d.desc.trim() !== ''
      );

      if (!hasGithub || !hasPreview || !hasLanguage) {
        return false;
      }
    } catch (e) {
      return false; // Fail safe if JSON is unparseable
    }

    return true;
  });

  return NextResponse.json(verifiedProjects, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
    },
  });
}