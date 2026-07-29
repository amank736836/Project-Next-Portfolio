# Portfolio Next

Personal portfolio and admin dashboard built with Next.js App Router, React 19, Supabase, and Scalekit authentication.

## Highlights

- **Public Portfolio Pages**: Home, About, Skills, Education, Experience, Portfolio, Contact
- **Protected Admin Surface**: Manage info, projects, skills, education, experience, settings
- **OAuth Login Flow**: Via Scalekit with refresh token rotation
- **Data Persistence**: Supabase (PostgreSQL) with Row Level Security
- **Media Upload**: Cloudinary integration for resume and hero images

---

## Features Implemented

### 🎨 Portfolio Display Modes
- **Multi-Page Mode** (default): Separate routes for each section (`/about`, `/skills`, `/projects`, etc.)
- **Single-Page Mode**: All sections rendered sequentially on `/` with anchor navigation
- **Toggle**: Admin Settings → Site Mode → switch between modes
- **Smooth Scroll**: CSS `scroll-behavior: smooth` + `scroll-margin-top` for fixed nav
- **Active Section Highlighting**: IntersectionObserver tracks viewport position in single-page mode

### ⚙️ Admin Settings & Feature Flags
Persisted in `user_settings` table, controlled via Admin UI:
| Setting | Key | Description |
|---------|-----|-------------|
| Scroll Reveal Animations | `enable_scroll_reveal` | Fade/slide-in on section enter |
| Typewriter Effect | `enable_typewriter` | Animated typing in hero description |
| Open to Work Badge | `enable_open_to_work` | "Open to Opportunities" badge in hero |

### 📊 API Logging & Monitoring
- **`api_logs` table**: Captures all admin API requests (method, path, status, duration, IP, error)
- **`withApiLogging` HOC**: Wraps route handlers for automatic logging
- **`useApiCall` hook**: Client-side wrapper with loading state
- **Global Loading Bar**: Thin progress bar during API calls (Admin layout)

### 🏷️ Hero Skill Badges
- **Source**: Skills marked `is_featured = true` (max 5)
- **Data**: `icon`, `color`, `category` from skills table
- **Display**: Animated badges below hero CTAs
- **Fallback**: 6 hardcoded tech badges if none featured

### 🖼️ Hero Image Management
- **Gallery**: Upload multiple images (JPEG/PNG/WebP, ≤5MB) via Cloudinary
- **Hero Selection**: One-click "Set as Hero" — auto-unsets previous
- **Alt Text Editing**: Inline edit per image
- **Delete**: Remove from gallery
- **Fallback**: `/assets/profile_v4.png` if no hero set

### 🗄️ SQL Migration System
```
sql/
├── tables/           # Base schema (personal_info, skills, projects, etc.)
├── migrations/       # Numbered migration files (001-011)
├── seeds/            # Initial data
├── functions/        # Postgres functions
└── indexes/          # Performance indexes
```

**Runner** (`scripts/src/commands/migrate.ts`):
- `npm run migrate:up` — apply pending
- `npm run migrate:down` — rollback last
- `npm run migrate:status` — show applied/pending
- `npm run migrate:seed` — run seed files
- `npm run migrate:generate` — create new migration + rollback pair
- **Checksum verification** via `_migrations` table
- **Dollar-quote aware SQL splitter** (handles `$$` blocks)
- **Auto-rollback generation** for each migration

### 🧩 Admin UI Refactors
| Component | Before | After | Split Into |
|-----------|--------|-------|------------|
| `SkillsManager` | 762 lines | 341 lines | `EditSkillForm`, `SkillCard`, `CategoryManager`, `CategoryFilter`, `EmptyStates` |
| `Dashboard` | 846 lines | 431 lines | `OperationLogs`, `ThemeController`, `StatCard`, `HUDHeader`, `ExternalStatusWidget`, `NeuralLinkWidget` |

### 🔧 Technical Improvements
- **Proxy middleware** (`proxy.js`) — replaces deprecated `middleware.js` convention
- **Navbar auth optimization** — `/api/auth/validate` only called on `/admin*` routes
- **Typewriter hydration fix** — server renders first text, client hydrates from same
- **Contact form `suppressHydrationWarning`** — prevents browser extension noise
- **Clamp() fluid typography** — all font sizes scale smoothly without media queries
- **Image quality config** — `qualities: [75, 80, 85]` in `next.config.mjs`
- **CSP headers** — configured for Scalekit, Cloudinary, Google Fonts

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Language | React 19, TypeScript (JS with JSDoc) |
| Database | Supabase (PostgreSQL) + `@supabase/ssr` |
| Auth | Scalekit OAuth 2.0 (`@scalekit-sdk/node`) |
| Storage | Cloudinary (images, resume PDF) |
| Styling | Tailwind CSS 4 + CSS Modules |
| Linting | ESLint (flat config) |

---

## Project Structure

