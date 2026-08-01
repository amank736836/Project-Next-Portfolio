import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

async function servePdfFromSupabase(supabase, fileUrl) {
  const url = new URL(fileUrl);
  const pathParts = url.pathname.split('/portfolio-resumes/');
  if (pathParts.length < 2) return null;
  
  const filePath = pathParts[1];
  
  const { data, error } = await supabase.storage
    .from('portfolio-resumes')
    .createSignedUrl(filePath, 3600);
  
  if (error || !data?.signedUrl) return null;
  
  const response = await fetch(data.signedUrl);
  if (!response.ok) return null;
  
  return response.blob();
}

async function servePdfFromLocal() {
  const filePath = path.join(process.cwd(), 'public', 'resume.pdf');
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

export async function GET() {
  try {
    const supabase = await createAdminClient();

    const { data: resume } = await supabase
      .from('resumes')
      .select('file_url, file_name')
      .eq('is_active', true)
      .single();

    let pdfData = null;
    let fileName = 'Aman_Resume.pdf';

    if (resume?.file_url) {
      pdfData = await servePdfFromSupabase(supabase, resume.file_url);
      fileName = resume.file_name || 'Aman_Resume.pdf';
    }

    if (!pdfData) {
      pdfData = await servePdfFromLocal();
    }

    if (!pdfData) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const pdfBuffer = pdfData instanceof Blob ? Buffer.from(await pdfData.arrayBuffer()) : pdfData;

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    });
  } catch (error) {
    console.error('Resume download error:', error);
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}