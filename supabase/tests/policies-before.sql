-- What a stranger with only the public anon key could do before the rescue.
\echo '--- Before: signed-out visitor using the public anon key'
set role anon;
select count(*) as leads_anyone_can_read from public.leads;
select name, email, value from public.leads order by created_at limit 2;
update public.leads set value = '1' where name = 'Tom Becker';
select count(*) as rows_a_stranger_changed from public.leads where value = '1';
reset role;
update public.leads set value = '$14,500' where name = 'Tom Becker';
