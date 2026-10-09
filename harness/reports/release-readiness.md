# Release readiness

> Last updated: 2026-10-07.  Recommendation: **READY WITH RISKS**.

## Critical features

All FEAT-001..FEAT-027 are documented.  Public surface (FEAT-001..FEAT-011) has
HTTP-level smoke coverage.

## Critical bugs

| ID      | Title                                          | Severity | Action    |
|---------|------------------------------------------------|----------|-----------|
| BUG-001 | audit_log table is not written to              | S2       | Document  |
| BUG-004 | No automated RLS coverage                      | S1       | Track     |

## Open high severity bugs

1. **BUG-004** — RLS coverage is unverified.  All RLS policies depend on this
   being correct.  Recommend adding `automation/database/rls.test.mjs` before the
   next release.

## Regression status

Not yet run (no dev server in sandbox).  See `reports/regression-report.md`.

## Smoke test status

Harness scripts are ready; not yet executed.  See `test-results/latest/RUN-2026-01.md`.

## Performance status

No measurements taken.  Budgets are **proposed** in `requirements/non-functional-requirements.md`
(REQ-109).

## Security status

Header checks are automated.  Manual review checklist in
`test-tools/security/README.md`.  No third-party SAST/DAST is run.

## Known limitations

- No browser tests (no Playwright).
- No RLS tests.
- No audit-log writer in the application.
- Rate limiter is in-memory only.
- `api-logger` swallows a missing `next-auth` import.

## Deployment risks

- Without `UPSTASH_REDIS_REST_URL` set, the rate limiter is per-process and can
  be exceeded on multi-instance deployments. (BUG-002.)
- The proxy does not refresh tokens; only the Node handlers do.  A request arriving
  with an expired token is allowed by the proxy and refreshed by the handler.
  This is intentional but documented.
- The `audit_log` table will be empty in production until a writer is added.

## Release recommendation

`READY WITH RISKS`

> Conditions to upgrade to `READY`:
> 1. `npm install` and a successful `npm run dev` on a clean checkout.
> 2. `node harness/automation/scripts/smoke-public.mjs` → exit 0.
> 3. `node harness/automation/scripts/headers-check.mjs` → exit 0.
> 4. `node --test harness/automation/api/` → all pass.
> 5. `node --test harness/automation/ui/` → all pass.
> 6. Optional: provision a test DB and run `DATABASE_URL=... node --test harness/automation/database/`.
> 7. Either ship BUG-001 fix or remove the `audit_log` table.
> 8. Either ship BUG-004 fix (RLS tests) or document the explicit decision.
