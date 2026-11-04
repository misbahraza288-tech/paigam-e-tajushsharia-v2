-- Paighaam-e-Tajushshariah v2 — Supabase schema (run once in SQL Editor, in order)
-- Every content table has the same shape: id text, data jsonb (the row), created_at.
-- Only the owner (a row in admin_users) can write. Visitors can read content, insert a
-- message / comment (pending) / quiz attempt, and read the leaderboard VIEW (name + score only).
-- Phone numbers and addresses from quiz attempts are never readable by visitors.

create table if not exists public.admin_users (
  uid uuid primary key references auth.users(id) on delete cascade
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admin_users where uid = auth.uid());
$$;

do $$
declare t text;
begin
  foreach t in array array['site','books','paigham','updates','gallery','quizzes','comments','attempts','messages'] loop
    execute format('create table if not exists public.%I (id text primary key, data jsonb not null default ''{}''::jsonb, created_at timestamptz not null default now())', t);
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- public reads of content
create policy "read site" on public.site for select using (true);
create policy "read books" on public.books for select using (true);
create policy "read paigham" on public.paigham for select using (true);
create policy "read updates" on public.updates for select using (true);
create policy "read gallery" on public.gallery for select using (true);
create policy "read quizzes" on public.quizzes for select using (true);
create policy "read approved comments" on public.comments for select using (data->>'status' = 'approved' or public.is_admin());

-- visitor inserts (pending by default; cannot approve themselves)
create policy "insert pending comment" on public.comments for insert with check (data->>'status' = 'pending');
create policy "insert message" on public.messages for insert with check (true);
create policy "insert quiz attempt" on public.attempts for insert with check (true);

-- owner reads private tables
create policy "owner read messages" on public.messages for select using (public.is_admin());
create policy "owner read attempts" on public.attempts for select using (public.is_admin());

-- owner writes everything
do $$
declare t text;
begin
  foreach t in array array['site','books','paigham','updates','gallery','quizzes','comments','attempts','messages'] loop
    execute format('create policy "owner write %1$s" on public.%1$I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

-- leaderboard: first name + score only, no phone, no address
create or replace view public.leaderboard as
  select split_part(coalesce(data->>'name','Guest'), ' ', 1) as name,
         (data->>'score')::int as score,
         data->>'created' as created
  from public.attempts
  where data ? 'score';
grant select on public.leaderboard to anon, authenticated;

-- media bucket for phone photos (public read, owner upload)
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
create policy "read media" on storage.objects for select using (bucket_id = 'media');
create policy "owner upload media" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
create policy "owner update media" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
create policy "owner delete media" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

-- after the owner signs up in Authentication > Users, add the owner's uid here:
-- insert into public.admin_users (uid) values ('PASTE-OWNER-UID-HERE');
