# Admin settings — regression cases

```text
Test Case ID:    TC-ADM-ST-030
Feature:         FEAT-019
Priority:        P0
Type:            REGRESSION
Preconditions:   Migrations applied.
Steps:
  1. SQL: SELECT key FROM user_settings
Expected Result: `enable_scroll_reveal` and `enable_typewriter` exist.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/database-results/user_settings-keys.txt
Related Requirement: REQ-018
Last Executed:   —
```
