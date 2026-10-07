# Functional Scenarios

Each scenario describes a **happy-path** verification of one feature.

| ID           | Feature                 | Scenario                                                          | Related TC                  |
|--------------|-------------------------|-------------------------------------------------------------------|-----------------------------|
| SCN-FUN-001  | FEAT-001 Home           | Home renders hero + featured skills in multi mode                  | TC-PUB-001                  |
| SCN-FUN-002  | FEAT-002 About          | About shows ordered personal_info rows                             | TC-PUB-002                  |
| SCN-FUN-003  | FEAT-003 Skills         | Skills page groups by category                                     | TC-PUB-003                  |
| SCN-FUN-004  | FEAT-004 Education      | Education timeline renders non-hidden rows                          | TC-PUB-004                  |
| SCN-FUN-005  | FEAT-005 Experience     | Experience timeline renders non-hidden rows                         | TC-PUB-005                  |
| SCN-FUN-006  | FEAT-006 Projects       | Projects grid shows verified projects                               | TC-PUB-006                  |
| SCN-FUN-007  | FEAT-007 Contact        | Contact form posts to Formspree                                    | TC-PUB-007                  |
| SCN-FUN-008  | FEAT-008 Resume         | Resume metadata returns synthetic fallback when no active row      | TC-PUB-008                  |
| SCN-FUN-009  | FEAT-009 Personal info  | /api/info returns ordered rows                                     | TC-API-002                  |
| SCN-FUN-010  | FEAT-010 Site mode      | /api/info returns site_mode; single-mode renders SinglePageLayout  | TC-PUB-001 (single variant) |
| SCN-FUN-011  | FEAT-012 Auth login     | /api/auth/login redirects to Scalekit authorize URL                | TC-AUTH-002                 |
| SCN-FUN-012  | FEAT-012 Auth validate  | /api/auth/validate returns 200 with shape                          | TC-AUTH-001                 |
| SCN-FUN-013  | FEAT-013 Authz          | Authorised email passes proxy                                      | TC-AUTH-007                 |
| SCN-FUN-014  | FEAT-015 Skills CRUD    | Admin can create + read + update + delete a skill                  | TC-ADM-SK-001, 002, 003, 004 |
| SCN-FUN-015  | FEAT-016 Projects CRUD  | Admin can create + read + update + delete a project                | TC-ADM-PR-001, 002, 003, 004 |
| SCN-FUN-016  | FEAT-017 Hero images    | Admin can list hero images                                         | TC-ADM-HI-001               |
| SCN-FUN-017  | FEAT-018 Resumes upload | Admin can list resumes                                             | TC-ADM-RS-001               |
| SCN-FUN-018  | FEAT-019 Settings CRUD  | Admin can list settings                                            | TC-ADM-ST-001               |
| SCN-FUN-019  | FEAT-020 Social links   | Admin can list social links                                        | TC-ADM-SL-001               |
| SCN-FUN-020  | FEAT-021 Education CRUD | Admin can list education                                           | TC-ADM-ED-001               |
| SCN-FUN-021  | FEAT-022 Experience CRUD| Admin can list experience                                          | TC-ADM-EX-001               |
| SCN-FUN-022  | FEAT-023 Personal info  | Admin can list personal_info                                       | TC-ADM-PI-001               |
| SCN-FUN-023  | FEAT-024 API logs       | Admin can read api_logs                                            | TC-ADM-AL-001               |
| SCN-FUN-024  | FEAT-025 CSP reports    | Public POST /api/csp-report returns 204                            | TC-API-010                  |
| SCN-FUN-025  | FEAT-027 Motion UI      | /test-ui renders without errors                                    | TC-PUB-009                  |

> Functional cases here assume a **happy admin** (authorised email, valid session). The
> unauthenticated / unauthorised variants live in `negative.md` and `security.md`.
