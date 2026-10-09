# Security / VAPT Scenarios

> See `test-tools/security/README.md` for the manual security checklist.

| ID            | Category               | Scenario                                                                                  | Related TC          |
|---------------|------------------------|-------------------------------------------------------------------------------------------|---------------------|
| SCN-SEC-001   | CSP                    | All HTML responses carry a Content-Security-Policy header                                  | TC-SEC-001          |
| SCN-SEC-002   | X-Content-Type-Options | All responses carry `X-Content-Type-Options: nosniff`                                     | TC-SEC-002          |
| SCN-SEC-003   | X-Frame-Options        | All responses carry `X-Frame-Options: SAMEORIGIN`                                          | TC-SEC-003          |
| SCN-SEC-004   | Referrer-Policy        | All responses carry `Referrer-Policy: strict-origin-when-cross-origin`                     | TC-SEC-004          |
| SCN-SEC-005   | Permissions-Policy     | All responses carry `Permissions-Policy: camera=(), microphone=(), geolocation=()...`      | TC-SEC-005          |
| SCN-SEC-006   | X-Powered-By           | Responses do NOT carry `X-Powered-By: Next.js` (or any)                                   | TC-SEC-006          |
| SCN-SEC-007   | Reporting-Endpoints    | Responses carry `Reporting-Endpoints: csp-endpoint="/api/csp-report"`                       | TC-SEC-007          |
| SCN-SEC-008   | Open redirect          | `/api/auth/login?next=//evil.com` falls back to /dashboard                                  | TC-AUTH-008         |
| SCN-SEC-009   | Open redirect          | `/api/auth/login?next=https://evil.com/x` falls back to /dashboard                          | TC-AUTH-008         |
| SCN-SEC-010   | CSRF                   | Cross-origin POST to /api/admin/skills returns 403                                          | TC-SEC-011          |
| SCN-SEC-011   | CSRF                   | POST without Origin and Referer headers to /api/admin/* returns 403                        | TC-SEC-012          |
| SCN-SEC-012   | Auth gate              | /api/admin/* without session returns 401                                                    | TC-AUTH-005         |
| SCN-SEC-013   | Authz gate             | /api/admin/* with non-authorised email returns 403                                          | TC-AUTH-007         |
| SCN-SEC-014   | Rate limit             | 61st POST to /api/admin/* within 60 s returns 429                                           | TC-SEC-014          |
| SCN-SEC-015   | SQL injection          | Submitting `'; DROP TABLE skills; --` in `title` is treated as literal text                  | TC-SEC-015          |
| SCN-SEC-016   | XSS in HTML            | Submitting `<script>alert(1)</script>` in `title` is escaped (admin uses innerHTML carefully) | TC-SEC-016         |
| SCN-SEC-017   | File upload type       | Uploading `.exe` as resume returns 400                                                     | TC-ADM-RS-010       |
| SCN-SEC-018   | File upload size       | Uploading 10 MB file returns 400                                                            | TC-ADM-RS-011       |
| SCN-SEC-019   | Cookie flags           | `scalekit_session` cookie has HttpOnly, Secure (in prod), SameSite=Lax                      | TC-SEC-019          |
| SCN-SEC-020   | CSP report filter      | Production report from different origin is filtered as noise                                 | TC-SEC-020          |
| SCN-SEC-021   | IDOR                   | Project DELETE by another admin's id would 404 (single-tenant — covered by authz)           | UNKNOWN             |
| SCN-SEC-022   | Privilege escalation   | Cookie tampering to fake authorised email is rejected (JWT signed)                           | UNKNOWN             |
| SCN-SEC-023   | Token exposure         | Search of build output for `SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, `SCALEKIT_CLIENT_SECRET` returns 0 matches | TC-SEC-023 |
| SCN-SEC-024   | Rate limit (Upstash)   | When Upstash env is set, in-memory store is bypassed                                       | UNKNOWN             |
