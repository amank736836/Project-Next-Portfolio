# Admin projects — edge cases

```text
Test Case ID:    TC-ADM-PR-020
Feature:         FEAT-016
Priority:        P2
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/projects with empty body {}
Expected Result: HTTP 500 (NOT NULL violation on title).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-016
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PR-021
Feature:         FEAT-016
Priority:        P2
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/projects with details as JSONB string vs object
Expected Result: HTTP 200; row stored with details.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-016
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-PR-022
Feature:         FEAT-016
Priority:        P1
Type:            EDGE
Preconditions:   Two clients POST and DELETE the same project.
Steps:
  1. POST a project, capture id
  2. DELETE /api/admin/projects?id=<id>
  3. PUT /api/admin/projects with body { "id": <id>, "title": "Z" }
Expected Result: PUT after DELETE returns 500 (no rows).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-016
Last Executed:   —
```
