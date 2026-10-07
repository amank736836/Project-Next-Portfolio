# Functional Requirements

> Source of truth: `app/`, `lib/`, `proxy.js`, `sql/`. Last updated: 2026-10-07.

---

## REQ-001 — Public portfolio site renders
**Status:** ACCEPTED  **Source:** `app/(public)/page.js`, `(public)/layout.jsx`  **Priority:** P0

The application must serve a public portfolio site that displays information about the
owner (bio, skills, projects, education, experience, contact, resume).

**Acceptance criteria:**
- [ ] `GET /` returns 200 in both `single` and `multi` site modes
- [ ] Public routes are reachable without authentication
- [ ] The site can render in offline mode (without Supabase credentials)

**Related features:** FEAT-001, FEAT-002, FEAT-003, FEAT-004, FEAT-005, FEAT-006,
FEAT-007, FEAT-008, FEAT-009

---

## REQ-002 — Site mode toggle (single / multi-page)
**Status:** ACCEPTED  **Source:** `app/(public)/page.js`, `app/(public)/layout.jsx`  **Priority:** P1

`personal_info.key = 'site_mode'` controls whether the public site is a single scrolling
page (`single`) or a multi-page experience (`multi`).

**Acceptance criteria:**
- [ ] `site_mode = 'single'` causes `/` to render `SinglePageLayout` with all sections
- [ ] `site_mode = 'multi'` causes each section to be its own page
- [ ] Changing the value via admin updates the public site after revalidation

**Related features:** FEAT-010

---

## REQ-003 — Public projects list
**Status:** ACCEPTED  **Source:** `app/api/projects/route.js`  **Priority:** P0

`GET /api/projects` must return only the projects that pass the **public visibility filter**.

**Acceptance criteria:**
- [ ] Returns 200 with an array
- [ ] Each project has `title`, `image` or `img`, `description`, `details`
- [ ] Hidden projects (`is_hidden = true`) are excluded
- [ ] Projects with missing GitHub/Preview/Language details are excluded
- [ ] Cache-Control: `s-maxage=60, stale-while-revalidate=120`

**Related features:** FEAT-011, FEAT-012

---

## REQ-004 — Public personal info
**Status:** ACCEPTED  **Source:** `app/api/info/route.js`  **Priority:** P1

`GET /api/info` must return all rows of `personal_info` ordered by `key`.

**Acceptance criteria:**
- [ ] Returns 200 with an array of `{ key, title, description, is_hidden }`
- [ ] Order is ascending by `key`

**Related features:** FEAT-013

---

## REQ-005 — Active resume metadata
**Status:** ACCEPTED  **Source:** `app/api/resume/route.js`  **Priority:** P0

`GET /api/resume` must return the active resume's metadata, falling back to a local file
when no active resume exists in the database.

**Acceptance criteria:**
- [ ] When `resumes.is_active = true` row exists, return its `id, title, file_url, file_name, file_size, is_active, is_favorite, uploaded_at`
- [ ] When no active resume exists (`PGRST116`), return fallback object with
      `id: 0, file_url: '/api/resume/view'`
- [ ] Errors return 500

**Related features:** FEAT-014, FEAT-015

---

## REQ-006 — Active resume PDF streaming
**Status:** ACCEPTED  **Source:** `app/api/resume/view/route.js`  **Priority:** P0

`GET /api/resume/view` must stream the active resume PDF inline.

**Acceptance criteria:**
- [ ] Returns 200 with `Content-Type: application/pdf`
- [ ] Tries Supabase Storage first, falls back to `public/resume.pdf`
- [ ] Returns 404 when no resume is available

**Related features:** FEAT-015

---

## REQ-007 — Admin OAuth login via Scalekit
**Status:** ACCEPTED  **Source:** `app/api/auth/login/route.js`, `callback/route.js`  **Priority:** P0

The admin must log in through Scalekit OAuth 2.0 with state for CSRF and
`offline_access` for refresh tokens.

**Acceptance criteria:**
- [ ] `GET /api/auth/login` redirects to Scalekit authorize URL with `state`
- [ ] `GET /api/auth/callback` validates state, exchanges code, sets `scalekit_session` cookie
- [ ] Open-redirect protection: `?next=` is restricted to same-origin relative paths
- [ ] `auth_next` cookie is cleared on successful callback
- [ ] Failure renders the cyber-luxe error page

**Related features:** FEAT-016

---

## REQ-008 — Session validation
**Status:** ACCEPTED  **Source:** `app/api/auth/validate/route.js`  **Priority:** P0

`GET /api/auth/validate` must report whether a session is present and (if so) return the
user and a session-started-at estimate.

