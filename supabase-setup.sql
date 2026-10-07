-- Crowknows: run once in Supabase -> SQL Editor (new query -> paste -> Run).
-- Safe to re-run.

create table if not exists public.schedule_days (
  user_id          uuid        not null default auth.uid()
                               references auth.users (id) on delete cascade,
  date             text        not null,            -- local day, YYYY-MM-DD
  completed_habits jsonb       not null default '[]'::jsonb,
  step_count       integer     not null default 0,
  updated_at       timestamptz not null default now(),
  primary key (user_id, date)
);

alter table public.schedule_days enable row level security;

drop policy if exists "own rows select" on public.schedule_days;
drop policy if exists "own rows insert" on public.schedule_days;
drop policy if exists "own rows update" on public.schedule_days;
drop policy if exists "own rows delete" on public.schedule_days;

create policy "own rows select" on public.schedule_days
  for select to authenticated using (user_id = (select auth.uid()));
create policy "own rows insert" on public.schedule_days
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "own rows update" on public.schedule_days
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "own rows delete" on public.schedule_days
  for delete to authenticated using (user_id = (select auth.uid()));
