create schema if not exists orchestrator;

create table if not exists orchestrator.tasks (
  id text primary key,
  payload jsonb not null,
  github_issue_number integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orchestrator_tasks_github_issue_number
  on orchestrator.tasks (github_issue_number);

create table if not exists orchestrator.meta (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into orchestrator.meta (key, value)
values
  ('telegram.last_update_id', '0'::jsonb),
  ('github.last_issue_sync_at', 'null'::jsonb)
on conflict (key) do nothing;
