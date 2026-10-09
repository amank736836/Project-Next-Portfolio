# Project Overview — Portfolio Next

> Source of truth: `README.md`, `package.json`, `next.config.mjs`, `proxy.js`, `app/`, `lib/`,
> `sql/`. Last updated: 2026-10-07.

## 1. Purpose

A **personal portfolio and admin dashboard** for a single user (the portfolio owner). It serves two
audiences simultaneously:

- **Public visitors** — recruiters, clients, collaborators — see a polished single- or multi-page
  portfolio with bio, skills, projects, education, experience, and a contact form.
- **The owner (admin)** — manages every piece of content, settings, theme, social links, hero
  images, resumes, and the site mode through a protected admin surface.

It is **not** a multi-tenant SaaS. There is exactly one authorised admin email (env-driven).

## 2. Main users

| Role                | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| Public visitor      | Anonymous user browsing the portfolio. Can submit the contact form.         |
| Recruiter / client  | Same surface as visitor; primarily consumes information, downloads resume.  |
| Admin (the owner)   | Single authorised user (gated by `AUTHORIZED_ADMIN_EMAIL`) who can CRUD all content. |
| Scalekit (OAuth)    | External identity provider used by the admin.                                |
| Supabase (Postgres) | Database + storage backend.                                                  |
| Cloudinary          | Media (image) hosting.                                                        |

## 3. Main workflows

1. **Public browsing** — visitor opens `/` (multi-page mode) or scrolls a one-page layout
   (single-page mode) and reads about the owner.
2. **Project discovery** — visitor navigates to `/projects` (or the in-page section) and opens
   the project modal.
3. **Contact** — visitor submits the contact form (Formspree integration in the public site).
4. **Resume download** — visitor downloads the active resume via `/api/resume/view` or
   `/api/resume/download`.
5. **Admin login** — owner navigates to `/login` → Scalekit OAuth → callback → session cookie.
6. **Admin content management** — owner manages skills, projects, hero images, education,
   experience, personal info, social links, settings, and resumes from `/admin/*`.
7. **Admin observability** — owner reads CSP reports, API logs, and audit logs from the admin.

## 4. Technology stack

| Layer        | Technology                                                                                  |
|--------------|---------------------------------------------------------------------------------------------|
| Framework    | Next.js 16.2.6 (App Router)                                                                 |
| Language     | JavaScript (`.js`, `.jsx`) and TypeScript (`.ts`, `.tsx`) — both used                       |
| UI runtime   | React 19.2.4                                                                                |
| Bundler      | Next.js default; project also exposes `next dev --webpack` and `--turbopack`                 |
| Styling      | Tailwind CSS 4 + custom CSS modules (`Home.css`, `About.css`, `motion.css`, `globals.css`)  |
| Auth         | Scalekit OAuth 2.0 / OIDC (`@scalekit-sdk/node`)                                            |
| Database     | Supabase (PostgreSQL) with RLS enabled on most tables                                      |
| Storage      | Supabase Storage (resumes bucket `portfolio-resumes`) + Cloudinary (images)                 |
| Email forms  | Formspree (public contact form)                                                             |
| Migrations   | In-house TypeScript runner in `scripts/src/commands/`                                       |
| Icons        | `react-icons`                                                                               |
| Animation    | Custom CSS + `tailwindcss-animate` + a library of `components/ui/*` motion primitives      |
| Lint         | ESLint 9 (`eslint-config-next`)                                                             |
| TypeScript   | `5.9.3`                                                                                     |

## 5. Frontend

### Pages / route groups

- **Public (`app/(public)/`)**
  - `/` — home (multi-page) or hosts `SinglePageLayout` (single-page)
  - `/about`, `/skills`, `/education`, `/experience`, `/projects`, `/contact`, `/resume`
  - `/login` — kicks the OAuth flow off
  - `/permission-denied` — shown when a non-authorised email logs in
  - `/test-ui` — UI motion playground (no auth)
  - `/error`, `/loading` — Next.js conventions
- **Admin (`app/(admin)/admin/`)**
  - `/admin` — landing redirect to dashboard
  - `/admin/dashboard`, `/admin/identity`, `/admin/showcase`, `/admin/academy`,
    `/admin/matrix`, `/admin/logbook`, `/admin/csp-reports`, `/admin/settings`

### Key UI primitives (`components/ui/`)

`AuroraBackground`, `Avatar`, `Badge`, `Button`, `Card`, `CountUp`, `CursorGlow`,
`HeroPortrait3D`, `Input`, `Magnetic`, `Marquee`, `Modal`, `PageTransition`, `Parallax`,
`ScrollProgress`, `SectionHeading`, `SplitText`, `TiltCard`, `Typewriter`.

