# Admin experience — edge cases

```text
Test Case ID:    TC-ADM-EX-020
Feature:         FEAT-022
Priority:        P2
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/experience with title containing HTML <i>X</i>
Expected Result: HTTP 200; row stored.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-021
Last Executed:   —
```
