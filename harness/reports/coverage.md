# Test coverage

> Last updated: 2026-10-07. Numbers are derived from file counts and the
> `reports/traceability.md` matrix. They are **not** invented.

## Feature coverage

| Metric                | Value | Source                                    |
|-----------------------|-------|-------------------------------------------|
| Features identified   | 27    | `features/README.md`                      |
| Documented            | 27    | Each has a `README.md` in `features/<name>/` |
| With test scenarios   | 27    | Each is referenced from `test-scenarios/*.md` |
| With test cases       | 27    | Each has at least one `test-cases/<name>/<type>.md` file |
| Automated tests       | 6     | `automation/api/`, `automation/ui/`, `automation/scripts/smoke-public.mjs`, `headers-check.mjs` |

## Requirement coverage

| Metric                | Value | Source                                    |
|-----------------------|-------|-------------------------------------------|
| Requirements          | 28    | `requirements/functional-requirements.md` + non-functional |
| Covered (≥ 1 TC)      | 28    | `reports/traceability.md`                  |
| Automated             | ~12   | Tests using `automation/api/` or `automation/scripts/` |
| Manual                | ~16   | All others                                |

## Scenario coverage

| Category     | Scenarios | Automated | Manual | Drafted |
|--------------|-----------|-----------|--------|---------|
| Smoke        | 16        | 16        | 0      | 16      |
| Functional   | 25        | 0         | 25     | 25      |
| Regression   | 18        | 0         | 18     | 18      |
| Negative     | 18        | 3         | 15     | 18      |
| Edge         | 18        | 0         | 18     | 18      |
| Integration  | 12        | 0         | 12     | 12      |
| API          | 27        | 8         | 19     | 27      |
| Database     | 18        | 0         | 18     | 18      |
| UI           | 18        | 11        | 7      | 18      |
| Performance  | 10        | 0         | 10     | 10      |
| Security     | 24        | 7         | 17     | 24      |

## Test case coverage

| Class            | Drafted | Executed | Passed | Failed | Blocked |
|------------------|---------|----------|--------|--------|---------|
| TC-PUB-*         | 18      | 0        | 0      | 0      | 0       |
| TC-AUTH-*        | 11      | 0        | 0      | 0      | 0       |
| TC-API-*         | 14      | 0        | 0      | 0      | 0       |
| TC-ADM-SK-*      | 10      | 0        | 0      | 0      | 0       |
| TC-ADM-PR-*      | 8       | 0        | 0      | 0      | 0       |
| TC-ADM-HI-*      | 9       | 0        | 0      | 0      | 0       |
| TC-ADM-RS-*      | 8       | 0        | 0      | 0      | 0       |
| TC-ADM-ST-*      | 8       | 0        | 0      | 0      | 0       |
| TC-ADM-SL-*      | 5       | 0        | 0      | 0      | 0       |
| TC-ADM-ED-*      | 7       | 0        | 0      | 0      | 0       |
| TC-ADM-EX-*      | 6       | 0        | 0      | 0      | 0       |
| TC-ADM-PI-*      | 7       | 0        | 0      | 0      | 0       |
| TC-SEC-*         | 22      | 0        | 0      | 0      | 0       |
| **Total**        | **133** | **0**    | **0**  | **0**  | **0**   |

> 0 executed is intentional: this harness was created in a sandbox where the
> dev server is not running.  See `test-results/latest/RUN-2026-01.md`.

## Automation coverage

| Layer          | Tests     | Files                                  |
|----------------|-----------|----------------------------------------|
| Unit           | 0         | (project has no unit tests)            |
| API (HTTP)     | 22        | `automation/api/*.test.mjs`            |
| UI (HTTP)      | 11        | `automation/ui/*.test.mjs`             |
| Database       | 3         | `automation/database/*.test.mjs`        |
| Smoke (script) | 2         | `automation/scripts/smoke-public.mjs`, `headers-check.mjs` |
| OAuth stub     | 1         | `automation/scripts/oauth-callback-stub.mjs` |
| **Total**      | **39**    |                                        |

