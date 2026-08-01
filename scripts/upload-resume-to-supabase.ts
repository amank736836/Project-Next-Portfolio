import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

async function uploadResume() {
  const filePath = path.join(process.cwd(), 'public', 'resume.pdf');
  const fileBuffer = fs.readFileSync(filePath);
  const fileName = `resume_${Date.now()}.pdf`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('portfolio-resumes')
    .upload(fileName, fileBuffer, {
      contentType: 'application/pdf',
      upsert: false,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('portfolio-resumes')
    .getPublicUrl(uploadData.path);

  console.log('Uploaded to:', urlData.publicUrl);

  // Update resumes table - set as active
  const { data: resumeData, error: dbError } = await supabase
    .from('resumes')
    .insert({
      title: 'Full Stack Developer Resume',
      file_url: urlData.publicUrl,
      file_name: 'Aman_Resume.pdf',
      file_size: fileBuffer.length,
      is_active: true,
      is_favorite: true,
    })
    .select()
    .single();

  if (dbError) {
    console.error('DB error:', dbError);
  } else {
    console.log('Resume record created:', resumeData);
  }
}

uploadResume();