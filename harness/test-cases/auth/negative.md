# Auth — negative cases

```text
Test Case ID:    TC-AUTH-005
Feature:         FEAT-013
Priority:        P0
Type:            NEGATIVE
Preconditions:   No session cookie.
Steps:
  1. GET /api/admin/skills
Expected Result: HTTP 401; body { error: 'Unauthorized' }.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/admin-skills-401.json
Related Requirement: REQ-011
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-006
Feature:         FEAT-013
Priority:        P0
Type:            NEGATIVE
Preconditions:   No session cookie.
Steps:
  1. GET /admin
Expected Result: HTTP 307/302 to /api/auth/login?next=/admin.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/admin-redirect.headers
Related Requirement: REQ-011
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-008
Feature:         FEAT-012
Priority:        P0
Type:            NEGATIVE (security)
Preconditions:   Server running.
Steps:
  1. GET /api/auth/login?next=//evil.com/x
  2. GET /api/auth/login?next=https://evil.com/x
  3. GET /api/auth/login?next=javascript:alert(1)
Expected Result: Each request ends up redirecting to /dashboard (or Scalekit authorize URL with default next).
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/login-redirect-unsafe.headers
Related Requirement: REQ-007, BR-008
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-009
Feature:         FEAT-012
Priority:        P1
Type:            NEGATIVE
Preconditions:   No session.
Steps:
  1. POST /api/auth/refresh
Expected Result: HTTP 401; body { error: 'No session found' }.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        —
Related Requirement: REQ-009
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-010
Feature:         FEAT-012
Priority:        P1
Type:            EDGE
Preconditions:   oauth_state cookie missing.
Steps:
  1. GET /api/auth/callback?code=anything&state=anything
Expected Result: Error page (HTML), HTTP 400-ish.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-007
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-011
Feature:         FEAT-012
Priority:        P1
Type:            EDGE
Preconditions:   oauth_state cookie set; callback state mismatches.
Steps:
  1. GET /api/auth/callback?code=anything&state=different
Expected Result: Error page (HTML).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-007
Last Executed:   —
```
