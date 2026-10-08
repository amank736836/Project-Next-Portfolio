```text
Bug ID:        BUG-002
Title:         Rate limiter is per-process; not horizontally scalable
Severity:      S3 (minor)
Priority:      P2
Feature:       FEAT-018 (rate limit)
Environment:   any

(moved from known-issues.md — this bug pre-dated the 2026-10-08 bug hunt)

Fix applied (2026-10-08): Resolved together with BUG-007 — proxy.js now uses
Upstash Redis (REST INCR/EXPIRE fixed window, shared across instances) whenever
UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN are set, with the in-memory
limiter as a fallback instead of a kill-switch.
Verification: code review + eslint; exercised via the harness suites (in-memory
fallback path, since the sandbox has no Upstash env).

Status:      VERIFIED (fixed 2026-10-08)
```
