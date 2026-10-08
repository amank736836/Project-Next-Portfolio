# Open bugs

The list of `BUG-xxx` currently open.  See `bugs/known-issues.md` for the full details.

**No open bugs.** All 15 filed bugs (BUG-001 … BUG-015) were fixed and verified
on 2026-10-08 — their files live in `bugs/resolved/`.

| ID        | Title                                                 | Severity | Priority | Feature   | Status |
|-----------|-------------------------------------------------------|----------|----------|-----------|--------|
| BUG-001   | audit_log table is not written to                     | S2       | P2       | FEAT-026  | RESOLVED |
| BUG-002   | Rate limiter is in-memory only                        | S3       | P2       | FEAT-018  | RESOLVED |
| BUG-003   | api-logger imports non-existent next-auth             | S3       | P3       | FEAT-024  | RESOLVED |
| BUG-004   | No automated RLS coverage                             | S1       | P1       | FEAT-024  | RESOLVED |
| BUG-005   | Hidden personal_info rows exposed publicly            | S1       | P1       | FEAT-008  | RESOLVED |
| BUG-006   | Hidden skills leak in single-page mode                | S2       | P2       | FEAT-020  | RESOLVED |
| BUG-007   | Rate limiter disabled when Upstash env vars set       | S2       | P2       | FEAT-018  | RESOLVED |
| BUG-008   | api_logs publicly readable via anon key (RLS)         | S2       | P2       | FEAT-024  | RESOLVED |
| BUG-009   | No RLS policy/grant for public read of `projects`     | S2       | P2       | FEAT-010  | RESOLVED |
| BUG-010   | validate route imports getAccessToken from wrong module | S2     | P2       | FEAT-002  | RESOLVED |
| BUG-011   | DashboardStats imports non-existent dashboardThemes   | S3       | P2       | FEAT-005  | RESOLVED |
| BUG-012   | Offline client does not enforce UNIQUE constraints    | S3       | P3       | FEAT-013  | RESOLVED |
| BUG-013   | Admin social-links GET hides hidden rows              | S4       | P3       | FEAT-016  | RESOLVED |
| BUG-014   | Hero "Technologies" stat counts hidden skills         | S4       | P3       | FEAT-001  | RESOLVED |
| BUG-015   | Harness test expectation mismatches                   | S4       | P3       | harness   | RESOLVED |

> BUG-005 … BUG-015 were found by a full-repo audit on 2026-10-08
> (static import/export check + live CRUD probe of every admin API route in
> offline mode) and fixed the same day. BUG-001 … BUG-004 pre-existed in
> `bugs/known-issues.md`. See `bugs/resolved/` for each bug's fix and
> verification notes, and `scratch/check-imports.mjs` /
> `scratch/admin-crud-probe.mjs` / `scratch/leak-test.mjs` for the tooling.

> To file a new bug, see `bugs/README.md` for the template.
