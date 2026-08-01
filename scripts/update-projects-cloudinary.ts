import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { testConnection, executeSql } from './src/lib/supabase.js';
import { logger } from './src/lib/logger.js';
import dotenv from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

dotenv.config({ path: join(PROJECT_ROOT, '.env.local') });
dotenv.config({ path: join(PROJECT_ROOT, '.env') });

async function updateProjects(): Promise<void> {
  logger.step('Updating projects with Cloudinary URLs');
  
  try {
    const connected = await testConnection();
    if (!connected) {
      logger.error('Cannot connect to database');
      process.exit(1);
    }

    const updates = [
      { id: 1, img: 'https://res.cloudinary.com/amank736836/image/upload/v1785565563/portfolio/portfolio/frameandphrase.png' },
      { id: 2, img: 'https://res.cloudinary.com/amank736836/image/upload/v1785565556/portfolio/portfolio/ciphergen.png' },
      { id: 3, img: 'https://res.cloudinary.com/amank736836/image/upload/v1785565552/portfolio/portfolio/cashcode.png' },
      { id: 4, img: 'https://res.cloudinary.com/amank736836/image/upload/v1785565564/portfolio/portfolio/organizeit.png' },
      { id: 5, img: 'https://res.cloudinary.com/amank736836/image/upload/v1785565569/portfolio/portfolio/selfdevelopmentgoals.png' },
      { id: 6, img: 'https://res.cloudinary.com/amank736836/image/upload/v1785565561/portfolio/portfolio/ecommerce.png' },
    ];

    for (const p of updates) {
      const sql = `UPDATE projects SET img = '${p.img}', image = '${p.img}' WHERE id = ${p.id};`;
      await executeSql(sql);
      logger.success(`Updated project ${p.id}`);
    }

    logger.success('All projects updated with Cloudinary URLs');

  } catch (error) {
    logger.error(`Update failed: ${error}`);
    process.exit(1);
  }
}

updateProjects().catch(err => {
  logger.error(`Fatal error: ${err}`);
  process.exit(1);
});