# Portfolio Next

Personal portfolio and admin dashboard built with Next.js App Router, React 19, Supabase, and Scalekit authentication.

## Highlights

- **Public Portfolio Pages**: Home, About, Skills, Education, Experience, Portfolio, Contact
- **Protected Admin Surface**: Manage info, projects, skills, education, experience, settings
- **OAuth Login Flow**: Via Scalekit with refresh token rotation
- **Data Persistence**: Supabase (PostgreSQL) with Row Level Security
- **Media Upload**: Cloudinary SDK
- **Motion Layer**: Ambient gradients, kinetic typography, 3D tilt surfaces, self-drawing SVG rules and scroll progress — dependency-free (CSS + tiny hooks)

## Features

### 🎯 Portfolio Modes
- **Single-Page Mode**: All sections on one continuous page with smooth scroll navigation
- **Multi-Page Mode**: Traditional separate pages for each section
- Toggle via Admin → Settings → Site Mode

### 🏠 Hero Section
- Dynamic tech badges from **featured skills** (max 5, admin-configurable)
- "Open to Opportunities" badge (toggleable in Admin → Settings → UI Features)
- Three CTAs: Download Resume / View Projects / Hire Me
- Blinking cursor animation (replaces typewriter, toggleable)
- Hero image management with gallery support

### 🛠 Skills Section
- **Category Groups**: Frontend, Backend, Database, Cloud, Languages, General
- Each skill: icon, color, proficiency bar (hover to reveal)
- Admin: CRUD skills with emoji picker, color swatches, category assignment
- Featured skills (max 5) appear in hero badges

### 🖼 Portfolio/Projects
- Filter by category tabs
- **Live previews**: project cards embed the deployed site (lazy, sandboxed iframes) with a screenshot fallback
- Hover overlay: description, tech tags, Live/Code action buttons
- Modal with full details, Live Preview / Screenshot tabs, and 800×450 images
- Masonry or Fixed Ratio grid layout (admin toggle)

### 📧 Contact
- Formspree integration with subject dropdown
- Social links with scale+rotate+glow hover effects
- Email/Phone labels simplified

### ⚙️ Admin Dashboard
- **Hero Images**: Upload (Cloudinary), set as hero, edit alt text, delete, gallery view
- **UI Features Toggles**: Scroll Reveal, Typewriter Effect, Open to Work badge
- **Settings**: Social links, Resume upload, Portfolio layout, Site mode
- **Skills Manager**: Category filter, featured toggle, inline edit modal
- **Dashboard Widgets**: Stats, Operation Logs, Theme Controller, External Status, Neural Link

### 🎞 UI Motion Layer
- `app/motion.css` holds the whole animation system (tokens, keyframes, utility classes); every animation is disabled by `prefers-reduced-motion` and by `<html class="no-motion">`
- **Ambient background** — drifting gradient orbs, panning grid, film grain, pointer spotlight (`components/ui/AuroraBackground.jsx`)
- **Kinetic typography** — per-character rise/flip with a gradient sweep (`SplitText`), gradient shimmer text
- **Self-drawing lines** — section headings animate an SVG rule into view (`SectionHeading`)
- **Scroll feedback** — top progress rail (`ScrollProgress`), reveal variants (`reveal-blur/mask/flip/zoom/stagger`), parallax hero (`Parallax`), scrollytelling reveal engine in `components/ScrollReveal.jsx`
- **Hover surfaces** — 3D tilt + pointer glare (`TiltCard`), animated conic borders, card sheen sweeps, tech-tag pop-in
- **Microinteractions** — magnetic buttons (`Magnetic`), count-up stats (`CountUp`), icon tada, animated skill bars, timeline draw-in
- **Route transitions** — circular curtain wipe + progress run (`PageTransition`) and a morphing loader (`TransitionLoader`)
- **Loading skeletons** — travelling shimmer over every skeleton block
- **Playground** — visit `/test-ui` to see every effect in one page

### 📊 API & Logging
- `withApiLogging` HOC wraps API routes → auto-logs to `api_logs` table
- `useApiCall` hook for client-side calls with loading state
- Global `LoadingProvider` with thin progress bar

### 🔄 Migration System
- SQL files in `sql/` (tables, indexes, migrations, seeds, functions)
- TypeScript runner: `npm run migrate:up|down|status|seed|watch`
- Checksum verification, auto-rollback generation, drift detection

## Tech Stack

- Next.js 16.2.6 (App Router, Turbopack)
- React 19
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Scalekit SDK (`@scalekit-sdk/node`)
- Tailwind CSS 4 + custom CSS modules
- Cloudinary SDK

## Project Structure

