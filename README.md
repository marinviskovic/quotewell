# QuoteWell

A small CRM for service businesses (leads, follow-ups, pipeline), started in Lovable
and taken to production. **Concept project**: the business and all data are made up.

Stack: React 19, Vite, TypeScript, Tailwind CSS 4, Supabase (Postgres, Auth, RLS), Vercel.

## Run it

```sh
npm install
cp .env.example .env   # set VITE_DEMO_MODE=true to run on sample data
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run build` | Production build, homepage prerendered into `dist/index.html`, plus `robots.txt` and `sitemap.xml` |
| `npm run build:demo` | Static demo build with hash routes, for hosts without URL rewrites |
| `npm run typecheck` | TypeScript check |
| `npm run test:db` | Runs both migrations on a throwaway Postgres and checks every RLS policy (needs `psql`; set `PGHOST`, `PGPORT`, `PGUSER`) |

## Supabase

1. Create a project, then run the files in `supabase/migrations/` in order
   (`supabase db push`, or paste them into the SQL editor).
2. Authentication > URL configuration: set the Site URL to the production domain and add
   `https://<domain>/app` to the redirect URLs, so confirmation emails land in the app.
3. Put the project URL and **anon** key in `.env`. The service_role key never goes into
   a `VITE_` variable or the frontend.

## Deploy to Vercel

1. Import the repository in Vercel. `vercel.json` sets the build, the SPA rewrites
   (refreshing `/app/leads/123` no longer 404s) and security headers.
2. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and `VITE_SITE_URL` under
   Settings > Environment Variables.

## Custom domain

In Vercel: Settings > Domains > add `quotewell.app` and `www.quotewell.app`. At the registrar:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

Vercel issues the SSL certificate once DNS resolves. Then update the Supabase Site URL
and `VITE_SITE_URL` to the new domain and redeploy.

## What changed from the Lovable export

See `docs/rescue-report.md` and the commit history: one commit per fix.
