# Auth — regression cases

```text
Test Case ID:    TC-AUTH-030
Feature:         FEAT-012
Priority:        P0
Type:            REGRESSION
Preconditions:   Production env.
Steps:
  1. Inspect Set-Cookie on /api/auth/login response
Expected Result: scalekit_session has HttpOnly, Secure, SameSite=Lax.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-115
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-031
Feature:         FEAT-012
Priority:        P0
Type:            REGRESSION
Preconditions:   Production env.
Steps:
  1. GET /api/auth/login?next=/admin
Expected Result: Cookie `auth_next` is set to `/admin` (same-origin only).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-007, BR-008
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-032
Feature:         FEAT-012
Priority:        P0
Type:            REGRESSION
Preconditions:   Any /api/auth/* endpoint.
Steps:
  1. Inspect Cache-Control header
Expected Result: `Cache-Control: private, no-store, max-age=0, must-revalidate`.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/auth-cache-control.headers
Related Requirement: REQ-103
Last Executed:   —
```
