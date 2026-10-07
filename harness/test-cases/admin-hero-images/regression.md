# Admin hero images — regression cases

```text
Test Case ID:    TC-ADM-HI-030
Feature:         FEAT-017
Priority:        P0
Type:            REGRESSION
Preconditions:   DB has hero_images rows.
Steps:
  1. SQL: SELECT count(*) FROM hero_images WHERE is_hero = true
Expected Result: 0 or 1.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        evidence/database-results/hero-images-is_hero-count.txt
Related Requirement: REQ-017, BR-002
Last Executed:   —
```
