# Admin social links — edge cases

```text
Test Case ID:    TC-ADM-SL-020
Feature:         FEAT-020
Priority:        P2
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/social-links with url = "javascript:alert(1)"
Expected Result: HTTP 200; URL stored as text. (UI must sanitise; not a route concern.)
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-019
Last Executed:   —
```