### State / data hooks

- `components/api/useApiCall.js` — generic API caller with loading state
- `components/hooks/useActiveResume.ts` — fetches active resume
- `hooks/useKeyboardShortcuts.js` — global keyboard shortcuts

## 6. Backend

The backend is entirely composed of **Next.js Route Handlers** under `app/api/`. There is no
separate Node/Express service.

### Public APIs

| Method | Path                          | Purpose                                                |
|--------|-------------------------------|--------------------------------------------------------|
| GET    | `/api/projects`               | Public list of *verified* projects                     |
| GET    | `/api/info`                   | Public personal_info key/value list                    |
| GET    | `/api/resume`                 | Active resume metadata (JSON)                          |
| GET    | `/api/resume/view`            | Streams the active resume PDF                          |
| GET    | `/api/resume/download`        | Forces download of active resume PDF                   |
| GET    | `/api/csp-report`             | Receives browser CSP violation reports                 |

### Auth APIs (`/api/auth/*`)

| Method | Path                          | Purpose                                                |
|--------|-------------------------------|--------------------------------------------------------|
| GET    | `/api/auth/login`             | Generates `state`, redirects to Scalekit authorize URL |
| GET    | `/api/auth/callback`          | Handles Scalekit redirect; sets session cookie         |
| POST   | `/api/auth/refresh`           | Refreshes access token using refresh token             |
| GET    | `/api/auth/validate`          | Reports `authenticated: boolean` and (if so) user     |
| GET    | `/api/auth/logout`            | Clears session, redirects to Scalekit RP-initiated logout |
| GET    | `/api/auth/retry`             | Clears session and forces re-login                     |

### Admin APIs (`/api/admin/*`) — require authenticated session + authorised email

| Method(s)              | Path                                | Purpose                                |
|------------------------|-------------------------------------|----------------------------------------|
| GET/POST/PUT/PATCH/DEL | `/api/admin/info`                   | Personal info CRUD                     |
| GET/POST/PUT/DEL       | `/api/admin/projects`               | Projects CRUD                          |
| GET/POST/PUT/PATCH/DEL | `/api/admin/skills`                 | Skills CRUD                            |
| GET/POST/PUT/DEL       | `/api/admin/skill-categories`       | Skill categories CRUD                  |
| GET/POST               | `/api/admin/hero-images`            | Hero image upload / list               |
| PATCH/DEL              | `/api/admin/hero-images/[id]`       | Hero image update / delete             |
| GET/POST/PUT/DELETE    | `/api/admin/education`              | Education entries CRUD                 |
| GET/POST/PUT/DELETE    | `/api/admin/experience`             | Experience entries CRUD                |
| GET/POST               | `/api/admin/resumes`                | Resume list / register                 |
| POST                   | `/api/admin/upload`                 | Image → Cloudinary or PDF → Supabase Storage |
| GET/POST/PUT/DELETE    | `/api/admin/settings`               | `user_settings` key/value CRUD         |
| GET/POST               | `/api/admin/social-links`           | Social links list / create             |
| PATCH/DEL              | `/api/admin/social-links/[id]`      | Social link update / delete            |
| GET                    | `/api/admin/api-logs`               | API log read                           |
| GET                    | `/api/admin/csp-reports`            | CSP report read                        |

### Cross-cutting middleware

