# Testing Strategy — Portfolio Next

> Source of truth: this harness + the actual project. Last updated: 2026-10-07.

## 1. Guiding principles

1. **Reuse what the project already has.** No new test framework, no new ORM. Lean on
   Next.js's built-in route handler invocation, the existing `scripts/` migration CLI, ESLint,
   and `node --test` (Node 22 native) for harness scripts.
2. **Tests must run without secrets leaking.** All credentials come from environment
   variables. The harness never hardcodes tokens.
3. **Three execution modes** (see `test-tools/README.md`):
   - **Offline mode** — `NEXT_PUBLIC_SUPABASE_URL` unset. Public pages render seed data.
     Best for UI smoke, regression, and motion.
   - **Real Supabase (test schema)** — used for database / API / integration tests.
   - **Real Supabase (production-like)** — only used for release readiness smoke.
4. **No fake PASS.** If a test was not executed, the result is `NOT_EXECUTED`.
5. **Traceability is mandatory.** Every test case is linked back to a requirement (`REQ-xxx`)
   and a feature (`FEAT-xxx`).

## 2. Test levels

| Level               | Tool / approach                              | Where it lives                  |
|---------------------|----------------------------------------------|---------------------------------|
| Unit                | `node --test` + plain functions              | `automation/scripts/`           |
| Integration (HTTP)  | `node --test` + `fetch`                      | `automation/api/`               |
| Database            | `node --test` + `pg` + migration runner      | `automation/database/`          |
| UI                  | `node --test` + HTTP probes (no browser)     | `automation/ui/`                |
| End-to-end          | **Not configured.** Future: Playwright.      | `automation/ui/e2e/` (planned)  |
| Security / VAPT     | Manual + `node --test` (header inspection)   | `test-tools/security/`          |
| Performance         | Manual + `node --test` (timing fixtures)     | `test-tools/performance/`       |

The project does **not** ship Jest, Playwright, or any other test framework. The harness
therefore **does not** install one. It uses Node's built-in test runner.

## 3. Test categories

| Category            | Definition                                                                          |
|---------------------|-------------------------------------------------------------------------------------|
| **Smoke**           | Critical public routes return 200 in offline mode                                   |
| **Functional**      | Each documented feature behaves per its acceptance criteria                          |
| **Negative**        | Inputs / states that should be rejected                                             |
| **Edge**            | Boundary values (empty, very long, special chars)                                   |
| **Integration**     | Page → API → DB; auth → API                                                         |
| **API**             | Every public + admin route handler                                                  |
| **Database**        | Migrations, RLS, constraints, triggers                                              |
| **UI**              | Page-level behaviour (auth redirect, public pages, motion)                          |
| **Performance**     | Response time budgets (read endpoints < 500 ms typical, write < 1 s typical)        |
| **Security**        | CSP, CSRF, RLS, cookie flags, input validation, IDOR, open redirect, authz bypass   |
| **Regression**      | Re-run a curated suite before every release                                         |

## 4. Test data strategy

- **Live data** is never used.
- **Placeholders** for secrets:
  - `TEST_USER_EMAIL=${TEST_USER_EMAIL}` — the authorised admin
  - `TEST_USER_PASSWORD=${TEST_USER_PASSWORD}` — for OAuth-less smoke (not used; the
    project is OAuth-only)
  - `SUPABASE_URL`, `SUPABASE_SERVICE_KEY` — for DB scripts
  - `SCALEKIT_*` — for the OAuth flow when running E2E
  - `CLOUDINARY_*` — for image upload tests
- **Fixtures** (reusable, immutable) live in `test-data/fixtures/`.
- **Valid / invalid / edge / large** partitions per the task spec live under `test-data/`.

## 5. Environments

| Environment | When                             | What runs                                       |
|-------------|----------------------------------|-------------------------------------------------|
| `local-offline` | `NEXT_PUBLIC_SUPABASE_URL` unset | Public smoke + UI regression                   |
| `local-online`  | Real env vars, local Postgres   | API + DB + auth + security                      |
| `staging`       | Vercel preview                   | Smoke + key E2E                                |
| `production`    | Live                             | Smoke only, post-deploy                        |

## 6. What we test (priority order)

1. **Public pages render** (offline mode) — `automation/scripts/smoke-public.mjs`
2. **Public APIs return valid data** — `automation/api/public-projects.test.mjs` etc.
3. **Auth flow** — login redirect, callback, session cookie, logout.
4. **Authorization** — non-authorised email is rejected; admin APIs refuse unauthenticated
   callers.
5. **CSRF** — cross-origin POST to admin API returns 403.
6. **Rate limiting** — burst of 70 requests to `/api/projects`; the 61st onward 429s.
7. **Public project filter** — projects with missing GitHub / preview / language are hidden.
8. **Hero image invariant** — setting `is_hero = true` on one row un-sets others.
9. **Resume upload** — PDF accepted, > 5 MB rejected, non-PDF rejected.
10. **Migrations** — `npm run db:status` reflects applied set, hash drift is detected.
11. **CSP / security headers** — every response carries CSP, XCTO, XFO, Referrer-Policy.
12. **Audit log** — admin writes appear in `audit_log` with actor + before/after.
13. **Performance budgets** — `GET /api/projects` < 500 ms with 50 projects.
14. **Motion UI** — `/test-ui` page renders; no console errors.

## 7. What we explicitly do *not* test here

- Browser-level pixel-perfect rendering.
- Load tests with real users.
- Penetration testing beyond header + IDOR checks.
- Real Cloudinary uploads (we mock with a small fake server in the harness).

## 8. CI / CD

The repo has no CI YAML. Suggested workflow (not yet wired):

1. Lint (`npm run lint`)
2. Build (`npm run build`)
3. Migration status check (`npm run db:status` against a test schema)
4. Smoke (`node harness/automation/scripts/smoke-public.mjs`)
5. API tests (`node --test harness/automation/api`)
6. DB tests (`node --test harness/automation/database`)

## 9. Maintenance

- **Adding a feature?** Drop a folder in `features/<name>/` using the template.
- **Adding a test case?** Drop it in `test-cases/<feature>/<type>.md` and reference the
  scenario from `test-scenarios/<type>.md`.
- **Found a bug?** Create `bugs/open/BUG-xxx.md` and link to the regression test.
- **Ran a suite?** Add a `RUN-yyyy-nn.md` in `test-results/latest/` and update
  `TESTING_STATUS.md` and `reports/coverage.md`.

## 10. Known limitations

- No Playwright/Cypress — UI tests are HTTP-only. Motion + visual regressions are
  currently **not** testable.
- No code coverage tool — `reports/coverage.md` is requirement / feature coverage only.
- No mutation testing.
- OAuth requires real Scalekit credentials to run an end-to-end login test. The harness
  provides a stub `automation/scripts/oauth-callback-stub.mjs` for that scenario.
