# Regression Scenarios

Re-run before every release. Each scenario corresponds to a behaviour the project relies
on and which has been known to break in similar applications.

| ID           | Surface                                | Scenario                                                                            |
|--------------|----------------------------------------|-------------------------------------------------------------------------------------|
| SCN-REG-001  | Public read                            | Public project visibility filter (BR-001) still filters out incomplete projects     |
| SCN-REG-002  | Auth                                   | OAuth state CSRF still rejects mismatched state                                     |
| SCN-REG-003  | Auth                                   | Session cookie has HttpOnly + SameSite=Lax                                          |
| SCN-REG-004  | Auth                                   | Refresh token rotation works end-to-end                                             |
| SCN-REG-005  | Authz                                  | Non-authorised email cannot reach /admin or /api/admin                              |
| SCN-REG-006  | CSRF                                   | Cross-origin admin write is rejected                                                |
| SCN-REG-007  | DB                                     | Single active hero invariant still holds                                            |
| SCN-REG-008  | DB                                     | New resume upload deactivates previous active                                       |
| SCN-REG-009  | Settings                               | Default settings (enable_scroll_reveal, enable_typewriter) still present            |
| SCN-REG-010  | CSP                                    | CSP header unchanged; `form-action 'self' https://formspree.io` still present      |
| SCN-REG-011  | Cache                                  | /assets/* still serves immutable cache headers                                      |
| SCN-REG-012  | Cache                                  | /api/auth/* still serves no-store headers                                            |
| SCN-REG-013  | Build                                  | `npm run build` succeeds with no new lint errors                                    |
| SCN-REG-014  | Offline mode                           | With env vars unset, /api/projects still returns seed data                          |
| SCN-REG-015  | Site mode                              | `personal_info.site_mode = 'single'` makes / return null                            |
| SCN-REG-016  | Resume fallback                        | With no active resume, /api/resume returns synthetic object                         |
| SCN-REG-017  | Resume fallback                        | With no active resume and local file, /api/resume/view serves public/resume.pdf     |
| SCN-REG-018  | Audit log                              | audit_log table exists (REQ-025)                                                    |