```
portfolio-next/
├── app/
│   ├── (public)/           # Public route group
│   │   ├── layout.jsx      # PublicLayout (fetches site_mode, settings, featuredSkills, heroImage)
│   │   ├── page.js         # Home (null in single-page mode)
│   │   ├── about/, skills/, projects/, contact/, etc.
│   │   └── *.css           # Per-page CSS modules
│   ├── (admin)/            # Protected admin route group
│   │   ├── admin/
│   │   │   ├── dashboard/  # Refactored into Dashboard/* components
│   │   │   ├── settings/   # AdminSettingsClient + Hero Images section
│   │   │   ├── projects/, skills/, education/, experience/
│   │   │   └── layout.jsx  # AdminLayout (LoadingProvider)
│   │   └── api/admin/      # REST endpoints (CRUD + hero-images, api-logs, settings)
│   ├── api/auth/           # Scalekit OAuth flow (login, callback, logout, refresh, validate)
│   ├── globals.css         # CSS variables, clamp() typography, scroll-reveal animations
│   └── layout.js           # Root layout (fonts, providers)
├── components/
│   ├── sections/           # HomeSection, AboutSection, SkillsSection, ProjectsSection, ContactSection
│   ├── Navbar/             # IntersectionObserver for single-page active section
│   ├── ScrollHandler/      # Disabled in single-page mode
│   ├── ScrollReveal/       # IntersectionObserver client component
│   ├── SinglePageLayout.jsx# Server component rendering all sections
│   ├── Admin/
│   │   ├── Skills/         # Refactored skill management UI
│   │   ├── Dashboard/      # Refactored dashboard widgets
│   │   ├── Toast.jsx       # Toast notification system
│   │   ├── LoadingContext.jsx # Global loading bar provider
│   │   └── ui/             # Button, Input, Card, Typewriter
│   └── api/useApiCall.js   # Client-side API wrapper with logging
├── lib/
│   ├── auth.js             # getSession, refreshAccessToken, isAuthenticated
│   ├── cookies.js          # Session cookie helpers, isTokenExpired
│   ├── supabase/           # Server/client Supabase clients
│   ├── scalekit.js         # Scalekit client singleton
│   ├── api-client.ts       # withApiLogging HOC, apiClient
│   └── api-logger.js       # Request/response sanitization
├── scripts/
│   └── src/commands/       # Migration runner (migrate.ts, seed.ts, rollback.ts, etc.)
├── sql/
│   ├── tables/             # Base DDL
│   ├── migrations/         # 001_initial_schema ... 011_add_hero_images
│   ├── seeds/              # Initial data
│   ├── functions/          # Postgres functions
│   └── indexes/            # Performance indexes
├── proxy.js                # Next.js 16 proxy middleware
├── next.config.mjs         # Image qualities, CSP, rewrites
├── middleware.js           # (removed — replaced by proxy.js)
└── package.json
```

---

## Database Schema (Key Tables)

| Table | Purpose |
|-------|---------|
| `personal_info` | Key-value site metadata (site_mode, portfolio_layout, resume_url, social links) |
| `user_settings` | Feature toggles (enable_scroll_reveal, enable_typewriter, enable_open_to_work) |
| `skills` | `title`, `icon`, `color`, `category`, `percentage`, `is_featured` |
| `skill_categories` | `name`, `slug`, `icon`, `display_order` |
| `projects` | Portfolio items with tech stack, images, links, visibility |
| `education` / `experience` | Timeline entries with `is_hidden` |
| `hero_images` | Gallery with `url`, `alt_text`, `is_hero`, `display_order` |
| `api_logs` | Request/response audit trail with error capture |
| `_migrations` | Migration tracking (checksum, applied_at, rollback_sql) |

---

## Environment Variables

Create `.env.local` (not committed):

```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SERVICE_ROLE_KEY=your_service_role_key          # Server-only

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret           # Server-only

# Scalekit
SCALEKIT_ENVIRONMENT_URL=https://your-env.scalekit.dev
SCALEKIT_CLIENT_ID=your_client_id
SCALEKIT_CLIENT_SECRET=your_client_secret       # Server-only
SCALEKIT_SCOPES="openid profile email offline_access"

# Auth
AUTHORIZED_ADMIN_EMAIL=your@email.com
```

---

## Install & Run

```bash
npm install
npm run dev          # Development with Turbopack
npm run build        # Production build
npm run start        # Run production server
npm run lint         # ESLint check
```

Open `http://localhost:3000`

---

## Database Migration Commands

```bash
# Show status
npx tsx scripts/src/commands/migrate.ts status

# Apply all pending
npx tsx scripts/src/commands/migrate.ts up

# Rollback last migration
npx tsx scripts/src/commands/migrate.ts down

# Run seeds
npx tsx scripts/src/commands/migrate.ts seed

# Create new migration (prompts for name)
npx tsx scripts/src/commands/migrate.ts generate "add_new_feature"
```

