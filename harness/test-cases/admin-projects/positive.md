# Admin projects — positive cases

```text
Test Case ID:    TC-ADM-PR-001
Feature:         FEAT-016
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. GET /api/admin/projects
Expected Result: HTTP 200; array of projects (may include hidden).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-016
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PR-002
Feature:         FEAT-016
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/projects with body { "title": "X", "img": "/assets/x.png" }
Expected Result: HTTP 200; row's is_hidden defaults to true.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-016
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PR-003
Feature:         FEAT-016
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; project exists.
Steps:
  1. PUT /api/admin/projects with body { "id": <id>, "title": "New" }
Expected Result: HTTP 200; row updated.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-016
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PR-004
Feature:         FEAT-016
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; project exists.
Steps:
  1. DELETE /api/admin/projects?id=<id>
Expected Result: HTTP 200; { success: true }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-016
Last Executed:   —
```
