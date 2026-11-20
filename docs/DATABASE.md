# Database, admin dashboard and inbox

The database is **optional**. Without it:

- Content comes from `src/content/*.ts`.
- Contact-form messages are emailed (if Resend is configured) or logged to the server console.
- `/admin` shows a "Setup required" screen.

With a PostgreSQL database you get:

- `/admin`: create, edit and delete **missions**, **skills** and **news posts** without redeploying.
- **Inbox**: every contact-form message is stored, with read/unread state and a reply link.

## How it works

```text
page request ──► src/lib/data.ts ──► DATABASE_URL set?
                                     ├── no  → src/content/*.ts
                                     └── yes → PostgreSQL (Prisma)
                                                └── empty or unreachable → src/content/*.ts
```

Pages are statically generated and revalidate every 60 seconds. Saving in the admin purges the cache immediately.

---

## 1. Get a PostgreSQL database

Pick one. All of them have free tiers.

### Option A: Supabase

1. Create a project at https://supabase.com.
2. Click **Connect** (top bar) → **ORMs** → **Prisma**, or go to **Project Settings → Database → Connection string**.
3. Copy the **Session pooler** URL (port `5432`). It works for both `db push` and the running app:
   ```
   postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres
   ```
   > If you prefer the **Transaction pooler** (port `6543`) for serverless, append `?pgbouncer=true&connection_limit=1`, and run `db:push` with the session URL.

### Option B: Neon

1. Create a project at https://neon.tech.
2. Copy the connection string from the dashboard (it ends in `?sslmode=require`).

### Option C: Vercel Postgres / Railway / Render

Copy the `postgresql://…` URL they give you.

### Option D: Local Docker

```bash
docker compose up -d
```

```
DATABASE_URL="postgresql://vice:vice@localhost:5432/vice_dev"
```

## 2. Configure `.env`

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://…"
ADMIN_PASSWORD="a-long-password-you-will-type"
AUTH_SECRET="paste-64-random-hex-chars-here"
```

Generate `AUTH_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 3. Create the tables and seed them

```bash
npm run db:setup
```

This runs `prisma db push` (creates the `Project`, `Skill`, `Post` and `Message` tables) and then `prisma/seed.ts`, which copies `src/content/*` into the database. Re-running the seed is safe: projects and posts are upserted by slug, and skills are replaced.

## 4. Log in

Restart `npm run dev`, open http://localhost:3000/admin and enter your `ADMIN_PASSWORD`.

---

## Admin security notes

- The session is an HMAC-signed, HttpOnly, SameSite=Lax cookie that lasts 12 hours. Changing `AUTH_SECRET` logs everyone out.
- Login attempts are rate-limited (8 per 15 minutes per IP, per server instance).
- There is a single admin password. For a multi-user setup, swap `src/lib/auth.ts` for Auth.js or Clerk.
- `/admin` and `/api/` are excluded from search engines in `robots.ts`.

## Changing the schema

1. Edit `prisma/schema.prisma`.
2. Run `npm run db:push`.
3. Update `src/lib/types.ts`, `src/lib/validation.ts` (zod schema) and `src/lib/admin-resources.ts` (admin form fields).

> This template uses `prisma db push` for simplicity. For a team or production workflow with migration history, switch to `npx prisma migrate dev --name init` and commit the `prisma/migrations` folder.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Environment variable not found: DATABASE_URL` when running `db:*` | Create `.env` in the project root (not only `.env.local`; the Prisma CLI reads `.env`). |
| Site shows static content even with a DB | The tables are probably empty. Run `npm run db:seed`. Check the server logs for `[vice.dev] Could not load …`. |
| `prepared statement "s0" already exists` | You're on a transaction pooler. Add `?pgbouncer=true` to the URL. |
| `/admin` still says "Setup required" | Restart the dev server after editing `.env`. All three vars must be set. |
| Too many connections on serverless | Use your provider's pooled URL, plus `connection_limit=1` for Supabase's transaction pooler. |
