# Portfolio Next

Personal portfolio and admin dashboard built with Next.js App Router, React 19, Supabase, and Scalekit authentication.

## Highlights

- Public portfolio pages: home, about, skills, education, experience, portfolio, contact.
- Protected admin surface for managing info, projects, skills, education, and experience.
- OAuth login flow via Scalekit.
- Data persistence in Supabase.
- Media upload support through Cloudinary.

## Tech Stack

- Next.js 16.2.4 (App Router)
- React 19.2.4
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Scalekit SDK (`@scalekit-sdk/node`)
- Tailwind CSS 4 + custom CSS modules/files
- Cloudinary SDK

## Project Structure

- `app/`: routes, pages, layouts, API route handlers
- `components/`: reusable UI and admin components
- `lib/`: auth, cookies, database clients, utilities, cloudinary/scalekit helpers
- `supabase/`: SQL schema and migrations
- `scripts/`: one-off database seed/restore scripts

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase project
- Scalekit tenant/application
- Cloudinary account (for image upload in admin)

## Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SERVICE_ROLE_KEY=your_supabase_service_role_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SCALEKIT_ENVIRONMENT_URL=your_scalekit_environment_url
SCALEKIT_CLIENT_ID=your_scalekit_client_id
SCALEKIT_CLIENT_SECRET=your_scalekit_client_secret
SCALEKIT_SCOPES="openid profile email offline_access"
```

Notes:

- Keep secrets server-side only. Do not expose `SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, or Scalekit secrets to the browser.
- For production, set `NEXT_PUBLIC_APP_URL` to your deployed domain.

## Install and Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev`: start development server
- `npm run dev:turbo`: start development server with Turbopack
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: run ESLint

## Database Setup

1. Apply base schema in `supabase/schema.sql`.
2. Apply migrations in `supabase/migrations/` in filename order.
3. Optionally seed data with scripts in `scripts/`.

## Auth and Route Protection

- Auth routes live in `app/api/auth/*`.
- Middleware enforces auth for admin/dashboard and admin API paths.
- Unauthorized API access returns `401`; protected page access redirects to login.

## Deployment

1. Configure all environment variables in your hosting provider.
2. Build and start:

```bash
npm run build
npm run start
```

3. Ensure Scalekit redirect URI matches:

- `https://your-domain/api/auth/callback`

## Notes for Contributors

- Next.js version in this repo is 16.x. Validate config or API usage against local docs in `node_modules/next/dist/docs/` before introducing framework-level changes.
