```text
Bug ID:        BUG-010
Title:         app/api/auth/validate imports getAccessToken from the wrong module
Severity:      S2 (major)
Priority:      P2
Feature:       FEAT-002 (admin-auth)
Environment:   any
Preconditions: none

Steps to Reproduce:
  1. Open app/api/auth/validate/route.js line 2:
       import { getSession, isTokenExpired, getAccessToken } from '@/lib/cookies';
  2. Open lib/cookies.js — it exports getSession, setSession, clearSession,
     isTokenExpired, getOAuthState, setOAuthState, clearOAuthState.
     getAccessToken is NOT among them; it is exported from lib/auth.js:58.

Expected:    The import resolves (or is removed — it is unused in the handler).
Actual:      The named import does not exist in the target module. Webpack only
             warns and serves the route (verified: GET /api/auth/validate → 200),
             but under strict ESM (Node ESM, some Turbopack/edge runtimes) this
             is a link-time error and the route fails to load.
Reproducible: YES (static; verified with scratch/check-imports.mjs)
Evidence:    scratch/check-imports.mjs output:
             "app/api/auth/validate/route.js: 'getAccessToken' is not exported by
              lib/cookies.js (import '@/lib/cookies')"

Root Cause:  Copy/paste from lib/auth.js usage; the binding is never used in
             the file, so nothing surfaced at runtime under webpack.
Fix:         Remove getAccessToken from the import (or import it from
             '@/lib/auth' if it is ever needed).
Regression Test: scratch/check-imports.mjs must report no problems for this file.
Status:      VERIFIED (fixed 2026-10-08)

Fix applied (2026-10-08): app/api/auth/validate/route.js no longer imports
             the non-existent getAccessToken from @/lib/cookies.
Verification: scratch/check-imports.mjs — 0 problems; probe assertion
             'GET /api/auth/validate (authed)' passes (60/60).
```
