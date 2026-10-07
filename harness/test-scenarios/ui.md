# UI Scenarios

The project has **no Playwright/Cypress** and no headless browser. The harness tests UI
behaviour via HTTP probes only (status code, headers, body markers). Visual regressions
and motion are out of scope.

| ID           | Surface                   | Scenario                                                                        | Related TC       |
|--------------|---------------------------|---------------------------------------------------------------------------------|------------------|
| SCN-UI-001   | Public /                  | Returns 200 and contains the hero section                                        | TC-PUB-001       |
| SCN-UI-002   | Public /about             | Returns 200 and references "About" in HTML                                       | TC-PUB-002       |
| SCN-UI-003   | Public /skills            | Returns 200 and references "Skills" in HTML                                      | TC-PUB-003       |
| SCN-UI-004   | Public /education         | Returns 200 and references "Education" in HTML                                   | TC-PUB-004       |
| SCN-UI-005   | Public /experience        | Returns 200 and references "Experience" in HTML                                  | TC-PUB-005       |
| SCN-UI-006   | Public /projects          | Returns 200 and references "Projects" in HTML                                     | TC-PUB-006       |
| SCN-UI-007   | Public /contact           | Returns 200 and references "Contact" in HTML                                     | TC-PUB-007       |
| SCN-UI-008   | Public /resume            | Returns 200 and references "Resume" in HTML                                      | TC-PUB-008       |
| SCN-UI-009   | Public /test-ui           | Returns 200 and renders without 5xx                                              | TC-PUB-009       |
| SCN-UI-010   | Public /error             | Returns 200 when present                                                        | TC-PUB-011       |
| SCN-UI-011   | Public /permission-denied | Returns 200 when present                                                        | TC-PUB-012       |
| SCN-UI-012   | Public /login             | Returns 200 (then redirects to /api/auth/login)                                  | TC-PUB-013       |
| SCN-UI-013   | Admin /admin              | Returns 200 if authenticated and authorised; else redirect or 403              | TC-AUTH-006      |
| SCN-UI-014   | CSP / security headers    | Every response carries CSP, X-Frame-Options, X-Content-Type-Options, etc.       | TC-SEC-001..008  |
| SCN-UI-015   | /robots.txt               | Returns 200 with `User-agent: *`                                                 | TC-PUB-014       |
| SCN-UI-016   | /sitemap.xml              | Returns 200 with `<urlset`                                                      | TC-PUB-015       |
| SCN-UI-017   | /assets/*                 | Returns the file with `Cache-Control: public, max-age=31536000, immutable`     | TC-PUB-016       |
| SCN-UI-018   | /api/auth/*               | `Cache-Control: private, no-store`                                               | TC-SEC-013       |
