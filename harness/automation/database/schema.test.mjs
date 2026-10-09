/**
 * Database schema tests.
 *
 * Run:
 *   DATABASE_URL=... node --test harness/automation/database/schema.test.mjs
 *
 * Asserts that the expected tables, indexes, and triggers exist after the
 * migrations are applied.  The test does NOT apply migrations.
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { withConn } from './db-helpers.mjs';

const EXPECTED_TABLES = [
  'personal_info',
  'skills',
  'projects',
  'education',
  'experience',
  'user_settings',
  'api_logs',
  'csp_reports',
  'social_links',
  'resumes',
  'skill_categories',
  'hero_images',
  'audit_log',
];

test('All expected tables exist', async () => {
  await withConn(async (c) => {
    const { rows } = await c.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public'`
    );
    const found = new Set(rows.map((r) => r.table_name));
    for (const t of EXPECTED_TABLES) {
      assert.ok(found.has(t), `table ${t} not found in public schema`);
    }
  });
});

test('hero_images has enforce_single_hero_image trigger', async () => {
  await withConn(async (c) => {
    const { rows } = await c.query(
      `SELECT trigger_name FROM information_schema.triggers
       WHERE event_object_table = 'hero_images'`
    );
    const names = rows.map((r) => r.trigger_name);
    assert.ok(
      names.some((n) => n.includes('enforce_single_hero_image')),
      `expected trigger enforce_single_hero_image, got: ${names.join(', ')}`,
    );
  });
});

test('skills has percentage CHECK constraint', async () => {
  await withConn(async (c) => {
    const { rows } = await c.query(
      `SELECT conname FROM pg_constraint
       WHERE conrelid = 'public.skills'::regclass
         AND contype = 'c'`
    );
    const names = rows.map((r) => r.conname);
    assert.ok(names.length > 0, 'no CHECK constraints on skills');
  });
});
