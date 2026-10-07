# Features

Each feature has a stable ID (`FEAT-xxx`) and its own folder using the template below.
Features are derived from the routes, APIs, and admin surfaces in the project.

## Index

| ID       | Name                                    | Folder                              | Status         |
|----------|-----------------------------------------|-------------------------------------|----------------|
| FEAT-001 | Public home                             | `public-home/`                      | Documented     |
| FEAT-002 | Public about                            | `public-about/`                     | Documented     |
| FEAT-003 | Public skills                           | `public-skills/`                    | Documented     |
| FEAT-004 | Public education                        | `public-education/`                 | Documented     |
| FEAT-005 | Public experience                       | `public-experience/`                | Documented     |
| FEAT-006 | Public projects                         | `public-projects/`                  | Documented     |
| FEAT-007 | Public contact                          | `public-contact/`                   | Documented     |
| FEAT-008 | Public resume (download + view)         | `public-resume/`                    | Documented     |
| FEAT-009 | Public personal info (key/value)        | `public-info/`                      | Documented     |
| FEAT-010 | Site mode (single / multi-page)         | `site-mode/`                        | Documented     |
| FEAT-011 | Public portfolio (root portfolio surface) | `public-portfolio/`               | Documented     |
| FEAT-012 | Admin authentication (OAuth + session)  | `admin-auth/`                       | Documented     |
| FEAT-013 | Admin authorization (email gate)        | `admin-auth/` (authz subsection)    | Documented     |
| FEAT-014 | Admin dashboard                         | `admin-dashboard/`                  | Documented     |
| FEAT-015 | Admin skills (CRUD + categories)        | `admin-skills/`                     | Documented     |
| FEAT-016 | Admin projects                          | `admin-projects/`                   | Documented     |
| FEAT-017 | Admin hero images (gallery)             | `admin-hero-images/`                | Documented     |
| FEAT-018 | Admin resumes (PDF upload)              | `admin-resumes/`                    | Documented     |
| FEAT-019 | Admin settings (feature toggles)        | `admin-settings/`                   | Documented     |
| FEAT-020 | Admin social links                      | `admin-social-links/`               | Documented     |
| FEAT-021 | Admin education                         | `admin-education/`                  | Documented     |
| FEAT-022 | Admin experience                        | `admin-experience/`                 | Documented     |
| FEAT-023 | Admin personal info                     | `admin-personal-info/`              | Documented     |
| FEAT-024 | Admin API logs                          | `admin-api-logs/`                   | Documented     |
| FEAT-025 | Admin CSP reports                       | `admin-csp-reports/`                | Documented     |
| FEAT-026 | Audit log (DB-only)                     | `audit-log/`                        | Documented     |
| FEAT-027 | Motion UI (kinetic typography, ambient) | `motion-ui/`                        | Documented     |

## Feature template

Every feature folder contains a `README.md` with the following sections:

```text
Feature:        (FEAT-XXX — Name)
Purpose:
User:
Entry Point:
Dependencies:
Inputs:
Outputs:
Business Rules: (refs to BR-xxx in requirements/business-rules.md)
Expected Behavior:
Error Handling:
Permissions:
Related APIs:
Related Database Tables:
Related UI:
Existing Tests:
Missing Tests:
Known Issues:
```

> Where data is not derivable from code, the section says `UNKNOWN / REQUIRES VALIDATION`.