`proxy.js` (Next.js's preferred name for what older versions called `middleware.js`) enforces:

- **Path protection**
  - `/admin/*` and `/dashboard` require an authenticated session
  - `/api/admin/*` requires an authenticated session
- **Authorization**
  - Session user's `email` must equal `AUTHORIZED_ADMIN_EMAIL`
- **CSRF protection**
  - All mutating methods (`POST/PUT/PATCH/DELETE`) on `/api/admin`, `/api/auth/logout`,
    `/api/auth/refresh` require a same-origin request
- **Rate limiting**
  - In-memory, per-IP+path+method, 60 req/min default
  - Skipped if `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set (Redis fallback)
- **Match rule** — applies to everything except `_next`, `favicon.ico`, and common static files

## 7. Database

PostgreSQL via Supabase, schema migrations versioned in `sql/migrations/` (001-026) plus
`sql/tables/` for the original table definitions.

### Tables

| Table             | Purpose                                            | Notable columns                                     |
|-------------------|----------------------------------------------------|-----------------------------------------------------|
| `personal_info`   | KV store for bio, address, social handles, etc.   | `key` (PK), `title`, `description`, `is_hidden`     |
| `skills`          | Tech skills                                        | `title`, `percentage`, `category`, `icon`, `color`, `is_featured`, `is_hidden` |
| `projects`        | Portfolio projects                                 | `title`, `image`, `img` (legacy), `description`, `details` (JSONB), `is_hidden` |
| `education`       | Education history                                  | `year`, `title`, `description`, `is_hidden`         |
| `experience`      | Work experience                                    | `year`, `title`, `description`, `is_hidden`         |
| `user_settings`   | Feature toggles and KV settings                    | `key` (PK), `type` (boolean/string/number/json)    |
| `api_logs`        | Per-request log from `withApiLogging`              | `endpoint`, `method`, `status_code`, `duration_ms`, sanitized headers/body |
| `csp_reports`     | Browser CSP violations                             | `report` (JSONB), `user_agent`, `created_at`       |
| `social_links`    | Dynamic social link list (replaces personal_info handles) | `platform`, `url`, `display_order`, `is_hidden` |
| `resumes`         | Resume metadata + storage URLs                     | `title`, `file_url`, `file_name`, `is_active`, `is_favorite` |
| `skill_categories`| Categories for skills                              | `name`, `slug`, `display_order`                    |
| `hero_images`     | Cloudinary URLs for the hero section               | `url`, `alt_text`, `is_hero` (only one allowed), `display_order` |
| `audit_log`       | Admin write log                                    | `action`, `resource_type`, `resource_id`, `old_data`, `new_data`, `actor_email` |

### RLS posture

RLS is enabled on `api_logs`, `csp_reports`, `user_settings`, `social_links`, `hero_images`,
`skill_categories`, `personal_info`, `education`, `experience`, `projects`, `skills`, `audit_log`
and `resumes`. Service-role is granted write; public-read or admin-only-read is configured per
table.

### Migrations & seeds

- `npm run db:migrate` — apply pending (`scripts/src/commands/migrate.ts`)
- `npm run db:status` — show applied vs pending
- `npm run db:rollback` — roll back last
- `npm run db:seed` — apply `sql/seeds/*.sql` in order
- `npm run db:generate` — auto-generate migration from diff

Checksum tracking is stored in `sql/_metadata/file_hashes.json`.

## 8. External services

- **Scalekit** — OAuth/OIDC identity provider. Scopes default to `openid profile email offline_access`.
- **Supabase** — managed Postgres + Storage.
- **Cloudinary** — image hosting. The admin uses an **unsigned upload preset** `portfolio_uploads`.
- **Formspree** — public contact form delivery.
- **Vercel** — suggested hosting (uses `@vercel/analytics`, `va.vercel-scripts.com` is in CSP).
- **Upstash Redis** — *optional* rate-limiter backing for production (`proxy.js`).

## 9. Authentication

- **Provider:** Scalekit (`@scalekit-sdk/node`).
- **Flow:** Authorization Code with `state` for CSRF + `offline_access` for refresh tokens.
- **Storage:** Session JSON in `httpOnly`, `secure` (prod), `sameSite=lax`, 30-day cookie
  named `scalekit_session` (see `lib/cookies.js`).
- **Refresh:** `lib/auth.js#refreshAccessToken` calls Scalekit's token endpoint and updates
  the cookie. Refresh fires 5 seconds before expiry (`isTokenExpired`).
- **Logout:** `app/api/auth/logout` issues RP-initiated logout to Scalekit and clears the cookie.
- **API gate:** `lib/auth.js#isAuthenticated()` returns the boolean used by every admin route.

## 10. Authorization

- **Single-user model.** The only check is `session.user.email === AUTHORIZED_ADMIN_EMAIL`.
- Mismatch yields:
  - On `/api/admin/*` → `403 Forbidden: Unauthorized Email`
  - On `/admin/*` or `/dashboard` → redirect to `/?error=unauthorized_email`
- There is no per-role / per-permission enforcement in the running code beyond this check
  (`lib/auth.js#hasPermission` is wired but no code path uses it).

## 11. APIs (summary)

See section 6. Every API that is not under `/api/auth/*` and is not explicitly public
(`/api/projects`, `/api/info`, `/api/resume*`, `/api/csp-report`) is admin-only.

## 12. Important modules

| Path                                     | Responsibility                                                                                  |
|------------------------------------------|--------------------------------------------------------------------------------------------------|
| `app/(public)/layout.jsx`                | Public layout: site mode, theme, social links, featured skills, settings flags                  |
| `app/(admin)/admin/layout.jsx`           | Admin shell: sidebar, toast/loading/confirm providers, session uptime                            |
| `proxy.js`                               | Edge proxy: rate limit, CSRF, auth/authorization                                                  |
| `lib/auth.js`                            | Session, refresh, `isAuthenticated`                                                             |
| `lib/cookies.js`                         | Cookie helpers + `isTokenExpired`                                                               |
| `lib/scalekit.js`                        | Singleton Scalekit client (env-aware)                                                            |
| `lib/cloudinary.js`                      | Cloudinary v2 SDK config                                                                          |
| `lib/supabase/server.js`                 | Supabase clients (anon/server) + offline fallback                                                |
| `lib/supabase/offline-client.js`         | Query-builder stand-in for offline mode                                                          |
| `lib/api-logger.js`                      | `withApiLogging` HOC + sanitisation                                                              |
| `scripts/src/commands/migrate.ts`       | Migration runner with checksum verification and auto-rollback                                    |
| `next.config.mjs`                        | Security headers (CSP, XCTO, XFO, Referrer-Policy, Permissions-Policy), image remote patterns, ISR |

## 13. Important business logic

1. **Public project visibility filter** (`app/api/projects/route.js`): a project is shown only
   if `title`, `image` (and not `/assets/default.png` / `placeholder`), and a `details` array
   containing a GitHub URL, a preview URL, and a language entry are all present. Otherwise
   it's filtered out (private / draft).
2. **Single hero image invariant** — `sql/migrations/011_add_hero_images.sql` triggers
   `enforce_single_hero_image` so only one row in `hero_images` can have `is_hero = true`.
3. **Resume activation** — uploading a resume sets `is_active = true`; a trigger (in
   migration 012) deactivates the previously active row.
4. **Site mode** — `personal_info.key = 'site_mode'` is read by `(public)/layout.jsx` and
   the home page. `'single'` triggers `SinglePageLayout`; `'multi'` uses the
   per-page structure.
5. **Featured skills** — at most 5 skills have `is_featured = true` (enforced by application
   logic; see Admin SkillsManager).
6. **Open redirect protection** in `/api/auth/login` — the `?next=` param is restricted to
   same-origin relative paths.

## 14. Deployment architecture

- Single Next.js app, no separate services.
- Hosting assumption: **Vercel** (`@vercel/analytics` is bundled; CSP allows
  `va.vercel-scripts.com`).
- Build: `npm run build` → `npm run start`.
- Migration step runs before the app starts in CI via `npm run db:prepare` (called by `dev`).
- Required services at runtime: Supabase, Cloudinary, Scalekit, optional Upstash Redis.

## 15. Environments

| Environment  | URL (assumed)         | Notes                                                   |
|--------------|-----------------------|---------------------------------------------------------|
| Local dev    | `http://localhost:3000` | Uses `next dev`; supports offline mode if env unset    |
| Preview      | Vercel preview URL    | Auto-deployed on PRs                                    |
| Production   | `https://amank.co.in` | `NEXT_PUBLIC_APP_URL` and CSP pinned to this origin    |

## 16. Known dependencies (from `package.json`)

- Runtime: `@radix-ui/react-dialog`, `@scalekit-sdk/node`, `@supabase/ssr`,
  `@supabase/supabase-js`, `@vercel/analytics`, `class-variance-authority`, `cloudinary`,
  `clsx`, `date-fns`, `html-react-parser`, `isomorphic-dompurify`, `jose`, `lucide-react`,
  `next`, `pdfjs-dist`, `react`, `react-dom`, `react-icons`, `tailwind-merge`,
  `tailwindcss-animate`, `typewriter-effect`.
- Dev: `@tailwindcss/postcss`, `@types/node`, `@types/react`, `autoprefixer`, `cross-env`,
  `dotenv`, `eslint`, `eslint-config-next`, `postcss`, `tailwindcss`, `tsx`, `typescript`.
- Migration subsystem (`scripts/package.json`): `@supabase/supabase-js`, `@types/pg`,
  `dotenv`, `pg`.

## 17. What's *not* here (deliberate non-goals)

- No CI pipeline YAML in the repo (deployment relies on host defaults).
- No automated test framework is configured (no Jest, Playwright, Vitest, etc.).
- No code-coverage tool.
- No security scanning tool.
- No monitoring / APM beyond `api_logs` and `csp_reports`.

> These are documented gaps; see `reports/coverage.md` and `TESTING_STATUS.md`.
