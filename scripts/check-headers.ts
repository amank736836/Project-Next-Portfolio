import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SERVICE_ROLE_KEY!
);

const { data, error } = await supabase
  .from('resumes')
  .select('file_url')
  .eq('is_active', true)
  .single();

if (error) {
  console.error('Error:', error);
  process.exit(1);
}

console.log('Resume URL:', data?.file_url);

// Check Cloudinary headers
const response = await fetch(data.file_url, { method: 'HEAD' });
console.log('\nCloudinary Response Headers:');
for (const [key, value] of response.headers.entries()) {
  console.log(`  ${key}: ${value}`);
}

// Check our proxy endpoint
const proxyResponse = await fetch('http://localhost:3000/api/resume/view', { method: 'GET' });
console.log('\nProxy Response Headers:');
for (const [key, value] of proxyResponse.headers.entries()) {
  console.log(`  ${key}: ${value}`);
}