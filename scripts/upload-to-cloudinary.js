const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const assetsDir = './public/assets';
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
  const publicId = `portfolio/${path.parse(filename).name}`;
  
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
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