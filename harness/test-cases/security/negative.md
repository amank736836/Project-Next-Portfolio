# Security — negative cases (attacks)

```text
Test Case ID:    TC-SEC-009
Feature:         FEAT-025
Priority:        P1
Type:            NEGATIVE
Preconditions:   Server running.
Steps:
  1. POST /api/csp-report with body containing 'chrome-extension://' source-file
Expected Result: Filtered as noise.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-026
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-010
Feature:         FEAT-025
Priority:        P1
Type:            NEGATIVE
Preconditions:   Server running in dev.
Steps:
  1. POST /api/csp-report with any body
Expected Result: Filtered as noise (NODE_ENV != production).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-026
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-011
Feature:         FEAT-018 (CSRF)
Priority:        P0
Type:            NEGATIVE
Preconditions:   Server running.
Steps:
  1. POST /api/admin/skills with Origin: https://evil.com and a valid session
Expected Result: HTTP 403; { error: 'CSRF validation failed' }.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/csrf-blocked.json
Related Requirement: REQ-013
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-012
Feature:         FEAT-018 (CSRF)
Priority:        P0
Type:            NEGATIVE
Preconditions:   Server running.
Steps:
  1. POST /api/admin/skills with no Origin / Referer and a valid session
Expected Result: HTTP 403; { error: 'CSRF validation failed' }.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/csrf-noorigin.json
Related Requirement: REQ-013
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-014
Feature:         FEAT-018 (rate limit)
Priority:        P0
Type:            NEGATIVE
Preconditions:   Server running; in-memory rate limiter.
Steps:
  1. POST /api/admin/skills 70 times in < 60 s (with valid session)
Expected Result: First 60 return 200/4xx; remainder return 429 with Retry-After.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/logs/rate-limit.log
Related Requirement: REQ-014
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-015
Feature:         FEAT-015 (SQLi)
Priority:        P0
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/skills with body { title: "X'; DROP TABLE skills; --" }
Expected Result: HTTP 200; row inserted with literal text; skills table still exists.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```

```text
Test Case ID:    TC-SEC-016
Feature:         FEAT-015 (XSS)
Priority:        P0
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/skills with body { title: "<script>alert(1)</script>" }
Expected Result: HTTP 200; row stored; admin UI must escape on render.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```
