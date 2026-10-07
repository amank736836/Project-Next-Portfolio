# API — negative cases

```text
Test Case ID:    TC-API-020
Feature:         FEAT-006
Priority:        P1
Type:            NEGATIVE
Preconditions:   Server running.
Steps:
  1. POST /api/projects
Expected Result: HTTP 405.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003
Last Executed:   —
```

```text
Test Case ID:    TC-API-021
Feature:         FEAT-008
Priority:        P1
Type:            NEGATIVE
Preconditions:   Server running.
Steps:
  1. POST /api/resume
Expected Result: HTTP 405.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-005
Last Executed:   —
```

```text
Test Case ID:    TC-API-022
Feature:         FEAT-025
Priority:        P2
Type:            NEGATIVE
Preconditions:   Server running.
Steps:
  1. POST /api/csp-report with body "not-json"
Expected Result: HTTP 204 (no crash, browser retries suppressed).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-026
Last Executed:   —
```
