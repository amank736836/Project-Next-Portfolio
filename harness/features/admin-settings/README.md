# FEAT-019 — Admin settings

```text
Feature:        FEAT-019 — Admin settings
Purpose:        Manage user_settings (feature toggles + KV settings).
User:           Admin.
Entry Point:    /api/admin/settings (GET/POST/PUT/DELETE)
Dependencies:   user_settings table.
Inputs:         JSON body { key, title, description, type, options }.
Outputs:        Settings as JSON.
Business Rules: BR-014.
Expected Behavior:
  - POST requires `key` and `title`; type defaults to 'toggle'.
  - PUT upserts an array or single row.
  - DELETE requires `key` query param.
Error Handling: 400 on missing key; 500 on DB error.
Permissions:    Admin only.
Related APIs:   /api/admin/settings
Related Database Tables: user_settings
Related UI:     app/(admin)/admin/settings/AdminSettingsClient.jsx,
                settings-config.js, LayoutTab.jsx
Existing Tests: None.
Missing Tests:
  - Toggle semantics for boolean rows
  - Default seed settings (enable_scroll_reveal, enable_typewriter)
Known Issues:   None.
```
