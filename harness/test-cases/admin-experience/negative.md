# Admin experience — negative cases

```text
Test Case ID:    TC-ADM-EX-010
Feature:         FEAT-022
Priority:        P0
Type:            NEGATIVE
Preconditions:   No session.
Steps:
  1. GET /api/admin/experience
Expected Result: HTTP 401.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/experience-401.json
Related Requirement: REQ-011
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-EX-011
Feature:         FEAT-022
Priority:        P1
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/experience with body { title: '' }
Expected Result: HTTP 500.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-021
Last Executed:   —
```