## API coverage

| Endpoint                              | Tested in                                      |
|---------------------------------------|------------------------------------------------|
| /api/projects                         | automation/api/public-apis.test.mjs            |
| /api/info                             | automation/api/public-apis.test.mjs            |
| /api/resume                           | automation/api/public-apis.test.mjs            |
| /api/resume/view                      | automation/api/public-apis.test.mjs            |
| /api/auth/login                       | automation/api/public-apis.test.mjs            |
| /api/auth/validate                    | automation/api/public-apis.test.mjs            |
| /api/auth/refresh                     | automation/api/admin-auth.test.mjs             |
| /api/csp-report                       | automation/api/public-apis.test.mjs            |
| /api/admin/info                       | automation/api/admin-auth.test.mjs             |
| /api/admin/skills                     | automation/api/admin-auth.test.mjs             |
| /api/admin/projects                   | automation/api/admin-auth.test.mjs             |
| /api/admin/hero-images                | automation/api/admin-auth.test.mjs             |
| /api/admin/settings                   | automation/api/admin-auth.test.mjs             |
| /api/admin/social-links               | automation/api/admin-auth.test.mjs             |
| /api/admin/education                  | automation/api/admin-auth.test.mjs             |
| /api/admin/experience                 | automation/api/admin-auth.test.mjs             |
| /api/admin/api-logs                   | automation/api/admin-auth.test.mjs             |
| /api/admin/csp-reports                | automation/api/admin-auth.test.mjs             |
| /api/admin/skill-categories           | automation/api/admin-auth.test.mjs             |
| /api/admin/resumes                    | automation/api/admin-auth.test.mjs             |
| /api/admin/upload                     | (manual — needs multipart)                     |
| /api/admin/social-links/[id]          | (manual)                                       |
| /api/admin/hero-images/[id]           | (manual)                                       |
| /api/auth/callback                    | automation/scripts/oauth-callback-stub.mjs (returns error page) |
| /api/auth/logout                      | (manual)                                       |
| /api/auth/retry                       | (manual)                                       |
| /api/resume/download                  | (manual)                                       |

## UI coverage

| Path                  | HTTP-level test                          |
|-----------------------|------------------------------------------|
| /                     | automation/ui/public-pages.test.mjs      |
| /about                | automation/ui/public-pages.test.mjs      |
| /skills               | automation/ui/public-pages.test.mjs      |
| /education            | automation/ui/public-pages.test.mjs      |
| /experience           | automation/ui/public-pages.test.mjs      |
| /projects             | automation/ui/public-pages.test.mjs      |
| /contact              | automation/ui/public-pages.test.mjs      |
| /resume               | automation/ui/public-pages.test.mjs      |
| /test-ui              | automation/ui/public-pages.test.mjs      |
| /robots.txt           | automation/ui/public-pages.test.mjs      |
| /sitemap.xml          | automation/ui/public-pages.test.mjs      |
| /login                | automation/ui/public-pages.test.mjs      |
| /admin                | automation/api/admin-auth.test.mjs (redirect) |
| /error, /permission-denied | (manual)                              |

## Database coverage

| Concern                | Tested?                                 |
|------------------------|------------------------------------------|
| Tables exist           | automation/database/schema.test.mjs      |
| Triggers               | automation/database/schema.test.mjs      |
| CHECK constraints      | automation/database/schema.test.mjs      |
| Migrations applied     | (manual — run `npm run db:status`)       |
| RLS policies           | NOT TESTED — see BUG-004                 |
| Performance / indexes  | NOT TESTED — manual `EXPLAIN`             |
| Seed data              | (manual — `npm run db:seed`)             |

## Critical gaps

1. **RLS tests** — no automated coverage. BUG-004.
2. **Audit log writer** — schema exists, no application code writes to it. BUG-001.
3. **CSRF cross-origin test** — automated, but only for `/api/admin/skills` and
   `/api/auth/refresh`.
4. **Performance budgets** — not enforced.
5. **OAuth E2E** — requires Scalekit creds.
6. **Browser/visual tests** — none.
