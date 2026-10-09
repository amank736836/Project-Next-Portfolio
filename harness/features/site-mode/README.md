# FEAT-010 — Site mode (single / multi-page)

```text
Feature:        FEAT-010 — Site mode
Purpose:        Allow the owner to switch between a single scrolling page and a
                multi-page experience via personal_info.key = 'site_mode'.
User:           Admin (writes); public visitor (reads).
Entry Point:    GET / (renders differently based on value)
Dependencies:   personal_info.site_mode.
Inputs:         'single' | 'multi' (default 'multi').
Outputs:        Different layouts.
Business Rules: BR-004.
Expected Behavior:
  - 'single' → (public)/page.js returns null, SinglePageLayout is rendered.
  - 'multi'  → per-page structure: /, /about, /skills, /education, /experience,
              /projects, /contact, /resume.
  - Changes take effect after revalidation (≤ 60 s).
Error Handling: Missing row → defaults to 'multi'.
Permissions:    Read: public.  Write: admin only (covered by /api/admin/info).
Related APIs:   GET /api/info (read); PUT /api/admin/info (write)
Related Database Tables: personal_info
Related UI:     components/SinglePageLayout.jsx
Existing Tests: None.
Missing Tests:
  - Single-mode returns null at /
  - Layout renders all sections in single mode
Known Issues:   None.
```
