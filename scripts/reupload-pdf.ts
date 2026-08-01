import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

cloudinary.v2.config({
  cloud_name: 'amank736836',
  api_key: '794554976842551',
  api_secret: '8uZMAjDr03O134np1Gc5goQyDIs'
});

async function reuploadPdf() {
  const filePath = path.join('./public/assets', 'Aman_Resume.pdf');
  
  try {
    // Upload with proper settings for iframe embedding
    const result = await cloudinary.v2.uploader.upload(filePath, {
      public_id: 'portfolio/Aman_Resume_v2',
      resource_type: 'auto',
      folder: 'portfolio',
      overwrite: true,
      invalidate: true,
      access_mode: 'public',
      delivery_type: 'upload'
    });
    console.log('✅ Reuploaded:', result.secure_url);
    console.log('Resource type:', result.resource_type);
    console.log('Type:', result.type);
    return result.secure_url;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

reuploadPdf();