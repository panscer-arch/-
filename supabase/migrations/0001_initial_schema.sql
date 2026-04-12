create extension if not exists "pgcrypto";

create table if not exists profiles (
  user_id uuid primary key default gen_random_uuid(),
  nickname text not null unique,
  display_name text not null,
  avatar_url text,
  status text not null default '',
  level integer not null default 1,
  xp integer not null default 0,
  achievements_count integer not null default 0,
  learned_rules_count integer not null default 0,
  published_posts_count integer not null default 0,
  diary_privacy_default text not null default 'private',
  notifications_enabled boolean not null default true,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists rules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text not null,
  content_type text not null,
  duration_minutes integer not null default 0,
  difficulty text not null,
  content_body text not null,
  learned_by_users integer not null default 0,
  published_at timestamptz
);

create table if not exists user_rule_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  rule_id uuid not null references rules(id) on delete cascade,
  status text not null default 'not_started',
  is_favorite boolean not null default false,
  progress_percent integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  rule_id uuid references rules(id) on delete set null,
  title text not null,
  body text not null,
  entry_format text not null,
  privacy text not null default 'private',
  status text not null default 'draft',
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists feed_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  source_diary_entry_id uuid references diary_entries(id) on delete set null,
  body text not null,
  likes_count integer not null default 0,
  comments_count integer not null default 0,
  visibility text not null default 'public',
  status text not null default 'published',
  created_at timestamptz not null default now()
);

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  xp_reward integer not null default 0
);

create table if not exists user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  achievement_id uuid not null references achievements(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null,
  title text not null,
  body text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
