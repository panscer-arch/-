create extension if not exists "pgcrypto";

-- Align profiles with Supabase Auth.
alter table if exists profiles
  alter column user_id drop default;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_user_id_fkey'
  ) then
    alter table profiles
      add constraint profiles_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end $$;

alter table if exists profiles
  add column if not exists updated_at timestamptz not null default now();

alter table if exists profiles
  add column if not exists bio text not null default '',
  add column if not exists is_public boolean not null default true,
  add column if not exists last_activity_at timestamptz not null default now();

-- Common updated_at trigger for mutable tables.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on profiles;
create trigger set_profiles_updated_at
before update on profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_user_rule_progress_updated_at on user_rule_progress;
create trigger set_user_rule_progress_updated_at
before update on user_rule_progress
for each row execute function public.set_updated_at();

drop trigger if exists set_diary_entries_updated_at on diary_entries;
create trigger set_diary_entries_updated_at
before update on diary_entries
for each row execute function public.set_updated_at();

-- Schema hardening.
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'rules_difficulty_check') then
    alter table rules
      add constraint rules_difficulty_check
      check (difficulty in ('easy', 'medium', 'hard'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'user_rule_progress_status_check') then
    alter table user_rule_progress
      add constraint user_rule_progress_status_check
      check (status in ('not_started', 'in_progress', 'learned', 'applied'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'user_rule_progress_percent_check') then
    alter table user_rule_progress
      add constraint user_rule_progress_percent_check
      check (progress_percent >= 0 and progress_percent <= 100);
  end if;

  if not exists (select 1 from pg_constraint where conname = 'diary_entries_privacy_check') then
    alter table diary_entries
      add constraint diary_entries_privacy_check
      check (privacy in ('private', 'public'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'diary_entries_status_check') then
    alter table diary_entries
      add constraint diary_entries_status_check
      check (status in ('draft', 'published'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'feed_posts_visibility_check') then
    alter table feed_posts
      add constraint feed_posts_visibility_check
      check (visibility in ('public', 'followers', 'private'));
  end if;

  if not exists (select 1 from pg_constraint where conname = 'feed_posts_status_check') then
    alter table feed_posts
      add constraint feed_posts_status_check
      check (status in ('draft', 'published', 'archived'));
  end if;
end $$;

-- Helpful indexes for user-scoped reads and timelines.
create index if not exists idx_user_rule_progress_user_status
  on user_rule_progress (user_id, status);

create index if not exists idx_user_rule_progress_user_updated
  on user_rule_progress (user_id, updated_at desc);

create index if not exists idx_diary_entries_user_created
  on diary_entries (user_id, created_at desc);

create index if not exists idx_diary_entries_public_created
  on diary_entries (created_at desc)
  where privacy = 'public' and status = 'published';

create index if not exists idx_feed_posts_user_created
  on feed_posts (user_id, created_at desc);

create index if not exists idx_feed_posts_public_created
  on feed_posts (created_at desc)
  where visibility = 'public' and status = 'published';

create index if not exists idx_notifications_user_unread_created
  on notifications (user_id, is_read, created_at desc);

create index if not exists idx_user_achievements_user_earned
  on user_achievements (user_id, earned_at desc);

-- RLS baseline.
alter table if exists profiles enable row level security;
alter table if exists rules enable row level security;
alter table if exists user_rule_progress enable row level security;
alter table if exists diary_entries enable row level security;
alter table if exists feed_posts enable row level security;
alter table if exists achievements enable row level security;
alter table if exists user_achievements enable row level security;
alter table if exists notifications enable row level security;

drop policy if exists "profiles_select_own" on profiles;
create policy "profiles_select_own" on profiles
for select using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert_own" on profiles
for insert with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on profiles;
create policy "profiles_update_own" on profiles
for update using (auth.uid() = user_id);

drop policy if exists "profiles_select_public" on profiles;
create policy "profiles_select_public" on profiles
for select using (is_public = true);

drop policy if exists "rules_select_published" on rules;
create policy "rules_select_published" on rules
for select using (published_at is not null);

drop policy if exists "user_rule_progress_select_own" on user_rule_progress;
create policy "user_rule_progress_select_own" on user_rule_progress
for select using (auth.uid() = user_id);

drop policy if exists "user_rule_progress_insert_own" on user_rule_progress;
create policy "user_rule_progress_insert_own" on user_rule_progress
for insert with check (auth.uid() = user_id);

drop policy if exists "user_rule_progress_update_own" on user_rule_progress;
create policy "user_rule_progress_update_own" on user_rule_progress
for update using (auth.uid() = user_id);

drop policy if exists "user_rule_progress_delete_own" on user_rule_progress;
create policy "user_rule_progress_delete_own" on user_rule_progress
for delete using (auth.uid() = user_id);

drop policy if exists "diary_entries_select_own" on diary_entries;
create policy "diary_entries_select_own" on diary_entries
for select using (auth.uid() = user_id);

drop policy if exists "diary_entries_insert_own" on diary_entries;
create policy "diary_entries_insert_own" on diary_entries
for insert with check (auth.uid() = user_id);

drop policy if exists "diary_entries_update_own" on diary_entries;
create policy "diary_entries_update_own" on diary_entries
for update using (auth.uid() = user_id);

drop policy if exists "diary_entries_delete_own" on diary_entries;
create policy "diary_entries_delete_own" on diary_entries
for delete using (auth.uid() = user_id);

drop policy if exists "diary_entries_select_public" on diary_entries;
create policy "diary_entries_select_public" on diary_entries
for select using (privacy = 'public' and status = 'published');

drop policy if exists "feed_posts_select_public" on feed_posts;
create policy "feed_posts_select_public" on feed_posts
for select using (visibility = 'public' and status = 'published');

drop policy if exists "feed_posts_insert_own" on feed_posts;
create policy "feed_posts_insert_own" on feed_posts
for insert with check (auth.uid() = user_id);

drop policy if exists "feed_posts_update_own" on feed_posts;
create policy "feed_posts_update_own" on feed_posts
for update using (auth.uid() = user_id);

drop policy if exists "feed_posts_delete_own" on feed_posts;
create policy "feed_posts_delete_own" on feed_posts
for delete using (auth.uid() = user_id);

drop policy if exists "achievements_select_all" on achievements;
create policy "achievements_select_all" on achievements
for select using (true);

drop policy if exists "user_achievements_select_own" on user_achievements;
create policy "user_achievements_select_own" on user_achievements
for select using (auth.uid() = user_id);

drop policy if exists "user_achievements_insert_own" on user_achievements;
create policy "user_achievements_insert_own" on user_achievements
for insert with check (auth.uid() = user_id);

drop policy if exists "notifications_select_own" on notifications;
create policy "notifications_select_own" on notifications
for select using (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on notifications;
create policy "notifications_update_own" on notifications
for update using (auth.uid() = user_id);

-- Profile bootstrap on signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    user_id,
    display_name,
    avatar_url,
    notifications_enabled,
    onboarding_completed,
    created_at,
    updated_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'full_name', 'Пользователь'),
    new.raw_user_meta_data ->> 'avatar_url',
    true,
    false,
    now(),
    now()
  )
  on conflict (user_id) do update
  set
    display_name = excluded.display_name,
    avatar_url = coalesce(excluded.avatar_url, profiles.avatar_url),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
