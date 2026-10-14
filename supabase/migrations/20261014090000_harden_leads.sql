-- Rescue migration: every lead and note belongs to one signed-in user,
-- and only that user can read or change it.

-- 1. Ownership. Existing rows go to the account that already used the app.
alter table public.leads add column owner_id uuid references auth.users (id) on delete cascade default auth.uid();
alter table public.activities add column owner_id uuid references auth.users (id) on delete cascade default auth.uid();

update public.leads set owner_id = (select id from auth.users order by created_at limit 1) where owner_id is null;
update public.activities a set owner_id = l.owner_id from public.leads l where a.lead_id = l.id and a.owner_id is null;

alter table public.leads alter column owner_id set not null;
alter table public.activities alter column owner_id set not null;

-- 2. Notes go away with their lead instead of blocking the delete.
alter table public.activities drop constraint activities_lead_id_fkey;
alter table public.activities
  add constraint activities_lead_id_fkey foreign key (lead_id) references public.leads (id) on delete cascade;
alter table public.activities alter column lead_id set not null;
alter table public.activities alter column body set not null;

-- 3. Rows saved twice by the old double-click bug (same person, under a minute apart).
delete from public.leads l
using public.leads d
where l.owner_id = d.owner_id
  and l.email = d.email
  and l.name = d.name
  and l.created_at >= d.created_at
  and l.id <> d.id
  and l.created_at - d.created_at < interval '1 minute'
  and (l.created_at, l.id::text) > (d.created_at, d.id::text);

-- 4. Real types, so totals add up and dates don't shift between time zones.
alter table public.leads
  alter column value type numeric(12, 2)
  using coalesce(nullif(regexp_replace(value, '[^0-9.]', '', 'g'), '')::numeric, 0);
alter table public.leads alter column value set default 0;
alter table public.leads alter column value set not null;
alter table public.leads add constraint leads_value_positive check (value >= 0);

alter table public.leads alter column follow_up type date using nullif(follow_up, '')::date;

update public.leads set stage = lower(coalesce(stage, 'new'));
alter table public.leads alter column stage set not null;
alter table public.leads
  add constraint leads_stage_check check (stage in ('new', 'contacted', 'quoted', 'won', 'lost'));
alter table public.leads
  add constraint leads_email_check check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

-- 5. Replace the "allow everything" policies.
drop policy "Allow all access to leads" on public.leads;
drop policy "Allow all access to activities" on public.activities;

revoke all on public.leads, public.activities from anon;

create policy "Users read their own leads" on public.leads
  for select to authenticated using ((select auth.uid()) = owner_id);
create policy "Users add their own leads" on public.leads
  for insert to authenticated with check ((select auth.uid()) = owner_id);
create policy "Users edit their own leads" on public.leads
  for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
create policy "Users delete their own leads" on public.leads
  for delete to authenticated using ((select auth.uid()) = owner_id);

create policy "Users read their own notes" on public.activities
  for select to authenticated using ((select auth.uid()) = owner_id);
create policy "Users add notes to their own leads" on public.activities
  for insert to authenticated with check (
    (select auth.uid()) = owner_id
    and exists (select 1 from public.leads l where l.id = lead_id and l.owner_id = (select auth.uid()))
  );
create policy "Users delete their own notes" on public.activities
  for delete to authenticated using ((select auth.uid()) = owner_id);

-- 6. Indexes for the queries the app runs.
create index leads_owner_created_idx on public.leads (owner_id, created_at desc);
create index activities_lead_idx on public.activities (lead_id, created_at);
create index activities_owner_idx on public.activities (owner_id);
