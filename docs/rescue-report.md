# QuoteWell rescue report

Concept project. The client, business and data are made up; the code, bugs, fixes and
measurements are real and reproducible from this repository.

## The brief

A founder built QuoteWell, a lead tracker for small service businesses, in Lovable.
It looked finished in the editor but wasn't safe or reliable enough to put real customers in:
totals were wrong, phones couldn't use it, and anyone could read the database.
The ask: fix it, secure it and launch it on a custom domain.

## Audit: what was wrong

| # | Severity | Problem | How it showed up |
| --- | --- | --- | --- |
| 1 | Critical | Supabase policies `using (true)` on every table | Anyone with the public anon key could read, edit and delete every customer's leads (verified: a signed-out request read 4/4 rows and changed one) |
| 2 | Critical | `service_role` key in a `VITE_` variable | Shipped inside the JavaScript bundle; that key bypasses all security |
| 3 | Critical | Login page didn't log in | The form navigated to the dashboard without checking anything; every page was reachable by URL |
| 4 | High | No owner on rows | No way to keep one account's data apart from another's |
| 5 | High | Pipeline total added text | Showed `$048004800650120014500…` instead of a dollar amount |
| 6 | High | Stages saved as `New`, compared as `new` | "Won deals" always 0, the stage filter matched nothing |
| 7 | High | Double-click on Save | Duplicate leads in the list |
| 8 | Medium | Date-only values parsed as UTC | Follow-ups showed one day early for US users |
| 9 | Medium | Fixed 256px sidebar on all screens | On a phone the content was a 130px column and the table ran off-screen |
| 10 | Medium | No SPA rewrites | Refreshing `/leads/123` on Vercel returns 404 |
| 11 | Medium | Errors from Supabase ignored | A failed request looked like an empty list |
| 12 | Low | No validation, no delete confirmation | Empty or broken leads, one-click data loss |
| 13 | Low | `Vite + React + TS` title, no description, no robots.txt | Lighthouse SEO 82, plain-text link previews |

## What was done (one commit each)

1. **Database locked down**: new migration adds `owner_id` (defaults to `auth.uid()`),
   owner-only RLS policies, real column types (`numeric`, `date`, checked stage),
   cascade deletes, indexes, and removes rows duplicated by bug 7. Service role key removed.
2. **Real authentication**: Supabase Auth sign-in and sign-up, route guard, working sign out.
3. **Data bugs fixed**: numeric totals, one list of stages, time-zone-safe dates,
   locked Save button, validation, surfaced errors, delete confirmation.
4. **Phone-ready interface**: sidebar on desktop, tab bar on phones, card list, pipeline board.
5. **Launch setup**: prerendered public homepage, meta and Open Graph tags, robots.txt,
   sitemap, `vercel.json` with rewrites and security headers, custom domain steps.
6. **Performance**: self-hosted, preloaded fonts.
7. **Tests**: database policy tests and an end-to-end smoke test.

## Results

### Database policies (`npm run test:db`, Postgres 16)

```
--- Before: signed-out visitor using the public anon key
 leads_anyone_can_read = 4
 rows_a_stranger_changed = 1

--- After: migrations/20261014090000_harden_leads.sql
PASS anon cannot read leads
PASS anon cannot insert leads
PASS other user sees none of the owner's leads
PASS other user cannot edit the owner's leads
PASS other user cannot delete the owner's leads
PASS other user cannot plant a lead in the owner's account
PASS other user cannot add notes to the owner's lead
PASS new lead gets owner_id from the session
PASS other user sees only their own lead
PASS owner still sees their 3 leads (duplicate removed)
PASS pipeline adds up as a number: 20200.00
PASS stages are normalised to lowercase
PASS owner still sees their notes
PASS mis-cased stage is rejected
PASS owner can delete their lead (notes go with it)
PASS deleted lead's notes were removed

--- Shared demo account: migrations/20261015090000_demo_account.sql
PASS demo account gets 12 sample leads
PASS demo account gets 5 sample notes
PASS visitors cannot call reset_demo
PASS nightly reset restores the sample data
PASS other users still see only their own leads
```

### App (`npm run test:e2e`, Chromium, America/Los_Angeles)

13/13 checks pass: sign-in redirect, wrong password, pipeline total, time zone,
stage filter, double submit, validation, delete confirmation, deep-link refresh,
no sideways scroll on phones (5 pages), sign out, no JavaScript errors.

### Lighthouse (public entry page, local production build)

| | Performance (mobile) | Performance (desktop) | SEO | Accessibility | Best practices |
| --- | --- | --- | --- | --- | --- |
| Before | 82 | 100 | 82 | 100 | 100 |
| After | 99 | 100 | 100 | 100 | 100 |

Before: total blocking time 670 ms on mobile. After: 20 ms, first paint 1.4 s.

## What the client still does

- Create the Supabase project and run the migrations.
- Connect the repository to Vercel, add the two Supabase environment variables.
- Point the domain's DNS at Vercel (records in the README).