**Migration file naming**: `NNN_descriptive_name.sql` in `sql/migrations/`

---

## Deployment (Vercel)

1. **Import repo** in Vercel
2. **Add all environment variables** (including server-only secrets)
3. **Configure Scalekit Redirect URI**:
   ```
   https://your-domain.vercel.app/api/auth/callback
   ```
4. **Deploy** — builds with `npm run build`, runs with `npm run start`

---

## Admin Workflow

### First Login
1. Visit `/admin` → redirects to Scalekit OAuth
2. Authorize with authorized email
3. Returns to `/admin/dashboard`

### Content Management
| Section | Admin Route | Notes |
|---------|-------------|-------|
| Personal Info | `/admin` | Name, email, phone, social links |
| Resume | `/admin` | Upload PDF → Cloudinary |
| Projects | `/admin/projects` | CRUD + tech stack + visibility |
| Skills | `/admin/skills` | Categories, icons, colors, featured (max 5) |
| Education | `/admin/education` | Timeline with hide toggle |
| Experience | `/admin/experience` | Timeline with hide toggle |

### Settings (`/admin/settings`)
- **Site Mode**: Multi-page ↔ Single-page
- **Portfolio Layout**: Masonry ↔ Fixed Ratio
- **UI Features**: Toggle scroll-reveal, typewriter, open-to-work badge
- **Hero Images**: Upload → Set as Hero → Edit Alt → Delete

---

## API Endpoints (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/admin/info` | Personal info key-value CRUD |
| GET/POST | `/api/admin/projects` | Projects CRUD |
| GET/POST | `/api/admin/skills` | Skills CRUD |
| GET/POST | `/api/admin/skill-categories` | Categories CRUD |
| GET/POST | `/api/admin/education` | Education CRUD |
| GET/POST | `/api/admin/experience` | Experience CRUD |
| GET/POST | `/api/admin/settings` | User settings (feature flags) |
| GET/POST | `/api/admin/hero-images` | Hero image gallery |
| PATCH/DELETE | `/api/admin/hero-images/[id]` | Update/delete single image |
| GET | `/api/admin/api-logs` | Paginated API logs |
| POST | `/api/admin/upload` | Cloudinary upload (resume) |

All admin endpoints:
- Protected by middleware (auth + authorized email)
- Rate-limited (60 req/min/IP)
- CSRF-validated (same-origin check)
- Logged to `api_logs` via `withApiLogging`

---

## Styling System

### CSS Variables (`app/globals.css`)
```css
:root {
  /* Fluid typography */
  --big-font-size: clamp(2.5rem, 8vw, 3.5rem);
  --h1-font-size: clamp(2rem, 6vw, 3rem);
  --h2-font-size: clamp(1.5rem, 4vw, 2.25rem);
  --h3-font-size: clamp(1.25rem, 3vw, 1.5rem);
  --large-font-size: clamp(1.125rem, 2vw, 1.25rem);
  --normal-font-size: clamp(1rem, 1.5vw, 1.125rem);
  --small-font-size: clamp(0.875rem, 1.25vw, 1rem);
  --smaller-font-size: clamp(0.8125rem, 1.1vw, 0.9375rem);
  --tiny-font-size: clamp(0.75rem, 1vw, 0.8125rem);

  /* Spacing, colors, shadows, radius — all tokenized */
}
```

### Scroll Reveal Animations
```css
.reveal { opacity: 0; }
.reveal.active { animation: fadeInUp 0.8s cubic-bezier(...) forwards; }
.delay-1 { animation-delay: 100ms; } /* ... up to delay-6 */
```
Controlled by `ScrollReveal` client component (IntersectionObserver).

---

## Authentication Flow

```
User visits /admin
       │
       ▼
Middleware (proxy.js) checks session cookie
       │
       ├─► No session / expired → Redirect to /api/auth/login
       │       │
       │       ▼
       │   Scalekit Authorization URL (offline_access scope)
       │       │
       │       ▼
       │   User authenticates → Scalekit redirects to /api/auth/callback
       │       │
       │       ▼
       │   Exchange code for tokens → Store in httpOnly cookie (scalekit_session)
       │       │
       │       ▼
       │   Redirect to original /admin (or /dashboard)
       │
       └─► Valid session + authorized email → Allow access
```

**Token Refresh**: Automatic via `refreshAccessToken()` in `lib/auth.js` when `expires_at` near.

---

## Contributing

1. **Branches**: `feature/*`, `fix/*`, `chore/*` from `main`
2. **Commits**: Conventional commits (`feat:`, `fix:`, `refactor:`)
3. **Before PR**:
   ```bash
   npm run lint
   npm run build
   ```
4. **Migrations**: Always generate via `migrate:generate` — includes rollback SQL

---

## License

MIT — free for personal and commercial use.

---

## Acknowledgments

- Next.js team for App Router
- Supabase for Postgres + Auth
- Scalekit for modern OAuth
- Cloudinary for media management
- React Icons for iconography