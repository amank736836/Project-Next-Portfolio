# FEAT-024 — Admin API logs

```text
Feature:        FEAT-024 — Admin API logs
Purpose:        Read API call history (duration, status, error) recorded by
                withApiLogging.
User:           Admin.
Entry Point:    /api/admin/api-logs
Dependencies:   api_logs table, withApiLogging wrapper.
Inputs:         None.
Outputs:        JSON rows.
Business Rules: BR-012 (redaction).
Expected Behavior:
  - Returns recent log rows (no pagination parameters observed).
  - Sensitive headers and body fields are redacted before storage.
Error Handling: 500 on DB error.
Permissions:    Admin only.
Related APIs:   /api/admin/api-logs
Related Database Tables: api_logs
Related UI:     components/Admin/Dashboard/OperationLogs.jsx
Existing Tests: None.
Missing Tests:
  - Redaction (assertion that password fields are [REDACTED])
  - Recent rows ordering
Known Issues:   None.
```
