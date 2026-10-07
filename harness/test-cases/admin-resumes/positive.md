# Admin resumes — positive cases

```text
Test Case ID:    TC-ADM-RS-001
Feature:         FEAT-018
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; Supabase Storage present.
Steps:
  1. GET /api/admin/resumes
Expected Result: HTTP 200; array of resume rows.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-023
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-RS-002
Feature:         FEAT-018
Priority:        P0
Type:            FUNCTIONAL
Preconditions:   Admin authenticated; Supabase Storage present.
Steps:
  1. POST /api/admin/upload as multipart with file=<1MB PDF>, is_resume=true, title=CV
Expected Result: HTTP 200; row created in resumes, file in Storage, previous active row deactivated.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-023, BR-005
Last Executed:   —
```
