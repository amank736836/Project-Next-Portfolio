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

const files = [
  'cashcode.png',
  'ciphergen.png',
  'codolio.svg',
  'ecommerce.png',
  'frameandphrase.png',
  'organizeit.png',
  'profile_v4.png',
  'selfdevelopmentgoals.png',
  'Aman_Resume.pdf'
];

async function uploadFile(filename) {
  const filePath = path.join('./public/assets', filename);
  
  try {
    const result = await cloudinary.v2.uploader.upload(filePath, {
      public_id: `portfolio/${path.parse(filename).name}`,
      resource_type: 'auto',
      folder: 'portfolio',
      overwrite: true,
      invalidate: true
    });
    console.log(`✅ ${filename} -> ${result.secure_url}`);
    return { filename, url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error(`❌ ${filename}:`, error.message);
    return null;
  }
}

async function main() {
  console.log('Uploading portfolio images to Cloudinary...');
  const results = [];
  
  for (const filename of files) {
    const result = await uploadFile(filename);
    if (result) results.push(result);
  }
  
  console.log('\n--- Upload Summary ---');
  results.forEach(r => console.log(`${r.filename}: ${r.url}`));
  
  // Save mapping for reference
  fs.writeFileSync('cloudinary-mapping.json', JSON.stringify(results, null, 2));
  console.log('\nMapping saved to cloudinary-mapping.json');
}

main().catch(console.error);