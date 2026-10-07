# Test tool setup

This page is a checklist for setting up the test environment from a clean clone.

## 1. Clone and install

```bash
git clone <repo-url> portfolio-next
cd portfolio-next
npm install
```

> `npm install` is the project root. The migration runner has its own `package.json`
> under `scripts/`. To install those deps, run `npm install` inside `scripts/`.

## 2. Configure environment (offline mode)

For the public smoke script, you do **not** need any secrets. Just unset Supabase:

```bash
unset NEXT_PUBLIC_SUPABASE_URL
unset NEXT_PUBLIC_SUPABASE_ANON_KEY
unset SERVICE_ROLE_KEY
```

## 3. Configure environment (online mode)

Create a `.env` at the project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon>
SERVICE_ROLE_KEY=<service-role>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloud>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>

# Scalekit
SCALEKIT_ENVIRONMENT_URL=https://<tenant>.scalekit.dev
SCALEKIT_CLIENT_ID=<id>
SCALEKIT_CLIENT_SECRET=<secret>
SCALEKIT_SCOPES="openid profile email offline_access"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTHORIZED_ADMIN_EMAIL=<your-email>

# Optional
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

> Never commit this file. `.gitignore` already excludes `.env*`.

## 4. Database setup (online only)

```bash
npm run db:status
npm run db:migrate
npm run db:seed
```

## 5. Run the dev server

```bash
npm run dev     # or npm run dev:turbo
```

The server is available at `http://localhost:3000`.

## 6. Run the smoke script

```bash
# from the project root, in a separate terminal:
node harness/automation/scripts/smoke-public.mjs
```

The script exits 0 on success, non-zero on failure, and writes a JSON summary
to `test-results/latest/`.
