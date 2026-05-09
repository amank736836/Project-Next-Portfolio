import { cloudinary } from '@/lib/cloudinary';
import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request) {
  // Check authentication
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'portfolio' },
      (error, result) => {
        if (error) {
          resolve(NextResponse.json({ error: error.message }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ url: result.secure_url }));
        }
      }
    ).end(buffer);
  });
}
