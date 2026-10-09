# Non-Functional Requirements

> Source of truth: `next.config.mjs`, `proxy.js`, `lib/`, `package.json`. Last updated: 2026-10-07.

---

## REQ-100 — Content-Security-Policy
**Status:** ACCEPTED  **Source:** `next.config.mjs`  **Priority:** P0

All responses must carry a Content-Security-Policy header.

**Acceptance criteria:**
- [ ] `default-src 'self'`
- [ ] `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://va.vercel-scripts.com https://vercel.live`
- [ ] `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
- [ ] `img-src 'self' data: https: blob:`
- [ ] `connect-src` includes Supabase, Cloudinary, Scalekit, Vercel, GitHub Status, Pusher
- [ ] `frame-ancestors 'self'`
- [ ] `form-action 'self' https://formspree.io`
- [ ] Reports go to `/api/csp-report`

**Related features:** FEAT-018

---

## REQ-101 — Other security headers
**Status:** ACCEPTED  **Source:** `next.config.mjs`  **Priority:** P0

**Acceptance criteria:**
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-Frame-Options: SAMEORIGIN`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`
- [ ] `Reporting-Endpoints: csp-endpoint="/api/csp-report"`

**Related features:** FEAT-018

---

## REQ-102 — Static asset caching
**Status:** ACCEPTED  **Source:** `next.config.mjs`  **Priority:** P2

`/assets/*` must be served with `Cache-Control: public, max-age=31536000, immutable`.

---

## REQ-103 — Auth cache control
**Status:** ACCEPTED  **Source:** `next.config.mjs`  **Priority:** P1

`/api/auth/*` responses must have `Cache-Control: private, no-store, max-age=0, must-revalidate`.

---

## REQ-104 — Admin API cache control
**Status:** ACCEPTED  **Source:** `app/api/admin/*/route.js`  **Priority:** P1

All admin route handlers must set `Cache-Control: no-store, private, must-revalidate` on
every response (success and error).

---

## REQ-105 — Image optimisation
**Status:** ACCEPTED  **Source:** `next.config.mjs`  **Priority:** P2

Next.js `<Image>` must optimise Cloudinary, Unsplash, and `via.placeholder.com` images,
producing AVIF/WebP where supported.

---

## REQ-106 — Reduced-motion support
**Status:** ACCEPTED  **Source:** `app/motion.css`  **Priority:** P1

All motion must be disabled when `prefers-reduced-motion: reduce` is set or when
`<html class="no-motion">` is present.

---

## REQ-107 — Open-source licensing
**Status:** ACCEPTED  **Source:** `README.md`  **Priority:** P3

The project is released under the MIT license.

---

## REQ-108 — Single admin email
**Status:** ACCEPTED  **Source:** `proxy.js`, `package.json`  **Priority:** P0

The system is designed for a single admin (the portfolio owner). No multi-user / RBAC is
implemented.

---

## REQ-109 — Performance budget (public reads)
**Status:** PROPOSED  **Source:** inferred from `revalidate = 60` and ISR  **Priority:** P2

Public read endpoints (`/api/projects`, `/api/info`, `/api/resume`) should respond in
< 500 ms with typical data (10-50 rows).

> No automated budget enforcement is currently in place. See
> `test-scenarios/performance.md`.

---

## REQ-110 — Offline preview mode
**Status:** ACCEPTED  **Source:** `lib/supabase/offline-client.js`  **Priority:** P2

When `NEXT_PUBLIC_SUPABASE_URL` is unset, the app must run against a seed dataset so UI
work does not require a database.

---

## REQ-111 — Observability via api_logs
**Status:** ACCEPTED  **Source:** `lib/api-logger.js`  **Priority:** P1

Every wrapped route handler must log to `api_logs` with endpoint, method, status,
duration, sanitized headers/body, and error information.

---

## REQ-112 — Audit trail
**Status:** PROPOSED  **Source:** `sql/migrations/023_create_audit_log.sql`  **Priority:** P2

Admin write actions should be recorded in `audit_log` with old/new data, actor, IP, UA.

> Currently no application writer. See REQ-025 / BUG-001 in `bugs/known-issues.md`.

---

## REQ-113 — Migrations are versioned and reversible
**Status:** ACCEPTED  **Source:** `scripts/src/commands/migrate.ts`  **Priority:** P0

Migrations under `sql/migrations/` are versioned, with optional `*.rollback.sql`,
checksum verification, and drift detection.

---

## REQ-114 — Secrets never exposed to the browser
**Status:** ACCEPTED  **Source:** `README.md`, `lib/supabase/server.js`  **Priority:** P0

`SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, and Scalekit secrets must never appear in
client bundles.

---

## REQ-115 — Session cookie hardening
**Status:** ACCEPTED  **Source:** `lib/cookies.js`  **Priority:** P0

`scalekit_session` and `oauth_state` must be:
- `httpOnly`
- `secure` in production
- `sameSite=lax`
- `path=/`

---

## REQ-116 — Powered-by header disabled
**Status:** ACCEPTED  **Source:** `next.config.mjs`  **Priority:** P3

`X-Powered-By` must not be sent.

---

## REQ-117 — Public error pages
**Status:** ACCEPTED  **Source:** `app/(public)/error`, `app/(public)/permission-denied`  **Priority:** P2

The site must expose styled error and permission-denied pages.

---

## REQ-118 — SEO basics
**Status:** ACCEPTED  **Source:** `app/robots.js`, `app/sitemap.js`  **Priority:** P2

`robots.txt` and `sitemap.xml` must be generated.

---
