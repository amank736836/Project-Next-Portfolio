# Public projects — edge cases

```text
Test Case ID:    TC-PUB-PR-020
Feature:         FEAT-006
Priority:        P2
Type:            EDGE
Preconditions:   Project with title='' exists.
Steps:
  1. GET /api/projects
Expected Result: Project is filtered out.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003, BR-001
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-PR-021
Feature:         FEAT-006
Priority:        P2
Type:            EDGE
Preconditions:   Project with title case-insensitive "GitHub" + http URL.
Steps:
  1. GET /api/projects
Expected Result: Project is included (lowercase match is case-insensitive in code).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003, BR-001
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-PR-022
Feature:         FEAT-006
Priority:        P2
Type:            EDGE
Preconditions:   Project with `img` URL containing 'placeholder' (case-insensitive).
Steps:
  1. GET /api/projects
Expected Result: Project is filtered out.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-003, BR-001
Last Executed:   —
```
