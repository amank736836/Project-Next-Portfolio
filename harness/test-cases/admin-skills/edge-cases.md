# Admin skills — edge cases

```text
Test Case ID:    TC-ADM-SK-020
Feature:         FEAT-015
Priority:        P2
Type:            EDGE
Preconditions:   Admin authenticated; 5 skills already featured.
Steps:
  1. PATCH /api/admin/skills?id=<new-skill> with body { "is_featured": true }
Expected Result: UI cap (5) should warn; the API itself does not enforce (UNKNOWN).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015, BR-003
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SK-021
Feature:         FEAT-015
Priority:        P2
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/skills with body { "title": "  Trim  " }
Expected Result: HTTP 200; title stored trimmed.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SK-022
Feature:         FEAT-015
Priority:        P2
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/skills with body containing emoji + Unicode
Expected Result: HTTP 200; row stored as-is.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```
