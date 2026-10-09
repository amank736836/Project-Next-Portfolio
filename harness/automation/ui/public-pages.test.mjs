/**
 * UI tests at the HTTP level.
 *
 * Run:
 *   node --test harness/automation/ui/public-pages.test.mjs
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import { baseUrl } from '../utilities/env.mjs';

const BASE = baseUrl();

const PAGES = [
  ['/', /hero|home|aman/i],
  ['/about', /about/i],
  ['/skills', /skills/i],
  ['/education', /education/i],
  ['/experience', /experience/i],
  ['/projects', /projects?/i],
  ['/contact', /contact/i],
  ['/resume', /resume/i],
  ['/test-ui', /test-ui|playground/i],
  ['/robots.txt', /User-agent/i],
  ['/sitemap.xml', /<urlset/i],
];

for (const [path, pattern] of PAGES) {
  test(`GET ${path} returns 200 and contains ${pattern}`, async () => {
    const res = await fetch(BASE + path, { redirect: 'manual' });
    assert.equal(res.status, 200, `expected 200, got ${res.status}`);
    const body = await res.text();
    assert.match(body, pattern, `body of ${path} should match ${pattern}`);
  });
}

test('GET /login returns 200 (or 3xx redirect)', async () => {
  const res = await fetch(BASE + '/login', { redirect: 'manual' });
  assert.ok(res.status === 200 || (res.status >= 300 && res.status < 400));
});

test('GET /api/auth/login redirects to a non-local URL', async () => {
  const res = await fetch(BASE + '/api/auth/login', { redirect: 'manual' });
  const loc = res.headers.get('location') || '';
  assert.ok(loc.length > 0, 'Location must be set');
  assert.ok(!loc.startsWith('/'), `should redirect externally, got "${loc}"`);
});
