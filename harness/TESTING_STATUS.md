# Testing Status — Portfolio Next

> Updated: 2026-10-07. This file is the **single page** to check the current state of testing.

## Summary

| Indicator                  | Value                                                                                       |
|----------------------------|---------------------------------------------------------------------------------------------|
| Features documented        | 21 (see `features/README.md`)                                                                |
| Requirements documented    | 28 (see `requirements/functional-requirements.md`)                                          |
| Test scenarios catalogued  | 11 categories (see `test-scenarios/`)                                                       |
| Test cases drafted         | Initial draft — one positive + one negative per critical surface (see `test-cases/`)        |
| Automated tests shipped    | 1 (offline smoke) — `automation/scripts/smoke-public.mjs`                                    |
| Test runs completed        | 1 dry-run; see `test-results/latest/RUN-2026-01.md`                                          |
| Bugs opened                | 0 (no bugs discovered by the harness yet)                                                    |
| Open critical bugs         | 0                                                                                            |
| Release recommendation    | `READY WITH RISKS` (no E2E suite, no DB test in CI)                                          |

> Numbers above are **derived from this harness only** — they are not from a production CI.

## What has been executed

| Run ID          | Date         | Suite                       | Result            | Notes                                              |
|-----------------|--------------|-----------------------------|-------------------|----------------------------------------------------|
| `RUN-2026-01`   | 2026-10-07   | `automation/scripts/smoke-public.mjs` | See run file | Offline mode, no external dependencies. |

## What has *not* been executed (intentionally)

- **End-to-end browser tests** — no Playwright installed.
- **Live OAuth flow** — requires real Scalekit credentials; not provided in the sandbox.
- **Database tests** — no test database URL was configured; the migration runner
  requires a live `pg` connection.
- **Performance / load tests** — no tooling.
- **Security scans** — manual review only; see `test-tools/security/README.md`.

## Critical gaps

1. **No automated coverage of the OAuth callback** — the most security-critical code path.
2. **No RLS policy tests** — RLS is the last line of defence; we should be able to assert
   that a public client cannot insert into admin-only tables.
3. **No CSP report verification** — browser reports are accepted but no test asserts the
   filter logic in `app/api/csp-report/route.js`.
4. **No audit-log test** — the `audit_log` table is created but no test asserts that admin
   writes trigger an audit row.
5. **No regression test for the public project filter** — the most subtle business rule.
6. **No CSRF test for admin writes** — the proxy enforces same-origin, but no test
   confirms a cross-origin POST is rejected.
7. **No performance budget test** — `api_logs.duration_ms` is captured but never asserted.

## Open bugs

None yet. See `bugs/open/` — this directory is intentionally empty but exists for
discoveries.

## How to refresh this file

After any test run:

1. Create `test-results/latest/RUN-yyyy-nn.md` (or move the previous one to `historical/`).
2. Update the **Summary** table at the top.
3. Add a row to **What has been executed**.
4. Update `reports/coverage.md` and `reports/release-readiness.md`.

## Out of scope for the harness

- Live Cloudinary uploads
- Real Scalekit login (a stub is provided in `automation/scripts/oauth-callback-stub.mjs`)
- Visual / motion regression testing
