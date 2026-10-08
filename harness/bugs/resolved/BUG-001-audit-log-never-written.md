```text
Bug ID:        BUG-001
Title:         audit_log table is not written to by application code
Severity:      S2 (major)
Priority:      P2
Feature:       FEAT-026
Environment:   any

(moved from known-issues.md — this bug pre-dated the 2026-10-08 bug hunt)

Fix applied (2026-10-08): New helper lib/audit.js exports logAudit(), which
inserts into audit_log (action, resource_type, resource_id, old_data, new_data,
actor_email from the Scalekit session, ip_address, user_agent) and never throws.
It is wired into every admin write handler: projects (POST/PUT/DELETE), skills
(POST/PUT/PATCH/DELETE), skill-categories (POST/PUT/DELETE), education
(POST/PUT/DELETE), experience (POST/PUT/DELETE), info (POST/PUT/PATCH/DELETE),
settings (POST/PUT/DELETE), social-links (POST + [id] PATCH/DELETE), hero-images
(POST + [id] PATCH/DELETE), resumes (PUT/DELETE) and upload (POST).
Verification: scratch/admin-crud-probe.mjs exercises every one of these handlers
(60/60 PASS) with zero '[Audit] Failed' messages in the server log.

Status:      VERIFIED (fixed 2026-10-08)
```
