# Admin education — negative cases

```text
Test Case ID:    TC-ADM-ED-010
Feature:         FEAT-021
Priority:        P0
Type:            NEGATIVE
Preconditions:   No session.
Steps:
  1. GET /api/admin/education
Expected Result: HTTP 401.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/education-401.json
Related Requirement: REQ-011
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-ED-011
Feature:         FEAT-021
Priority:        P1
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/education with body { title: '' }
Expected Result: HTTP 500 (NOT NULL violation).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-020
Last Executed:   —
```
