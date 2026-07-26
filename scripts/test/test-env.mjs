import dotenv from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');  // This should be portfolio-next

console.log('__dirname:', __dirname);
console.log('PROJECT_ROOT:', PROJECT_ROOT);
console.log('.env path:', join(PROJECT_ROOT, '.env'));

dotenv.config({ path: join(PROJECT_ROOT, '.env'), override: true });

console.log('All env:', Object.keys(process.env).filter(k => k.startsWith('NEXT') || k.startsWith('SERVICE') || k.startsWith('DATABASE')));

console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SERVICE_ROLE_KEY:', process.env.SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
console.log('DATABASE_URL:', process.env.DATABASE_URL);