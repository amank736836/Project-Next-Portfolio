/**
 * Row Level Security (RLS) tests.
 *
 * Run:
 *   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
 *     node --test harness/automation/database/rls.test.mjs
 *
 * These tests go through PostgREST with the PUBLIC ANON KEY — the same key
 * that ships in the browser bundle — so they exercise the real RLS policies.
 * (Connecting with `pg` as the database owner would bypass RLS entirely.)
 *
 * The tests SKIP gracefully when the Supabase env vars are not set, so the
 * suite can run in offline/CI environments without a database.
 */

import test from 'node:test';
import assert from 'node:assert/strict';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const configured = Boolean(SUPABASE_URL && ANON_KEY);
const skipOpts = { skip: !configured && 'Supabase env vars not set (offline mode) — skipping RLS tests' };

function restHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
}

async function anonSelect(table, query = 'select=*') {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    headers: restHeaders(ANON_KEY),
  });
  let body = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  return { res, body };
}

test('RLS: anon key cannot read api_logs', skipOpts, async () => {
  // Migration 027 removed the "Public read access" policy; api_logs contains
  // IPs, user agents, error stacks and request/response bodies.
  const { res, body } = await anonSelect('api_logs');
  if (res.ok) {
    // PostgREST returns 200 + [] when RLS filters every row out.
    assert.ok(Array.isArray(body), 'expected an array response');
    assert.equal(body.length, 0, 'anon key must not see any api_logs rows');
  } else {
    assert.ok(
      res.status === 401 || res.status === 403,
      `expected 401/403 or empty result, got ${res.status}`
    );
  }
});

test('RLS: anon key can read visible projects only', skipOpts, async () => {
  // Migration 028 added "Public can view visible projects" (is_hidden = FALSE).
  const { res, body } = await anonSelect('projects');
  assert.equal(res.status, 200, `expected 200, got ${res.status}`);
  assert.ok(Array.isArray(body), 'expected an array response');
  for (const row of body) {
    assert.equal(row.is_hidden, false, `hidden project leaked to anon key: ${JSON.stringify(row)}`);
  }
});

test('RLS: anon key cannot see hidden project rows', skipOpts, async () => {
  // If the DB has hidden projects, none of them may appear in the anon read.
  const { res, body } = await anonSelect('projects', 'select=id,is_hidden');
  assert.equal(res.status, 200, `expected 200, got ${res.status}`);
  const hidden = (body || []).filter((row) => row.is_hidden === true);
  assert.equal(hidden.length, 0, `anon key saw ${hidden.length} hidden project rows`);
});

test('RLS: anon key cannot read personal_info directly', skipOpts, async () => {
  // Migration 028 deliberately adds NO public read policy for personal_info;
  // it is served through the service-role /api/info route (which filters
  // is_hidden). Anon reads must return nothing.
  const { res, body } = await anonSelect('personal_info');
  if (res.ok) {
    assert.ok(Array.isArray(body), 'expected an array response');
    assert.equal(body.length, 0, 'anon key must not see any personal_info rows');
  } else {
    assert.ok(
      res.status === 401 || res.status === 403,
      `expected 401/403 or empty result, got ${res.status}`
    );
  }
});

test('RLS: anon key cannot write to projects', skipOpts, async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
    method: 'POST',
    headers: {
      ...restHeaders(ANON_KEY),
      'content-type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ title: 'rls-anon-write-attempt' }),
  });
  assert.ok(
    res.status === 401 || res.status === 403,
    `expected 401/403 for anon insert, got ${res.status}`
  );
});

test('RLS: service role can read api_logs (sanity check)', { skip: !SERVICE_KEY && 'SUPABASE_SERVICE_ROLE_KEY not set — skipping' }, async () => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/api_logs?select=id&limit=1`, {
    headers: restHeaders(SERVICE_KEY),
  });
  assert.equal(res.status, 200, `expected 200, got ${res.status}`);
});
