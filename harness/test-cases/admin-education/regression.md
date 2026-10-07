# Admin education — regression cases

```text
Test Case ID:    TC-ADM-ED-030
Feature:         FEAT-021
Priority:        P0
Type:            REGRESSION
Preconditions:   education table populated.
Steps:
  1. SQL: SELECT count(*) FROM education WHERE is_hidden = true
Expected Result: ≥ 0.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/database-results/education-hidden-count.txt
Related Requirement: REQ-020
Last Executed:   —
```