**Acceptance criteria:**
- [ ] No session → `{ authenticated: false }`
- [ ] Valid session → `{ authenticated: true, user, sessionStartedAt }`
- [ ] Cache-Control: no-store

**Related features:** FEAT-016

---

## REQ-009 — Token refresh
**Status:** ACCEPTED  **Source:** `app/api/auth/refresh/route.js`, `lib/auth.js`  **Priority:** P0

`POST /api/auth/refresh` must use the refresh token to obtain a new access token and
update the session cookie.

**Acceptance criteria:**
- [ ] No session → 401
- [ ] Token not yet expired → 200 `{ message: 'Token is still valid' }`
- [ ] Concurrent refresh for the same session → 429
- [ ] Successful refresh updates `scalekit_session`

**Related features:** FEAT-016

---

## REQ-010 — Logout
**Status:** ACCEPTED  **Source:** `app/api/auth/logout/route.js`  **Priority:** P0

`/api/auth/logout` must clear the session and redirect to Scalekit RP-initiated logout
when an `id_token` is present.

**Acceptance criteria:**
- [ ] GET → HTTP redirect to Scalekit logout (or `appBaseUrl + '/'` fallback)
- [ ] POST → JSON `{ logoutUrl }` (used by client-side code)
- [ ] Session cookie is cleared in both cases

**Related features:** FEAT-016

---

## REQ-011 — Admin authentication gate
**Status:** ACCEPTED  **Source:** `proxy.js`, `lib/auth.js`  **Priority:** P0

`/admin/*`, `/dashboard`, and `/api/admin/*` must require a valid session.

**Acceptance criteria:**
- [ ] No session → 401 for admin APIs, redirect to login for admin pages
- [ ] Valid session → request passes the proxy
- [ ] `isAuthenticated()` in route handlers also refreshes near-expiry tokens

**Related features:** FEAT-016, FEAT-017

---

## REQ-012 — Admin authorization gate
**Status:** ACCEPTED  **Source:** `proxy.js`  **Priority:** P0

The session user's email must equal `AUTHORIZED_ADMIN_EMAIL`.

**Acceptance criteria:**
- [ ] Mismatch on admin API → 403
- [ ] Mismatch on admin page → redirect to `/?error=unauthorized_email`

**Related features:** FEAT-017

---

## REQ-013 — CSRF protection on admin writes
**Status:** ACCEPTED  **Source:** `proxy.js`  **Priority:** P0

Mutating requests to `/api/admin/*`, `/api/auth/logout`, and `/api/auth/refresh` must come
from the same origin.

**Acceptance criteria:**
- [ ] Cross-origin POST → 403
- [ ] Missing Origin/Referer → 403 (mutating)
- [ ] Same-origin POST → passes

**Related features:** FEAT-018

---

## REQ-014 — Rate limiting
**Status:** ACCEPTED  **Source:** `proxy.js`  **Priority:** P1

Every mutating admin request is rate-limited to 60 requests per minute per (IP, path, method).

**Acceptance criteria:**
- [ ] First 60 requests pass
- [ ] 61st request returns 429 with `Retry-After`
- [ ] When `UPSTASH_REDIS_REST_URL` is set, the in-memory store is bypassed

**Related features:** FEAT-018

---

## REQ-015 — Skills CRUD
**Status:** ACCEPTED  **Source:** `app/api/admin/skills/route.js`  **Priority:** P0

The admin can create, read, update, and delete skills. Only `title`, `percentage`,
`category`, `icon`, `color`, `is_featured`, `is_hidden` are accepted.

**Acceptance criteria:**
- [ ] `GET` returns all skills
- [ ] `POST` requires a non-empty `title`
- [ ] Unknown fields are stripped
- [ ] All methods require authentication

**Related features:** FEAT-019

---

## REQ-016 — Projects CRUD
**Status:** ACCEPTED  **Source:** `app/api/admin/projects/route.js`  **Priority:** P0

The admin can create, read, update, and delete projects. Only `title`, `description`,
`image`, `img`, `category`, `is_hidden`, `details` are accepted.

**Acceptance criteria:**
- [ ] `GET` returns all projects (including hidden)
- [ ] `POST` defaults `is_hidden` to `true` when not provided
- [ ] `PUT` updates by `id`
- [ ] `DELETE` deletes by `id`
- [ ] All methods require authentication

**Related features:** FEAT-020

---

