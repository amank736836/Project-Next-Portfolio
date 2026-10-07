# Auth — positive cases

```text
Test Case ID:    TC-AUTH-001
Feature:         FEAT-012
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Server running.
Steps:
  1. GET /api/auth/validate
Expected Result: HTTP 200; body { authenticated: false }.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/validate-anon.json
Related Requirement: REQ-008
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-002
Feature:         FEAT-012
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Server running.
Steps:
  1. GET /api/auth/login
Expected Result: HTTP 302 to a Scalekit authorize URL (contains scalekit / .well-known).
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/login-redirect.headers
Related Requirement: REQ-007
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-003
Feature:         FEAT-012
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Valid session cookie.
Steps:
  1. GET /api/auth/validate with Cookie: scalekit_session=...
Expected Result: HTTP 200; body { authenticated: true, user, sessionStartedAt }.
Status:          NOT_RUN
Automation:      MANUAL (requires real Scalekit)
Evidence:        —
Related Requirement: REQ-008
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-004
Feature:         FEAT-012
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Valid session, token near expiry.
Steps:
  1. POST /api/auth/refresh
Expected Result: HTTP 200; body { message: 'Token refreshed successfully', session: { user } }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-009
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-007
Feature:         FEAT-013
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Valid session; user email === AUTHORIZED_ADMIN_EMAIL.
Steps:
  1. GET /api/admin/info with cookie
Expected Result: HTTP 200; body is the personal_info list.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-011, REQ-012
Last Executed:   —
```
