# Public projects — negative cases

```text
Test Case ID:    TC-PUB-PR-010
Feature:         FEAT-006
Priority:        P2
Type:            NEGATIVE
Preconditions:   DB down.
Steps:
  1. GET /api/projects
Expected Result: HTTP 500; { error: '...' }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-PR-011
Feature:         FEAT-006
Priority:        P2
Type:            NEGATIVE
Preconditions:   Project with `details` = 'not-json' exists.
Steps:
  1. GET /api/projects
Expected Result: Project is filtered out.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003, BR-001
Last Executed:   —
```
