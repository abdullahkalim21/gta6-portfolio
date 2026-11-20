# Deployment

## Vercel (recommended)

1. Push your fork to GitHub.
2. Go to https://vercel.com/new and import the repository. The framework preset is detected automatically.
3. Add environment variables (**Settings → Environment Variables**). All are optional:

   | Variable | Example |
   |---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://alexrivera.dev` |
   | `DATABASE_URL` | `postgresql://…` (see [DATABASE.md](DATABASE.md)) |
   | `ADMIN_PASSWORD` | a long password |
   | `AUTH_SECRET` | 64 random hex characters |
   | `RESEND_API_KEY` | `re_…` |
   | `CONTACT_TO_EMAIL` | `you@yourdomain.com` |
   | `CONTACT_FROM_EMAIL` | `Portfolio <hello@yourdomain.com>` |
   | `NEXT_PUBLIC_CALENDLY_URL` | `https://calendly.com/you/30min` |

4. Deploy. The build command (`prisma generate && next build`) is already in `package.json`.
5. If you use a database, create the tables once from your machine with the production URL:
   ```bash
   DATABASE_URL="postgresql://…prod…" npm run db:setup
   ```

Vercel Analytics turns on automatically on Vercel deployments. Enable it in the project's **Analytics** tab.

> `NEXT_PUBLIC_*` variables are baked in at build time. Redeploy after changing them.

## Email (Resend)

1. Create an account at https://resend.com and an API key.
2. For testing, `CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"` works, but it can only deliver to the email address you signed up with.
3. For production, verify your domain in Resend (**Domains**), then use a sender on that domain, e.g. `hello@yourdomain.com`.
4. Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL`.

The visitor's address is set as `reply_to`, so you can reply straight from your inbox.

**Delivery logic:**

| DB | Email | Result |
|---|---|---|
| ✗ | ✗ | Message logged to server console; visitor sees success (fine for local dev) |
| ✓ | ✗ | Stored in the admin Inbox |
| ✗ | ✓ | Emailed |
| ✓ | ✓ | Stored **and** emailed |

If a configured channel fails and nothing else succeeded, the visitor gets an error asking them to email you directly.

## Spam protection

Built in, no third-party service required:

- **Honeypot field.** Bots fill a hidden input, and the server silently discards the message.
- **Timing check.** Submissions within 2.5 seconds of page load are dropped.
- **Rate limit.** 5 messages per 10 minutes per IP (in-memory, per server instance).
- **Validation.** Zod schemas on the server, plus length limits.

To add Cloudflare Turnstile or hCaptcha, verify the token at the top of `src/app/api/contact/route.ts`.

## Netlify

Netlify supports Next.js through its runtime. Import the repo, keep the default build command (`npm run build`) and add the same environment variables.

## Docker / VPS

```bash
npm ci
npm run build
npm start          # serves on port 3000
```

Run it behind a reverse proxy (Caddy or Nginx) with HTTPS. Put your variables in `.env` or pass them as environment variables.

## Custom domain

Add the domain in your host's dashboard, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy, so Open Graph images and the sitemap use the right URL.

## Pre-launch checklist

- [ ] Replaced the placeholder content in `src/config/site.ts` and `src/content/*`
- [ ] Replaced `public/resume.pdf`
- [ ] Set `NEXT_PUBLIC_SITE_URL`
- [ ] Sent yourself a test message through the contact form
- [ ] Checked the site on a phone
- [ ] Ran `npm run build` locally with no errors
