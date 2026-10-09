/**
 * Admin auth & CSRF tests.
 *
 * Run:
 *   node --test harness/automation/api/admin-auth.test.mjs
 *
 * All tests expect 401/403 responses (no session / cross-origin).
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { baseUrl } from '../utilities/env.mjs';

const BASE = baseUrl();

const ADMIN_GETS = [
  '/api/admin/info',
  '/api/admin/projects',
  '/api/admin/skills',
  '/api/admin/hero-images',
  '/api/admin/settings',
  '/api/admin/social-links',
  '/api/admin/education',
  '/api/admin/experience',
  '/api/admin/api-logs',
  '/api/admin/csp-reports',
  '/api/admin/skill-categories',
  '/api/admin/resumes',
];

for (const p of ADMIN_GETS) {
  test(`GET ${p} without session returns 401 or 403`, async () => {
    const res = await fetch(BASE + p, { redirect: 'manual' });
    assert.ok(res.status === 401 || res.status === 403, `expected 401/403, got ${res.status}`);
  });
}

test('GET /admin without session redirects to /api/auth/login', async () => {
  const res = await fetch(BASE + '/admin', { redirect: 'manual' });
  assert.ok(res.status === 302 || res.status === 307 || res.status === 308, `expected redirect, got ${res.status}`);
  const loc = res.headers.get('location') || '';
  assert.ok(loc.includes('/api/auth/login'), `expected /api/auth/login, got "${loc}"`);
});

test('POST /api/auth/refresh without session returns 401', async () => {
  // Send a same-origin Origin header so the proxy CSRF check lets the
  // request through and the route itself answers 401 (no session).
  const res = await fetch(BASE + '/api/auth/refresh', {
    method: 'POST',
    headers: { origin: BASE },
  });
  assert.equal(res.status, 401, `expected 401, got ${res.status}`);
});

test('Cross-origin POST to /api/admin/skills returns 403 (CSRF)', async () => {
  const res = await fetch(BASE + '/api/admin/skills', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://evil.example',
    },
    body: JSON.stringify({ title: 'csrf-attempt' }),
  });
  // The proxy should reject before the route runs.
  assert.equal(res.status, 403, `expected 403, got ${res.status}`);
});

test('POST /api/auth/refresh without origin/referer returns 403 (CSRF)', async () => {
  // Send no Origin / Referer; Node fetch may not add them.
  const res = await fetch(BASE + '/api/auth/refresh', {
    method: 'POST',
    // No headers.
  });
  assert.ok(res.status === 401 || res.status === 403, `expected 401/403, got ${res.status}`);
});
