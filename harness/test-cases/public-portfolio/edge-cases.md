# Public portfolio — edge cases

```text
Test Case ID:    TC-PUB-030
Feature:         FEAT-006
Priority:        P2
Type:            EDGE
Preconditions:   DB has a project with `img = '/assets/default.png'`.
Steps:
  1. GET /api/projects
Expected Result: That project is NOT in the response array.
Status:          NOT_RUN
Automation:      AUTOMATED (requires DB)
Evidence:        evidence/api-responses/projects-filtered.json
Related Requirement: REQ-003, BR-001
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-031
Feature:         FEAT-006
Priority:        P2
Type:            EDGE
Preconditions:   DB has a project with `is_hidden = true`.
Steps:
  1. GET /api/projects
Expected Result: That project is NOT in the response array.
Status:          NOT_RUN
Automation:      AUTOMATED (requires DB)
Evidence:        —
Related Requirement: REQ-003, BR-001
Last Executed:   —
```

```text
Test Case ID:    TC-PUB-032
Feature:         FEAT-006
Priority:        P2
Type:            EDGE
Preconditions:   DB has a project with `details` missing GitHub.
Steps:
  1. GET /api/projects
Expected Result: That project is NOT in the response array.
Status:          NOT_RUN
Automation:      AUTOMATED (requires DB)
Evidence:        —
Related Requirement: REQ-003, BR-001
Last Executed:   —
```
