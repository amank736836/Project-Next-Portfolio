# Public projects — positive cases

```text
Test Case ID:    TC-PUB-PR-001
Feature:         FEAT-006
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Server running.
Steps:
  1. GET /api/projects
Expected Result: HTTP 200; JSON array (possibly empty).
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/public-projects.json
Related Requirement: REQ-003
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-PR-002
Feature:         FEAT-006
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Project row with full required details exists.
Steps:
  1. GET /api/projects
Expected Result: That project is in the response.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003, BR-001
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-PR-003
Feature:         FEAT-006
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Project with `is_hidden = true` exists.
Steps:
  1. GET /api/projects
Expected Result: That project is NOT in the response.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003, BR-001
Last Executed:   —
```
