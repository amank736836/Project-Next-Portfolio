# Admin social links — regression cases

```text
Test Case ID:    TC-ADM-SL-030
Feature:         FEAT-020
Priority:        P0
Type:            REGRESSION
Preconditions:   social_links table populated.
Steps:
  1. SQL: SELECT platform, url FROM social_links WHERE is_hidden = false ORDER BY display_order
Expected Result: Stable order, no duplicates per platform.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/database-results/social-links-list.txt
Related Requirement: REQ-019
Last Executed:   —
```
