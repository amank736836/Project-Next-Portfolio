# FEAT-025 — Admin CSP reports

```text
Feature:        FEAT-025 — Admin CSP reports
Purpose:        Receive and display browser CSP violation reports.
User:           Admin.
Entry Point:
  - POST /api/csp-report (public; receives reports)
  - GET /api/admin/csp-reports (admin; reads them)
Dependencies:   csp_reports table.
Inputs:         CSP violation report body (array or single object).
Outputs:        JSON list of stored reports.
Business Rules: BR-013 (CSP source allow-list).
Expected Behavior:
  - /api/csp-report:
    - Returns 204 on success.
    - Filters noise: dev environment, browser extensions, documents whose origin
      differs from NEXT_PUBLIC_APP_URL[_PROD] (defaults to https://amank.co.in).
  - /api/admin/csp-reports: returns the rows.
Error Handling: 204 even on bad input (so browsers don't retry).
Permissions:    Public POST; admin-only read.
Related APIs:   /api/csp-report, /api/admin/csp-reports
Related Database Tables: csp_reports
Related UI:     app/(admin)/admin/csp-reports/page.jsx
Existing Tests: None.
Missing Tests:
  - Filter logic in dev vs production
  - Storage of valid report
Known Issues:   None.
```
