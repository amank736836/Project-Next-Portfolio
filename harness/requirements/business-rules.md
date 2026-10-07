# Business Rules

> Source of truth: route handlers, SQL migrations, admin code. Last updated: 2026-10-07.

---

## BR-001 — Public project visibility filter
A project is shown publicly (`/api/projects`) only if **all** of the following are true:

1. `is_hidden = false`
2. `title` is non-empty
3. `img` is non-empty, not `/assets/default.png`, not a `placeholder` URL
4. `details` is a non-empty JSON array
5. `details` contains a row whose `title` includes "github" and whose `desc` starts with `http`
6. `details` contains a row whose `title` includes "preview" or "link" and whose `desc` starts with `http`
7. `details` contains a row whose `title` includes "language" or "code" and whose `desc` is non-empty

> Source: `app/api/projects/route.js`

---

## BR-002 — Single active hero image
At any time **at most one** `hero_images.is_hero` row is `TRUE`. Setting `is_hero = TRUE`
on a new row un-sets it on every other row.

> Source: `sql/migrations/011_add_hero_images.sql` — trigger `enforce_single_hero_image`.

---

## BR-003 — Featured skills cap
At most **5** skills may have `is_featured = true`. The SkillsManager enforces this
in the admin UI. There is no DB constraint.

> Source: `components/Admin/SkillsManager.jsx` (logical limit).

---

## BR-004 — Site mode
`personal_info.key = 'site_mode'` accepts `'single'` or `'multi'`. Default is `'multi'`.
`'single'` triggers `SinglePageLayout`; `'multi'` uses the per-page structure.

---

## BR-005 — Resume activation
Uploading a new resume sets `is_active = true` and (via migration 012 trigger) sets
`is_active = false` on every other row.

---

## BR-006 — Image upload allow-list
Image uploads must be one of: `image/jpeg`, `image/png`, `image/webp`, `image/gif`,
`image/svg+xml`. Maximum size 5 MB.

> Source: `app/api/admin/upload/route.js`, `app/api/admin/hero-images/route.js`

---

## BR-007 — Resume upload allow-list
Resumes must be `application/pdf`, ≤ 5 MB, and are stored in the Supabase Storage bucket
`portfolio-resumes`.

---

## BR-008 — Open redirect protection
Login's `?next=` parameter must be a same-origin relative path. Anything else
falls back to `/dashboard` (or `/` for retry).

---

## BR-009 — Authorised email
The only authorised admin email is `AUTHORIZED_ADMIN_EMAIL` (env). When unset, the code
defaults to `amankarguwal0@gmail.com` (per `proxy.js`).

> Treat as **single-tenant** for testing.

---

## BR-010 — Session token refresh buffer
`isTokenExpired` returns `true` when the access token expires in ≤ 5 seconds, so the
runner has time to refresh before the next request.

---

## BR-011 — Body allow-listing
Admin route handlers strip unknown fields before sending to Supabase:

- `/api/admin/skills` → `title, percentage, category, icon, color, is_featured, is_hidden`
- `/api/admin/projects` → `title, description, image, img, category, is_hidden, details`

---

## BR-012 — Field-level logging redaction
`api-logger` redacts these header names (case-insensitive):
`authorization, cookie, x-api-key, x-forwarded-for`.

And any body key containing (case-insensitive):
`password, token, secret, api_key, apikey, authorization`.

---

## BR-013 — CSP source allow-list
`script-src` permits `'self'`, `'unsafe-inline'`, `'unsafe-eval'`, plus Google Fonts, Vercel
Analytics (`va.vercel-scripts.com`), and Vercel live (`vercel.live`). `form-action` permits
`https://formspree.io` for the contact form.

---

## BR-014 — Soft delete
Content tables (`projects`, `skills`, `education`, `experience`, `social_links`,
`personal_info`) use an `is_hidden` flag instead of a hard delete. Public APIs filter on
`is_hidden = false`.

---

## BR-015 — Reduced-motion fallback
`app/motion.css` wraps every animation rule in `@media (prefers-reduced-motion: no-preference)`,
and the body element is tagged with a `no-motion` class when motion is disabled.

---

## BR-016 — Public resume fallback
When `resumes` table has no active row, `GET /api/resume` returns a synthetic object
pointing at `/api/resume/view`, and `/api/resume/view` falls back to `public/resume.pdf`.
