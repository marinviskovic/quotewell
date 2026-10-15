-- Public demo account: demo@quotewell.app owns a set of sample leads that
-- reset every night, so visitors can click around without signing up.
-- Create the user first (Authentication > Users > Add user, auto-confirm).

create or replace function public.reset_demo()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  demo uuid := (select id from auth.users where email = 'demo@quotewell.app');
  d date := current_date;
begin
  if demo is null then
    raise notice 'No demo@quotewell.app user yet, nothing to reset.';
    return;
  end if;

  delete from public.leads where owner_id = demo;

  insert into public.leads (id, owner_id, created_at, name, company, email, phone, service, value, stage, source, follow_up, notes) values
    ('00000000-0000-4000-8000-000000000001', demo, now() - interval '1 day',  'Maria Gonzalez', null, 'maria.g@example.com', '(503) 555-0142', 'Backyard redesign', 4800, 'new', 'Website form', d, 'Wants a low-water garden and a small patio. Two dogs.'),
    ('00000000-0000-4000-8000-000000000002', demo, now() - interval '2 days', 'Daniel Okafor', 'Okafor Dental', 'office@okafordental.example', '(503) 555-0178', 'Monthly maintenance', 650, 'contacted', 'Google', d + 1, 'Office front beds and parking strip, monthly.'),
    ('00000000-0000-4000-8000-000000000003', demo, now() - interval '3 days', 'Priya Raman', null, 'priya.raman@example.com', null, 'Drip irrigation', 1200, 'quoted', 'Referral', d, 'Referred by the Hendersons. Sent quote #1043.'),
    ('00000000-0000-4000-8000-000000000004', demo, now() - interval '5 days', 'Tom Becker', 'Becker Property Group', 'tom@beckerpg.example', '(971) 555-0110', 'HOA common areas', 14500, 'quoted', 'Referral', d + 2, 'Three properties, seasonal contract. Decision at board meeting.'),
    ('00000000-0000-4000-8000-000000000005', demo, now() - interval '6 days', 'Aiko Tanaka', null, 'aiko.t@example.com', '(503) 555-0193', 'Japanese maple planting', 900, 'won', 'Instagram', null, 'Booked for next Thursday.'),
    ('00000000-0000-4000-8000-000000000006', demo, now() - interval '8 days', 'Grace Whitfield', 'Whitfield Cafe', 'grace@whitfieldcafe.example', '(503) 555-0131', 'Patio planters', 1750, 'won', 'Walk-in', null, 'Seasonal planter swap, spring and fall.'),
    ('00000000-0000-4000-8000-000000000007', demo, now() - interval '9 days', 'Luis Fernandez', null, 'luis.f@example.com', '(971) 555-0157', 'Lawn to meadow', 3200, 'contacted', 'Website form', d - 1, 'Left voicemail, try again in the morning.'),
    ('00000000-0000-4000-8000-000000000008', demo, now() - interval '11 days', 'Hannah Price', null, 'hannah.price@example.com', null, 'Fence-line hedge', 1100, 'lost', 'Google', null, 'Went with a cheaper quote.'),
    ('00000000-0000-4000-8000-000000000009', demo, now() - interval '12 days', 'Sam Whitaker', 'Whitaker Builders', 'sam@whitakerbuilders.example', '(503) 555-0166', 'New-build landscaping', 22000, 'contacted', 'Referral', d + 3, 'Four new homes in Sellwood, needs plans by month end.'),
    ('00000000-0000-4000-8000-000000000010', demo, now() - interval '14 days', 'Olivia Chen', null, 'olivia.chen@example.com', '(503) 555-0105', 'Raised vegetable beds', 2400, 'won', 'Instagram', null, 'Cedar beds, 4 x 8 ft, three of them.'),
    ('00000000-0000-4000-8000-000000000011', demo, now() - interval '16 days', 'Marcus Hill', null, 'marcus.hill@example.com', null, 'Tree removal', 1800, 'new', 'Website form', d + 1, 'Dead fir near the garage.'),
    ('00000000-0000-4000-8000-000000000012', demo, now() - interval '20 days', 'Elena Novak', 'Novak Law', 'elena@novaklaw.example', '(971) 555-0124', 'Office courtyard', 5600, 'quoted', 'Google', d - 2, 'Waiting on their partner meeting.');

  insert into public.activities (owner_id, lead_id, body, created_at) values
    (demo, '00000000-0000-4000-8000-000000000003', 'Site visit done. Measured four beds.', now() - interval '3 days'),
    (demo, '00000000-0000-4000-8000-000000000003', 'Sent quote #1043 for $1,200.', now() - interval '2 days'),
    (demo, '00000000-0000-4000-8000-000000000004', 'Walked the properties with Tom.', now() - interval '4 days'),
    (demo, '00000000-0000-4000-8000-000000000001', 'Lead came in from the website form.', now() - interval '1 day'),
    (demo, '00000000-0000-4000-8000-000000000009', 'Intro call, sending a draft plan.', now() - interval '10 days');
end;
$$;

-- Security definer functions in public are callable through the API unless revoked.
revoke execute on function public.reset_demo() from public, anon, authenticated;

select public.reset_demo();

-- Nightly reset at 03:00 UTC. pg_cron is available on every Supabase project.
do $$
begin
  create extension if not exists pg_cron;
  perform cron.unschedule(jobid) from cron.job where jobname = 'reset-demo';
  perform cron.schedule('reset-demo', '0 3 * * *', 'select public.reset_demo()');
exception when others then
  raise notice 'pg_cron not available (%), skipping the nightly reset.', sqlerrm;
end $$;
