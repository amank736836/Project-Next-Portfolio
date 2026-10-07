# FEAT-017 — Admin hero images

```text
Feature:        FEAT-017 — Admin hero images
Purpose:        Manage the hero image gallery (Cloudinary uploads, ordering,
                active hero).
User:           Admin.
Entry Point:
  - GET /api/admin/hero-images
  - POST /api/admin/hero-images (multipart)
  - PATCH /api/admin/hero-images/[id]
  - DELETE /api/admin/hero-images/[id]
Dependencies:   hero_images table, Cloudinary (upload preset `portfolio_uploads`).
Inputs:         Multipart form (file, altText, isHero) or JSON patch.
Outputs:        JSON { data: rows } or single row.
Business Rules:
  - BR-002 (single active hero)
  - BR-006 (image upload allow-list)
Expected Behavior:
  - Allowed types: image/jpeg, image/png, image/webp; max 5 MB.
  - Upload to Cloudinary via signed upload (preset).
  - Setting `is_hero = true` triggers DB un-set of previous active hero.
  - PATCH updates alt text and/or is_hero.
  - DELETE removes the row.
Error Handling: 400 on missing file, invalid type, or oversize; 500 on Cloudinary
                failure.
Permissions:    Admin only.
Related APIs:   /api/admin/hero-images
Related Database Tables: hero_images
Related UI:     app/(admin)/admin/settings/components/HeroImagesTab.jsx
Existing Tests: None.
Missing Tests:
  - Type allow-list
  - Size cap
  - Single-active invariant via DB trigger
Known Issues:   None.
```
