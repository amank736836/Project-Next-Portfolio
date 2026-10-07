# Admin social links — negative cases

```text
Test Case ID:    TC-ADM-SL-010
Feature:         FEAT-020
Priority:        P1
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. PATCH /api/admin/social-links/999999
Expected Result: HTTP 500 (no row to update).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-019
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-SL-011
Feature:         FEAT-020
Priority:        P0
Type:            NEGATIVE
Preconditions:   No session.
Steps:
  1. GET /api/admin/social-links
Expected Result: HTTP 401.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/social-links-401.json
Related Requirement: REQ-011
Last Executed:   —
```
