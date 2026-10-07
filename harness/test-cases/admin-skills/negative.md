# Admin skills — negative cases

```text
Test Case ID:    TC-ADM-SK-010
Feature:         FEAT-015
Priority:        P0
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/skills with body { "title": "" }
Expected Result: HTTP 400; body { error: 'Skill title is required' }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SK-011
Feature:         FEAT-015
Priority:        P0
Type:            NEGATIVE (security)
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/skills with body { "title": "X", "is_admin": true, "evil": 1 }
Expected Result: HTTP 200; returned row has only allowed fields; is_admin / evil stripped.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015, BR-011
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SK-012
Feature:         FEAT-015
Priority:        P1
Type:            NEGATIVE (DB)
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/skills with body { "title": "X", "percentage": 200 }
Expected Result: DB CHECK rejects; route returns 500 with Supabase error.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SK-013
Feature:         FEAT-015
Priority:        P2
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. PATCH /api/admin/skills?id=999999 with body { "is_featured": true }
Expected Result: HTTP 500 (Supabase returns "0 rows" error).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-015
Last Executed:   —
```