```
app/                    # Routes, pages, layouts, API handlers
├── (public)/           # Public route group (portfolio pages)
├── (admin)/            # Protected admin route group
│   └── admin/
│       ├── dashboard/  # Admin dashboard with widgets
│       └── settings/   # Admin settings (hero images, UI toggles, etc.)
├── api/                # API route handlers
│   └── admin/          # Admin API (skills, hero-images, settings, etc.)
components/
├── Admin/              # Admin-specific components
│   ├── Dashboard/      # Dashboard widgets
│   └── Skills/         # Skills manager sub-components
├── Navbar/             # Navigation with IntersectionObserver (single-page)
├── sections/           # Portfolio section components
├── ui/                 # Reusable UI primitives (Button, Input, Typewriter)
│                       # + motion primitives: AuroraBackground, ScrollProgress,
│                       #   CursorGlow, PageTransition, SplitText, TiltCard,
│                       #   Magnetic, Marquee, CountUp, SectionHeading, Parallax
lib/                    # Auth, cookies, Supabase clients, API logger
scripts/                # Migration runner, seed scripts
sql/
├── migrations/         # Numbered migration files (001-011)
├── tables/             # Base table definitions
├── seeds/              # Seed data
supabase/               # Legacy schema files
```

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase project
- Scalekit tenant/application
- Cloudinary account (for image upload in admin)

## Environment Variables

Create `.env` in project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SERVICE_ROLE_KEY=your_supabase_service_role_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Scalekit (OAuth)
SCALEKIT_ENVIRONMENT_URL=https://your-tenant.scalekit.dev
SCALEKIT_CLIENT_ID=your_client_id
SCALEKIT_CLIENT_SECRET=your_client_secret
SCALEKIT_SCOPES="openid profile email offline_access"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTHORIZED_ADMIN_EMAIL=your@email.com
```

**Security**: Keep secrets server-side only. Never expose `SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, or Scalekit secrets to the browser.

## Install & Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Running without Supabase (offline preview)

`npm run dev` fails fast without Supabase credentials (`supabaseUrl is required`). For UI work you
can run the app against an in-memory dataset instead — when `NEXT_PUBLIC_SUPABASE_URL` is unset,
`lib/supabase/server.js` and `lib/supabase/client.js` fall back to
`lib/supabase/offline-client.js`, a query-builder stand-in backed by
`lib/supabase/offline-data.js` (seed-shaped content, local images from `public/assets`).

```bash
npx next dev --webpack -p 3000   # or: npm run dev (needs a reachable database)
```

Note: the offline layer is development-only convenience — as soon as the env vars (or a production
build) are present, the real Supabase client is used.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run dev:turbo` | Start dev with Turbopack |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run migrate:up` | Apply pending migrations |
| `npm run migrate:down` | Rollback last migration |
| `npm run migrate:status` | Show migration status |
| `npm run migrate:seed` | Run seed files |
| `npm run migrate:watch` | Watch mode for migrations |

## Database Setup

1. Apply base schema: `supabase/schema.sql` (or run migrations)
2. Apply migrations in order:
   ```bash
   npm run migrate:up
   ```
3. Seed data (optional):
   ```bash
   npm run migrate:seed
   ```

**Migrations** (in `sql/migrations/`):
| File | Description |
|------|-------------|
| 001_initial_schema | Base tables |
| 002_add_is_hidden | Hidden flags for content |
| 003_add_project_fields | Project enhancements |
| 004_add_site_mode | Single/multi-page toggle |
| 005_add_user_settings | Feature toggles table |
| 006_add_api_logs | API request logging |
| 007_add_skill_category_featured | Skill category + featured |
| 008_add_skill_icon_color | Skill icon/color columns |
| 009_create_skill_categories | Skill categories table |
| 010_add_open_to_work_setting | Open to Work toggle |
| 011_add_hero_images | Hero image gallery table |

## Auth & Route Protection

- Auth routes: `app/api/auth/*` (login, callback, logout, refresh, validate)
- `proxy.js` (replaces deprecated middleware) enforces:
  - Admin pages (`/admin/*`) → require auth + authorized email
  - Admin APIs (`/api/admin/*`) → require auth + CSRF protection
  - Public APIs (`/api/auth/*`) → no auth
  - Rate limiting (in-memory, use Upstash Redis for production)

## Deployment

1. Configure all environment variables in hosting provider
2. Build & start:
   ```bash
   npm run build
   npm run start
   ```
3. Scalekit redirect URI must match:
   - `https://your-domain/api/auth/callback`
4. Ensure Cloudinary upload preset `portfolio_uploads` exists (unsigned)

## Fluid Typography

All font sizes use CSS `clamp()` for smooth scaling without media queries:

```css
--big-font-size: clamp(2.5rem, 8vw, 3.5rem);
--h1-font-size: clamp(2rem, 6vw, 3rem);
--h2-font-size: clamp(1.5rem, 4vw, 2.25rem);
--h3-font-size: clamp(1.25rem, 3vw, 1.5rem);
--large-font-size: clamp(1.125rem, 2vw, 1.25rem);
--normal-font-size: clamp(1rem, 1.5vw, 1.125rem);
--small-font-size: clamp(0.875rem, 1.25vw, 1rem);
--smaller-font-size: clamp(0.8125rem, 1.1vw, 0.9375rem);
--tiny-font-size: clamp(0.75rem, 1vw, 0.8125rem);
```

## Notes for Contributors

- Next.js 16.x — validate config/API usage against `node_modules/next/dist/docs/`
- Client components marked with `"use client"` at top
- Server components default; use `createAdminClient()` for Supabase admin operations
- CSS modules per section (`Home.css`, `About.css`, etc.) + `globals.css` for tokens
- Admin components split into focused sub-components (see `components/Admin/`)

## License

MIT