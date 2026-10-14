-- The founder's account and the data already in the app before the rescue.
insert into auth.users (id, email, created_at) values
  ('11111111-1111-1111-1111-111111111111', 'owner@fernway.example', now() - interval '30 days');
insert into public.leads (id, name, email, service, value, stage, follow_up, created_at) values
  ('a0000000-0000-0000-0000-000000000001', 'Maria Gonzalez', 'maria.g@example.com', 'Backyard redesign', '4800', 'new', '2026-10-14', '2026-10-13 16:15:00+00'),
  ('a0000000-0000-0000-0000-000000000002', 'Maria Gonzalez', 'maria.g@example.com', 'Backyard redesign', '4800', 'new', '2026-10-14', '2026-10-13 16:15:01+00'),
  ('a0000000-0000-0000-0000-000000000003', 'Tom Becker', 'tom@beckerpg.example', 'HOA common areas', '$14,500', 'Quoted', '2026-10-16', '2026-10-09 14:00:00+00'),
  ('a0000000-0000-0000-0000-000000000004', 'Aiko Tanaka', 'aiko.t@example.com', 'Japanese maple', '900', 'Won', '', '2026-10-08 11:00:00+00');
insert into public.activities (lead_id, body) values ('a0000000-0000-0000-0000-000000000003', 'Walked the properties with Tom.');
