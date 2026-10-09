# Security — regression cases

```text
Test Case ID:    TC-SEC-040
Feature:         FEAT-018 (headers)
Priority:        P0
Type:            REGRESSION
Preconditions:   Server running.
Steps:
  1. GET /api/projects
  2. GET /api/auth/validate
  3. GET /admin (302 redirect to /api/auth/login)
Expected Result: All three carry the security headers (CSP, XCTO, XFO, RP, PP, RE).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/api-responses/all-headers.headers
Related Requirement: REQ-100, REQ-101
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-041
Feature:         FEAT-012 (auth)
Priority:        P0
Type:            REGRESSION
Preconditions:   Production env.
Steps:
  1. Inspect Set-Cookie on /api/auth/login
Expected Result: HttpOnly, Secure, SameSite=Lax, Path=/.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-115
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-042
Feature:         FEAT-027 (build)
Priority:        P0
Type:            REGRESSION
Preconditions:   Built bundle present.
Steps:
  1. grep -r scalekit_session= public/ || true
Expected Result: 0 matches.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/logs/build-secret-scan.log
Related Requirement: REQ-114
Last Executed:   —
```
