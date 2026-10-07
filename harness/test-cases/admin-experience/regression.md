# Admin experience — regression cases

```text
Test Case ID:    TC-ADM-EX-030
Feature:         FEAT-022
Priority:        P0
Type:            REGRESSION
Preconditions:   experience table populated.
Steps:
  1. SQL: SELECT count(*) FROM experience WHERE is_hidden = false
Expected Result: ≥ 0.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/database-results/experience-visible-count.txt
Related Requirement: REQ-021
Last Executed:   —
```
