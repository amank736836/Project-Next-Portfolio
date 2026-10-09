```text
Bug ID:        BUG-007
Title:         Rate limiter is silently DISABLED when Upstash env vars are set
Severity:      S2 (major)
Priority:      P2
Feature:       FEAT-018 (rate limit)
Environment:   production (any env where UPSTASH_REDIS_REST_URL/TOKEN are set)
Preconditions: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.

Steps to Reproduce:
  1. Read proxy.js → enforceRateLimit().
  2. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in the environment.
  3. Send >60 mutating requests to /api/admin/* or /api/auth/logout within 60s.

Expected:    Requests are rate limited via Upstash Redis (shared across instances).
Actual:      enforceRateLimit() returns null immediately when the Upstash env
             vars exist — no rate limiting happens at all. There is no Upstash
             client code anywhere in the repository (no dependency, no fetch to
             the REST URL), so the env vars act as a kill switch, not a
             delegation. Note: harness/bugs/known-issues.md BUG-002 claims the
             Upstash path "is already wired" — it is not.
Reproducible: YES (code review; the early-return branch is unconditional)
Evidence:    proxy.js lines ~60-62:
               if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
                 return null;
               }
             `grep -ri upstash` across app/, lib/, components/, hooks/, scripts/,
             proxy.js, package.json → only this one occurrence.

Root Cause:  The function treats "Upstash configured" as "skip in-memory
             limiter" but never implements the Upstash limiter.
Fix:         Either implement the Upstash fixed-window limiter behind those env
             vars, or remove the early-return so the in-memory limiter always
             applies as a fallback. Do not leave a config that disables the
             only rate limiter that exists.
Regression Test: TC-SEC-031 (harness) — with Upstash env vars set, the 61st
             mutating request within 60s must still receive 429.
Status:      VERIFIED (fixed 2026-10-08)

Fix applied (2026-10-08): proxy.js now implements a real Upstash
             fixed-window limiter (REST INCR + EXPIRE, 429 with Retry-After when
             over the limit) whenever UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN
             are set — the silent kill-switch is removed. If Upstash is
             unreachable the limiter falls back to the in-memory store instead of
             disabling protection. enforceRateLimit is now async and awaited at
             the call site. Also resolves BUG-002 (per-process limitation).
Verification: code review + eslint; rate-limit path exercised by the harness
             suites (no Upstash env in the sandbox, so the in-memory fallback
             is what runs here).
```
