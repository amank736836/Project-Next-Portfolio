import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

const unauthorized = () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

export async function GET() {
  if (!await isAuthenticated()) return unauthorized();

  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/admin/hero-images error:', error);
    return NextResponse.json({ error: 'Failed to fetch hero images' }, { status: 500 });
  }
}

export async function POST(request) {
  if (!await isAuthenticated()) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const altText = formData.get('altText') || 'Hero background';
    const isHero = formData.get('isHero') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/webp') {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, WebP allowed' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max 5MB' }, { status: 400 });
    }

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', 'portfolio_uploads'); // Make sure this preset exists

    const uploadRes = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: uploadFormData,
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(uploadData.error?.message || 'Cloudinary upload failed');

    const imageUrl = uploadData.secure_url;

    const supabase = await createAdminClient();

    // If this is set as hero, unset others
    if (isHero) {
      await supabase.from('hero_images').update({ is_hero: false }).eq('is_hero', true);
    }

    // Get max display_order
    const { data: maxOrder } = await supabase
      .from('hero_images')
      .select('display_order')
      .order('display_order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (maxOrder?.display_order || 0) + 1;

    // Insert new image
    const { data, error } = await supabase
      .from('hero_images')
      .insert({
        url: imageUrl,
        alt_text: altText,
        is_hero: isHero,
        display_order: nextOrder,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('POST /api/admin/hero-images error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload hero image' }, { status: 500 });
  }
}
