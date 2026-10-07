# Admin resumes — edge cases

```text
Test Case ID:    TC-ADM-RS-020
Feature:         FEAT-018
Priority:        P1
Type:            EDGE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/upload with file=5120 KB PDF
Expected Result: HTTP 200 (boundary 5 MB accepted).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-023, BR-007
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-RS-021
Feature:         FEAT-018
Priority:        P1
Type:            EDGE
Preconditions:   Admin authenticated; active resume exists.
Steps:
  1. POST /api/admin/upload with another 1 MB PDF
Expected Result: New row inserted; previous is_active set to false (DB trigger).
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-023, BR-005
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-RS-022
Feature:         FEAT-018
Priority:        P1
Type:            EDGE
Preconditions:   Supabase Storage bucket missing.
Steps:
  1. POST /api/admin/upload with 1 MB PDF
Expected Result: HTTP 500.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-023
Last Executed:   —
```
