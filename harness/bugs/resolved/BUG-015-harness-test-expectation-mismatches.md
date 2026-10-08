```text
Bug ID:        BUG-015
Title:         Harness test expectation mismatches (smoke content-type, refresh 401 vs 403)
Severity:      S4 (trivial)
Priority:      P3
Feature:       harness (automation)
Environment:   local-offline
Preconditions: Dev server running.

Steps to Reproduce:
  1. Run `node harness/automation/scripts/smoke-public.mjs`.
     → "FAIL api POST /api/csp-report {status:400}".
     The script sends the POST without a Content-Type header (fetch defaults
     to text/plain); the route correctly requires application/csp-report,
     application/reports+json or application/json and returns 400.
  2. Run `node --test harness/automation/api/admin-auth.test.mjs`.
     → "POST /api/auth/refresh without session returns 401" fails:
     expected 401, got 403. The proxy's same-origin (CSRF) check runs before
     the route's auth check, so a session-less cross-origin POST is rejected
     with 403 "CSRF validation failed".

Expected:    Smoke script sets a valid Content-Type and passes; the auth test
             asserts 403 (CSRF) or sends a same-origin request to reach the
             route's 401.
Actual:      Both tests fail for harness-side reasons, not app bugs.
Reproducible: YES
Evidence:    Test runs on 2026-10-08 (see harness/test-results/latest/).

Root Cause:  Test scripts not updated for the route's content-type requirement
             and the proxy's CSRF-first ordering.
Fix:         Set 'content-type': 'application/json' in the smoke script's
             csp-report request; update admin-auth.test.mjs to expect 403 for a
             cross-origin POST (or send Origin matching the host to assert 401).
Regression Test: both suites green.
Status:      VERIFIED (fixed 2026-10-08)

Fix applied (2026-10-08): harness/automation/scripts/smoke-public.mjs runApis()
             now sends content-type: application/json when a body is present (POST
             /api/csp-report returns 204 instead of 400); harness/automation/api/
             admin-auth.test.mjs refresh test now sends a same-origin Origin header
             so it reaches the route and asserts the real 401 (the no-origin CSRF
             test is kept).
Verification: smoke 25/25 (was 24/25); admin-auth suite passes except the two
             Scalekit-env-dependent login tests (environmental).
```
