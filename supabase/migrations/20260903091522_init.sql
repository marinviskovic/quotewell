create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text,
  email text,
  phone text,
  service text,
  value text,
  stage text default 'new',
  source text,
  follow_up text,
  notes text
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id),
  body text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
alter table public.activities enable row level security;

create policy "Allow all access to leads" on public.leads for all using (true) with check (true);
create policy "Allow all access to activities" on public.activities for all using (true) with check (true);
