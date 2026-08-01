import { cloudinary } from '@/lib/cloudinary';
import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

const NO_CACHE = { 'Cache-Control': 'no-store, private, must-revalidate' };
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_RESUME_TYPES = ['application/pdf'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: NO_CACHE });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  const isResume = formData.get('is_resume') === 'true';
  const resumeTitle = formData.get('title') || 'Resume';

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400, headers: NO_CACHE });
  }

  if (isResume) {
    // Resume upload to Supabase Storage
    if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF files allowed for resumes' },
        { status: 400, headers: NO_CACHE }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400, headers: NO_CACHE }
      );
    }

    try {
      const supabase = await createAdminClient();
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio-resumes')
        .upload(fileName, buffer, {
          contentType: 'application/pdf',
          upsert: false,
        });

      if (uploadError) {
        console.error('Supabase Storage upload error:', uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 500, headers: NO_CACHE });
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('portfolio-resumes')
        .getPublicUrl(uploadData.path);

      // Save to resumes table
      const { data: resumeData, error: dbError } = await supabase
        .from('resumes')
        .insert({
          title: resumeTitle,
          file_url: urlData.publicUrl,
          file_name: file.name,
          file_size: file.size,
          is_active: true, // Trigger will deactivate others
          is_favorite: false,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Resume DB insert error:', dbError);
        // Clean up uploaded file
        await supabase.storage.from('portfolio-resumes').remove([uploadData.path]);
        return NextResponse.json({ error: dbError.message }, { status: 500, headers: NO_CACHE });
      }

      return NextResponse.json({ 
        url: urlData.publicUrl, 
        resume: resumeData,
        message: 'Resume uploaded successfully' 
      }, { headers: NO_CACHE });

    } catch (error) {
      console.error('Resume upload error:', error);
      return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500, headers: NO_CACHE });
    }
  } else {
    // Image upload to Cloudinary (existing behavior)
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}` },
        { status: 400, headers: NO_CACHE }
      );
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400, headers: NO_CACHE }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'portfolio' },
        (error, result) => {
          if (error) {
            resolve(NextResponse.json({ error: error.message }, { status: 500, headers: NO_CACHE }));
          } else {
            resolve(NextResponse.json({ url: result.secure_url }, { headers: NO_CACHE }));
          }
        }
      ).end(buffer);
    });
  }
}