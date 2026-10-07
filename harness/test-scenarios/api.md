# API Scenarios

Every API route should be tested in:

- **Auth** — anonymous, authenticated, authorised
- **CRUD** — happy path + each non-happy variant
- **Caching** — Cache-Control where applicable
- **Logging** — api_logs row created (where applicable)

| ID           | Endpoint                              | Method(s)         | Coverage target                                       |
|--------------|---------------------------------------|-------------------|--------------------------------------------------------|
| SCN-API-001  | /api/projects                         | GET               | Public list (filtered)                                 |
| SCN-API-002  | /api/info                             | GET               | Public personal_info                                    |
| SCN-API-003  | /api/resume                           | GET               | Active resume metadata                                  |
| SCN-API-004  | /api/resume/view                      | GET               | PDF stream                                             |
| SCN-API-005  | /api/resume/download                  | GET               | PDF download                                           |
| SCN-API-006  | /api/csp-report                       | POST              | Accept violation                                       |
| SCN-API-007  | /api/auth/login                       | GET               | Redirect to Scalekit                                   |
| SCN-API-008  | /api/auth/callback                    | GET               | Code exchange, session set                             |
| SCN-API-009  | /api/auth/validate                    | GET               | Report auth state                                      |
| SCN-API-010  | /api/auth/refresh                     | POST              | Refresh access token                                   |
| SCN-API-011  | /api/auth/logout                      | GET / POST        | Logout flow                                            |
| SCN-API-012  | /api/auth/retry                       | GET               | Re-login flow                                          |
| SCN-API-013  | /api/admin/skills                     | GET/POST/PUT/PATCH/DELETE | Skills CRUD + allow-list                        |
| SCN-API-014  | /api/admin/skill-categories           | GET/POST/PUT/DELETE     | Categories CRUD                                   |
| SCN-API-015  | /api/admin/projects                   | GET/POST/PUT/DELETE     | Projects CRUD                                    |
| SCN-API-016  | /api/admin/hero-images                | GET/POST               | Hero image list/upload                            |
| SCN-API-017  | /api/admin/hero-images/[id]           | PATCH/DELETE           | Hero image update/delete                         |
| SCN-API-018  | /api/admin/upload                     | POST (multipart)       | Image → Cloudinary; PDF → Supabase Storage      |
| SCN-API-019  | /api/admin/resumes                    | GET/POST               | Resume list/register                             |
| SCN-API-020  | /api/admin/settings                   | GET/POST/PUT/DELETE     | Settings CRUD                                   |
| SCN-API-021  | /api/admin/social-links               | GET/POST               | Social links list/create                        |
| SCN-API-022  | /api/admin/social-links/[id]          | PATCH/DELETE           | Social link update/delete                       |
| SCN-API-023  | /api/admin/education                  | GET/POST/PUT/DELETE     | Education CRUD                                  |
| SCN-API-024  | /api/admin/experience                 | GET/POST/PUT/DELETE     | Experience CRUD                                 |
| SCN-API-025  | /api/admin/info                       | GET/POST/PUT/DELETE     | Personal info CRUD                              |
| SCN-API-026  | /api/admin/api-logs                   | GET                    | API log read                                    |
| SCN-API-027  | /api/admin/csp-reports                | GET                    | CSP report read                                 |
