import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

async function servePdfFromSupabase(supabase, fileUrl) {
  // Extract file path from Supabase Storage URL
  // URL format: https://xxx.supabase.co/storage/v1/object/public/portfolio-resumes/filename.pdf
  const url = new URL(fileUrl);
  const pathParts = url.pathname.split('/portfolio-resumes/');
  if (pathParts.length < 2) return null;
  
  const filePath = pathParts[1];
  
  // Create signed URL (expires in 1 hour)
  const { data, error } = await supabase.storage
    .from('portfolio-resumes')
    .createSignedUrl(filePath, 3600);
  
  if (error || !data?.signedUrl) {
    console.error('Signed URL error:', error);
    return null;
  }
  
  // Fetch from signed URL
  const response = await fetch(data.signedUrl);
  if (!response.ok) return null;
  
  const pdfBlob = await response.blob();
  return pdfBlob;
}

async function servePdfFromLocal() {
  const filePath = path.join(process.cwd(), 'public', 'resume.pdf');
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

export async function GET() {
  try {
    const supabase = await createAdminClient();

    // Get active resume from DB
    const { data: resume } = await supabase
      .from('resumes')
      .select('file_url, file_name')
      .eq('is_active', true)
      .single();

    let pdfData = null;
    let fileName = 'Aman_Resume.pdf';

    // Try Supabase Storage first
    if (resume?.file_url) {
      pdfData = await servePdfFromSupabase(supabase, resume.file_url);
      fileName = resume.file_name || 'Aman_Resume.pdf';
    }

    // Fallback to local file
    if (!pdfData) {
      pdfData = await servePdfFromLocal();
    }

    if (!pdfData) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    // Convert blob to buffer if needed
    const pdfBuffer = pdfData instanceof Blob ? Buffer.from(await pdfData.arrayBuffer()) : pdfData;

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600',
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': "frame-ancestors 'self';",
      },
    });
  } catch (error) {
    console.error('Resume view error:', error);
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}