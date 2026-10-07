# FEAT-001 — Public home (multi-page landing)

```text
Feature:        FEAT-001 — Public home (multi-page landing)
Purpose:        Present the owner at a glance (hero, featured skills, address, location,
                call-to-action buttons) and link to other sections.
User:           Public visitor.
Entry Point:    GET /  (multi-page mode)
Dependencies:   - personal_info row with key='site_mode' (or default 'multi')
                - skills table (featured skills)
                - user_settings (UI feature flags, via layout)
                - hero_images (single active row)
                - social_links (footer/nav)
                - Optional: assets/profile_v4.png (fallback portrait)
Inputs:         None (server component).
Outputs:        Server-rendered HTML with hero, CTAs, featured skill marquee.
Business Rules: BR-004 (site mode); BR-014 (soft delete); BR-015 (reduced motion).
Expected Behavior:
  - In `single` mode, this route returns null and SinglePageLayout is rendered instead.
  - In `multi` mode, the hero shows the active hero image, name, location (if any),
    "Open to Opportunities" badge (if enabled), three CTAs, a marquee of up to 8
    featured skills, and quick-stat CountUps.
  - The site is reachable without authentication.
Error Handling:
  - Supabase errors fall back to seed data via the offline client.
  - Missing hero image → CSS-only background.
Permissions:    None.
Related APIs:   GET /api/info, GET /api/auth/validate
Related Database Tables:
  - personal_info (site_mode, address, phone, etc.)
  - skills (is_featured = true)
  - hero_images
  - social_links
Related UI:     components/sections/HomeSection.jsx, components/ui/* primitives
Existing Tests: None in the project. (smoke harness script covers basic 200 OK.)
Missing Tests:
  - Featured skills ordering
  - Open to Work badge visibility based on setting
  - Single-mode → returns null
Known Issues:   None discovered.
```
