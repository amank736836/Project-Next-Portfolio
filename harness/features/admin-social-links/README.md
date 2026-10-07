# FEAT-020 — Admin social links

```text
Feature:        FEAT-020 — Admin social links
Purpose:        CRUD on the social_links table (replaces personal_info handles).
User:           Admin.
Entry Point:    /api/admin/social-links (GET, POST)
                /api/admin/social-links/[id] (PATCH, DELETE)
Dependencies:   social_links table.
Inputs:         JSON body { platform, url, display_order, is_hidden }.
Outputs:        Social link row(s) as JSON.
Business Rules: BR-014.
Expected Behavior:
  - List ordered by display_order.
  - Patch updates the row in place.
  - Delete removes it.
Error Handling: 500 on DB error.
Permissions:    Admin only.
Related APIs:   /api/admin/social-links
Related Database Tables: social_links
Related UI:     app/(admin)/admin/settings/components/SocialLinksTab.jsx
Existing Tests: None.
Missing Tests:
  - PATCH behaviour
  - Order persistence
Known Issues:   None.
```
