```text
Bug ID:        BUG-003
Title:         lib/api-logger.js imports a non-existent NextAuth module
Severity:      S3 (minor)
Priority:      P3
Feature:       FEAT-024
Environment:   any

(moved from known-issues.md — this bug pre-dated the 2026-10-08 bug hunt)

Fix applied (2026-10-08): lib/api-logger.js now resolves the current user via
getCurrentUser() from @/lib/auth (Scalekit session) instead of the non-existent
next-auth getServerSession import, so userId is populated in api_logs.
Verification: scratch/check-imports.mjs — 0 problems; eslint clean.

Status:      VERIFIED (fixed 2026-10-08)
```
