# Performance Scenarios

> Performance budgets are **proposed**, not enforced. Capture timing in
> `evidence/logs/` after each run.

| ID            | Surface                | Scenario                                                                | Budget          |
|---------------|------------------------|-------------------------------------------------------------------------|-----------------|
| SCN-PERF-001  | GET /                  | Cold-cache p95 < 1500 ms (offline mode)                                  | < 1500 ms       |
| SCN-PERF-002  | GET /api/projects      | Response p95 < 500 ms with 50 projects                                    | < 500 ms        |
| SCN-PERF-003  | GET /api/info          | Response p95 < 300 ms                                                    | < 300 ms        |
| SCN-PERF-004  | GET /api/resume        | Response p95 < 300 ms                                                    | < 300 ms        |
| SCN-PERF-005  | GET /api/auth/validate | Response p95 < 200 ms                                                    | < 200 ms        |
| SCN-PERF-006  | POST /api/admin/skills | Response p95 < 1000 ms (single insert)                                    | < 1000 ms       |
| SCN-PERF-007  | Concurrent reads       | 50 concurrent `/api/projects` requests, no 5xx, < 2 s total              | < 2 s total     |
| SCN-PERF-008  | CSP report ingestion   | 100 concurrent POSTs to /api/csp-report, no 5xx, < 2 s                   | < 2 s total     |
| SCN-PERF-009  | Rate limiting          | 70 POSTs in 60 s to /api/admin/skills: 10 × 429 expected                  | 10 × 429        |
| SCN-PERF-010  | Memory                 | Server memory under load does not grow unbounded (manual review)          | UNKNOWN         |

> Use `node --test` + `fetch` to capture timing; store results in
> `evidence/logs/perf-<date>.json`.
