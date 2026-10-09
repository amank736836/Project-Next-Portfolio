# Integration Scenarios

| ID            | Surface                                | Scenario                                                                       |
|---------------|----------------------------------------|--------------------------------------------------------------------------------|
| SCN-INT-001   | Public page → API                      | `/projects` server component fetches `/api/projects` and renders rows           |
| SCN-INT-002   | Public page → DB (direct)              | `/about` page reads `personal_info` directly via Supabase server client         |
| SCN-INT-003   | Admin page → Admin API → DB            | Admin SkillsManager calls `/api/admin/skills` and the route upserts in DB      |
| SCN-INT-004   | Auth (Scalekit) → Session cookie → API | After successful callback, `scalekit_session` is set; `/api/auth/validate` returns authenticated |
| SCN-INT-005   | API → DB                               | `GET /api/projects` returns Supabase rows filtered by `is_hidden = false`      |
| SCN-INT-006   | API → Cloudinary                       | POST /api/admin/hero-images uploads to Cloudinary via signed upload            |
| SCN-INT-007   | API → Supabase Storage                 | POST /api/admin/upload (resume) writes to `portfolio-resumes` bucket            |
| SCN-INT-008   | Browser → /api/csp-report → csp_reports| Browser violation ends up in DB                                                |
| SCN-INT-009   | Proxy → Route handler                  | proxy.js CSRF check happens before the route runs                              |
| SCN-INT-010   | API → api_logs                         | POST /api/admin/skills writes an `api_logs` row via `withApiLogging`            |
| SCN-INT-011   | Site mode change → Public re-render    | Personal_info update to site_mode = 'single' makes / return null                |
| SCN-INT-012   | Public upload (Formspree)              | Form submission goes to formspree.io, not through Next.js                       |
