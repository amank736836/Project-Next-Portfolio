# Security — positive cases (header presence)

```text
Test Case ID:    TC-SEC-001
Feature:         FEAT-018 (headers)
Priority:        P0
Type:            SECURITY
Preconditions:   Server running.
Steps:
  1. GET /
Expected Result: Response has Content-Security-Policy header.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/root.headers
Related Requirement: REQ-100
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-002
Feature:         FEAT-018 (headers)
Priority:        P0
Type:            SECURITY
Preconditions:   Server running.
Steps:
  1. GET /
Expected Result: Response has X-Content-Type-Options: nosniff.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/root.headers
Related Requirement: REQ-101
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-003
Feature:         FEAT-018 (headers)
Priority:        P0
Type:            SECURITY
Preconditions:   Server running.
Steps:
  1. GET /
Expected Result: Response has X-Frame-Options: SAMEORIGIN.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/root.headers
Related Requirement: REQ-101
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-004
Feature:         FEAT-018 (headers)
Priority:        P0
Type:            SECURITY
Preconditions:   Server running.
Steps:
  1. GET /
Expected Result: Response has Referrer-Policy: strict-origin-when-cross-origin.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/root.headers
Related Requirement: REQ-101
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-005
Feature:         FEAT-018 (headers)
Priority:        P0
Type:            SECURITY
Preconditions:   Server running.
Steps:
  1. GET /
Expected Result: Response has Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=().
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/root.headers
Related Requirement: REQ-101
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-006
Feature:         FEAT-018 (headers)
Priority:        P1
Type:            SECURITY
Preconditions:   Server running.
Steps:
  1. GET /
Expected Result: Response has no X-Powered-By.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/root.headers
Related Requirement: REQ-116
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-007
Feature:         FEAT-018 (headers)
Priority:        P0
Type:            SECURITY
Preconditions:   Server running.
Steps:
  1. GET /
Expected Result: Response has Reporting-Endpoints: csp-endpoint="/api/csp-report".
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/root.headers
Related Requirement: REQ-101
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-008
Feature:         FEAT-018 (CSP)
Priority:        P0
Type:            SECURITY
Preconditions:   Server running.
Steps:
  1. GET /
Expected Result: CSP includes `form-action 'self' https://formspree.io`.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/root.headers
Related Requirement: REQ-100, BR-013
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-013
Feature:         FEAT-018 (auth cache)
Priority:        P0
Type:            SECURITY
Preconditions:   Server running.
Steps:
  1. GET /api/auth/validate
Expected Result: Cache-Control: private, no-store, max-age=0, must-revalidate.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/auth-cache.headers
Related Requirement: REQ-103
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-019
Feature:         FEAT-012 (cookie flags)
Priority:        P0
Type:            SECURITY
Preconditions:   Server running.
Steps:
  1. Inspect Set-Cookie on /api/auth/login response (production env)
Expected Result: scalekit_session has HttpOnly, Secure, SameSite=Lax.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-115
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-020
Feature:         FEAT-025 (CSP filter)
Priority:        P0
Type:            SECURITY
Preconditions:   Server running in production.
Steps:
  1. POST /api/csp-report with body { 'csp-report': { 'document-uri': 'https://evil.com/' } }
Expected Result: Report filtered as noise; not stored.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-026
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-023
Feature:         FEAT-027 (build secret scan)
Priority:        P0
Type:            SECURITY
Preconditions:   Build output (.next) present.
Steps:
  1. grep -r SERVICE_ROLE_KEY .next/
  2. grep -r CLOUDINARY_API_SECRET .next/
  3. grep -r SCALEKIT_CLIENT_SECRET .next/
Expected Result: 0 matches.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/logs/build-secret-scan.log
Related Requirement: REQ-114
Last Executed:   —
```