## REQ-017 — Hero images management
**Status:** ACCEPTED  **Source:** `app/api/admin/hero-images/route.js`  **migration 011`  **Priority:** P1

The admin can upload (multipart) and manage hero images, with at most one active hero at
any time.

**Acceptance criteria:**
- [ ] Allowed types: JPEG / PNG / WebP
- [ ] Max size 5 MB
- [ ] Setting `is_hero = true` on a new row un-sets it on the previous one (DB trigger)

**Related features:** FEAT-021

---

## REQ-018 — Settings CRUD
**Status:** ACCEPTED  **Source:** `app/api/admin/settings/route.js`  **Priority:** P1

The admin can list, create, update, and delete `user_settings` rows.

**Acceptance criteria:**
- [ ] `key` and `title` are required for create
- [ ] `type` defaults to `toggle`
- [ ] `DELETE` requires a `key` query param

**Related features:** FEAT-022

---

## REQ-019 — Social links management
**Status:** ACCEPTED  **Source:** `app/api/admin/social-links/route.js`  **Priority:** P1

The admin can create, list, update, and delete social links.

**Acceptance criteria:**
- [ ] `POST` creates a row
- [ ] `PATCH` updates by `id`
- [ ] `DELETE` deletes by `id`

**Related features:** FEAT-023

---

## REQ-020 — Education CRUD
**Status:** ACCEPTED  **Source:** `app/api/admin/education/route.js`  **Priority:** P1

The admin can manage education history.

**Related features:** FEAT-024

---

## REQ-021 — Experience CRUD
**Status:** ACCEPTED  **Source:** `app/api/admin/experience/route.js`  **Priority:** P1

The admin can manage work experience.

**Related features:** FEAT-025

---

## REQ-022 — Personal info CRUD
**Status:** ACCEPTED  **Source:** `app/api/admin/info/route.js`  **Priority:** P1

The admin can list, upsert, update, and delete `personal_info` rows.

**Related features:** FEAT-026

---

## REQ-023 — Resume upload + listing
**Status:** ACCEPTED  **Source:** `app/api/admin/upload/route.js`, `resumes/route.js`  **Priority:** P0

The admin can upload PDF resumes (max 5 MB) and list existing resumes.

**Acceptance criteria:**
- [ ] Only `application/pdf` accepted
- [ ] Stored in Supabase Storage `portfolio-resumes` bucket
- [ ] Newly uploaded resume is set `is_active = true`; trigger deactivates prior

**Related features:** FEAT-027

---

## REQ-024 — Cloudinary image upload
**Status:** ACCEPTED  **Source:** `app/api/admin/upload/route.js`  **Priority:** P1

The admin can upload images (JPEG/PNG/WebP/GIF/SVG, max 5 MB) to Cloudinary using the
`portfolio_uploads` unsigned upload preset.

**Related features:** FEAT-027

---

## REQ-025 — Audit log of admin writes
**Status:** ACCEPTED  **Source:** `sql/migrations/023_create_audit_log.sql`  **Priority:** P2

Admin write actions must be recorded in `audit_log` with old/new data, actor, IP, UA.

**Acceptance criteria:**
- [ ] `audit_log` table exists
- [ ] Indexes on `created_at`, `(resource_type, resource_id)`, `actor_email` exist
- [ ] Only admins (service role) can SELECT

**Related features:** FEAT-028

> Note: the table is created but **no application code currently writes to it**. See
> `bugs/known-issues.md` (BUG-001 — Proposed).

---

## REQ-026 — CSP reports
**Status:** ACCEPTED  **Source:** `app/api/csp-report/route.js`  **Priority:** P2

`POST /api/csp-report` must accept browser CSP violation reports and store them in
`csp_reports`.

**Acceptance criteria:**
- [ ] Returns 204 on success
- [ ] Filters noise: dev environment, browser extensions, and documents from other origins

**Related features:** FEAT-029

---

## REQ-027 — Public contact form
**Status:** ACCEPTED  **Source:** `app/(public)/contact/page.jsx` (Formspree)  **Priority:** P1

The public contact page must offer a way to reach the owner (Formspree).

**Acceptance criteria:**
- [ ] Form action submits to `formspree.io` (per CSP `form-action 'self' https://formspree.io`)
- [ ] Page is reachable without authentication

**Related features:** FEAT-030

---

## REQ-028 — Motion UI layer
**Status:** ACCEPTED  **Source:** `app/motion.css`, `components/ui/*`  **Priority:** P2

The site must use the in-house motion layer (Aurora background, SplitText, TiltCard, etc.)
to provide a polished feel.

**Acceptance criteria:**
- [ ] `/test-ui` page renders all primitives
- [ ] Motion is suppressed when `prefers-reduced-motion: reduce` or `<html class="no-motion">`

**Related features:** FEAT-031

---

## Open questions / unknown

- **REQ-025-EMIT** — `audit_log` is created but never written to. Either requirement is
  partially met, or the writer is missing. Status: `UNKNOWN / REQUIRES VALIDATION`.
