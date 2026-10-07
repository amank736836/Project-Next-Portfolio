# FEAT-026 — Audit log (DB-only)

```text
Feature:        FEAT-026 — Audit log
Purpose:        Persistent record of admin write actions.
User:           Admin.
Entry Point:    (table only — no application writer currently).
Dependencies:   audit_log table.
Inputs:         (no current writer).
Outputs:        (rows not currently produced).
Business Rules: REQ-025, BR-014.
Expected Behavior:
  - Schema supports: action, resource_type, resource_id, old_data, new_data,
    actor_email, ip_address, user_agent, created_at.
  - Indexes on created_at, (resource_type, resource_id), actor_email.
  - RLS: only admins (auth role) can SELECT.
Error Handling: None.
Permissions:    Service role INSERT; admin SELECT.
Related APIs:   (none)
Related Database Tables: audit_log
Related UI:     app/(admin)/admin/logbook/page.jsx (UNKNOWN if wired)
Existing Tests: None.
Missing Tests:
  - Audit row is written on admin write
  - Old/new data capture
Known Issues:
  - BUG-001 (proposed): no application code writes to audit_log.
    See bugs/known-issues.md.
```
