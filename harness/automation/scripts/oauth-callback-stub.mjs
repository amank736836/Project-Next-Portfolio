/**
 * OAuth callback stub.
 *
 * The real /api/auth/callback requires a valid Scalekit code.  This stub is for
 * documentation and integration tests:
 *
 *   1. Start the dev server (`npm run dev`).
 *   2. Run this script to simulate the callback URL with a clearly fake `code`.
 *   3. The server should render its error page (or 400-ish).
 *
 * This is NOT a substitute for a real Scalekit integration test.
 */

import { baseUrl } from '../utilities/env.mjs';

const BASE = baseUrl();
const url = `${BASE}/api/auth/callback?code=fake&state=fake`;

console.log(`[oauth-stub] GET ${url}`);
const res = await fetch(url, { redirect: 'manual' });
console.log(`[oauth-stub] status: ${res.status}`);
const ct = res.headers.get('content-type') || '';
if (ct.includes('text/html')) {
  const text = await res.text();
  console.log(`[oauth-stub] HTML response, first 200 chars:`);
  console.log(text.slice(0, 200));
} else {
  console.log(`[oauth-stub] content-type: ${ct}`);
  console.log(`[oauth-stub] body: ${(await res.text()).slice(0, 200)}`);
}

process.exit(res.status >= 200 && res.status < 500 ? 0 : 1);
