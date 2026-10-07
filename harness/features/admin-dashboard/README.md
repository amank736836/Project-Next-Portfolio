# FEAT-014 — Admin dashboard

```text
Feature:        FEAT-014 — Admin dashboard
Purpose:        The /admin landing and dashboard widgets (stats, operation logs,
                theme controller, external status, neural link, quick actions).
User:           Admin.
Entry Point:    GET /admin
Dependencies:   api_logs, csp_reports, resumes, projects, skills, education,
                experience, social_links, user_settings.
Inputs:         None (initial server data via the layout).
Outputs:        Rendered dashboard.
Business Rules: BR-014 (soft delete), BR-015 (reduced motion).
Expected Behavior:
  - Renders dashboard widgets with server-rendered initial data.
  - Sidebar reflects the current path.
  - Operator info (name, initials, session uptime) is shown.
Error Handling: Widgets handle missing data.
Permissions:    Admin only (auth + authz).
Related APIs:   /api/admin/* (read), /api/auth/validate
Related Database Tables: (many)
Related UI:     components/Admin/Dashboard.jsx, components/Admin/Dashboard/*
Existing Tests: None.
Missing Tests:
  - Sidebar active tab
  - Session uptime calculation
Known Issues:   None.
```
