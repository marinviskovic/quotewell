-- Each check prints PASS or FAIL. Run by run-tests.sh after all migrations.
create or replace function pg_temp.check(label text, ok boolean) returns void language plpgsql as $$
begin
  raise notice '% %', case when ok then 'PASS' else 'FAIL' end, label;
end $$;

insert into auth.users (id, email) values ('22222222-2222-2222-2222-222222222222', 'someone-else@example.com');
grant all on all tables in schema pg_temp to anon, authenticated;

-- Signed-out visitor
set role anon;
do $$ begin
  perform 1 from public.leads;
  perform pg_temp.check('anon cannot read leads', false);
exception when insufficient_privilege then
  perform pg_temp.check('anon cannot read leads', true);
end $$;
do $$ begin
  insert into public.leads (name, email) values ('Spam', 'spam@example.com');
  perform pg_temp.check('anon cannot insert leads', false);
exception when insufficient_privilege then
  perform pg_temp.check('anon cannot insert leads', true);
end $$;
reset role;

-- The other account
set role authenticated;
set request.jwt.claims = '{"sub": "22222222-2222-2222-2222-222222222222"}';
select pg_temp.check('other user sees none of the owner''s leads', (select count(*) from public.leads) = 0);
with u as (update public.leads set value = 1 returning 1) select pg_temp.check('other user cannot edit the owner''s leads', (select count(*) from u) = 0);
with d as (delete from public.leads returning 1) select pg_temp.check('other user cannot delete the owner''s leads', (select count(*) from d) = 0);
do $$ begin
  insert into public.leads (name, email, owner_id) values ('Fake', 'fake@example.com', '11111111-1111-1111-1111-111111111111');
  perform pg_temp.check('other user cannot plant a lead in the owner''s account', false);
exception when insufficient_privilege then
  perform pg_temp.check('other user cannot plant a lead in the owner''s account', true);
end $$;
do $$ begin
  insert into public.activities (lead_id, body) values ('a0000000-0000-0000-0000-000000000003', 'hijack');
  perform pg_temp.check('other user cannot add notes to the owner''s lead', false);
exception when insufficient_privilege then
  perform pg_temp.check('other user cannot add notes to the owner''s lead', true);
end $$;
insert into public.leads (name, email, service, value) values ('Own lead', 'own@example.com', 'Mowing', 120);
select pg_temp.check('new lead gets owner_id from the session', (select owner_id from public.leads where name = 'Own lead') = '22222222-2222-2222-2222-222222222222');
select pg_temp.check('other user sees only their own lead', (select count(*) from public.leads) = 1);
reset role;

-- The owner
set role authenticated;
set request.jwt.claims = '{"sub": "11111111-1111-1111-1111-111111111111"}';
select pg_temp.check('owner still sees their 3 leads (duplicate removed)', (select count(*) from public.leads) = 3);
select pg_temp.check('pipeline adds up as a number: 20200.00', (select sum(value) from public.leads where stage <> 'lost') = 20200);
select pg_temp.check('stages are normalised to lowercase', (select count(*) from public.leads where stage = 'won') = 1);
select pg_temp.check('owner still sees their notes', (select count(*) from public.activities) = 1);
do $$ begin
  update public.leads set stage = 'Won' where name = 'Tom Becker';
  perform pg_temp.check('mis-cased stage is rejected', false);
exception when check_violation then
  perform pg_temp.check('mis-cased stage is rejected', true);
end $$;
with d as (delete from public.leads where name = 'Tom Becker' returning 1) select pg_temp.check('owner can delete their lead (notes go with it)', (select count(*) from d) = 1);
reset role;
select pg_temp.check('deleted lead''s notes were removed', (select count(*) from public.activities) = 0);
