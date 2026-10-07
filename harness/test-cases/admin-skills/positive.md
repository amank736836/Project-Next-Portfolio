# Admin skills — positive cases

```text
Test Case ID:    TC-ADM-SK-001
Feature:         FEAT-015
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Admin authenticated and authorised.
Steps:
  1. GET /api/admin/skills
Expected Result: HTTP 200; body is an array (possibly empty).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SK-002
Feature:         FEAT-015
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/skills with body { "title": "TestSkill", "percentage": 80 }
Expected Result: HTTP 200; body is the created row.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SK-003
Feature:         FEAT-015
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; a skill row exists.
Steps:
  1. PUT /api/admin/skills with body { "id": <id>, "percentage": 90 }
Expected Result: HTTP 200; row's percentage is 90.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SK-004
Feature:         FEAT-015
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; a skill row exists.
Steps:
  1. DELETE /api/admin/skills?id=<id>
Expected Result: HTTP 200; body { success: true }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SK-005
Feature:         FEAT-015
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; a skill row exists.
Steps:
  1. PATCH /api/admin/skills?id=<id> with body { "is_featured": true }
Expected Result: HTTP 200; row's is_featured is true.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015, BR-003
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SK-006
Feature:         FEAT-015
Priority:        P1
Type:            FUNCTIONAL
Preconditions:   Admin authenticated.
Steps:
  1. GET /api/admin/skill-categories
Expected Result: HTTP 200; body is an array of category rows.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```
