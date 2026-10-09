# Admin resumes — negative cases

```text
Test Case ID:    TC-ADM-RS-010
Feature:         FEAT-018
Priority:        P0
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/upload with file=image/jpeg, is_resume=true
Expected Result: HTTP 400; { error: 'Only PDF files allowed for resumes' }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-023, BR-007
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-RS-011
Feature:         FEAT-018
Priority:        P0
Type:            NEGATIVE
Preconditions:   Admin authenticated.
Steps:
  1. POST /api/admin/upload with file=6MB PDF, is_resume=true
Expected Result: HTTP 400; { error: 'File too large. Maximum size is 5MB.' }.
Status:          NOT_RUN
Automation:      MANUAL
Evidence:        —
Related Requirement: REQ-023, BR-007
Last Executed:   —
```

```text
Test Case ID:    TC-ADM-RS-012
Feature:         FEAT-018
Priority:        P0
Type:            NEGATIVE
Preconditions:   No session.
Steps:
  1. POST /api/admin/upload
Expected Result: HTTP 401.
Status:          NOT_RUN
Automation:      AUTOMATED
Evidence:        evidence/api-responses/resumes-401.json
Related Requirement: REQ-011
Last Executed:   —
```
