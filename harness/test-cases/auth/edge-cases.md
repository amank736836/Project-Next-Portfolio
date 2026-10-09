# Auth — edge cases

```text
Test Case ID:    TC-AUTH-020
Feature:         FEAT-012
Priority:        P2
Type:            EDGE
Preconditions:   Valid session; access token expires in 4 s (within 5 s buffer).
Steps:
  1. GET /api/auth/validate
Expected Result: Refresh fires; response indicates authenticated.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-009, BR-010
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-021
Feature:         FEAT-012
Priority:        P2
Type:            EDGE
Preconditions:   Two concurrent POST /api/auth/refresh from the same session.
Steps:
  1. POST /api/auth/refresh (request 1)
  2. POST /api/auth/refresh (request 2) immediately
Expected Result: One returns 200, the other returns 429.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-009
Last Executed:   —
```

```text
Test Case ID:    TC-AUTH-022
Feature:         FEAT-012
Priority:        P2
Type:            EDGE
Preconditions:   Session JSON malformed (cookie value is not valid JSON).
Steps:
  1. Cookie: scalekit_session=<not-json>
  2. GET /api/auth/validate
Expected Result: HTTP 200; body { authenticated: false }.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/validate-malformed-cookie.json
Related Requirement: REQ-008
Last Executed:   —
```
