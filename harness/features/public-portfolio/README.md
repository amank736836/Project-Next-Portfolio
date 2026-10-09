# FEAT-011 — Public portfolio (root portfolio surface)

```text
Feature:        FEAT-011 — Public portfolio (root portfolio surface)
Purpose:        The portfolio's public face — pages and sections the visitor sees.
User:           Public visitor.
Entry Point:    GET /  and every page under app/(public)/
Dependencies:   All FEAT-001 to FEAT-010 indirectly.
Inputs:         None.
Outputs:        Server-rendered HTML.
Business Rules: BR-004, BR-014, BR-015.
Expected Behavior:
  - The portfolio loads fast thanks to ISR (`revalidate = 60`).
  - When the database is unavailable, the offline client falls back to seed data.
Error Handling: Errors degrade gracefully (offline fallback).
Permissions:    None.
Related APIs:   /api/auth/validate (used to render admin surface hints in UI)
Related Database Tables: (none direct)
Related UI:     components/sections/*, components/Navbar/*
Existing Tests: None.
Missing Tests:
  - LCP / CLS budgets
  - Cache revalidation triggers a re-render
Known Issues:   None.
```
