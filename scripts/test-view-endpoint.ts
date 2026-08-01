import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

async function testView() {
  const { data: resume } = await supabase
    .from('resumes')
    .select('file_url')
    .eq('is_active', true)
    .single();

  if (!resume?.file_url) {
    console.log('No active resume');
    return;
  }

  const url = new URL(resume.file_url);
  const pathParts = url.pathname.split('/portfolio-resumes/');
  if (pathParts.length < 2) {
    console.log('Invalid URL format');
    return;
  }

  const filePath = pathParts[1];
  const { data, error } = await supabase.storage
    .from('portfolio-resumes')
    .createSignedUrl(filePath, 3600);

  console.log('Signed URL:', data?.signedUrl);
  console.log('Error:', error);

  if (data?.signedUrl) {
    const response = await fetch(data.signedUrl);
    console.log('Fetch status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
    console.log('Content-Length:', response.headers.get('content-length'));
  }
}

testView();