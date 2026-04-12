# Orchestrator Postgres Persistence

## Goal

Move orchestrator state from local files into Postgres or Supabase without changing Telegram/GitHub orchestration behavior.

## Modes

- `ORCHESTRATOR_PERSISTENCE_MODE=file`
- `ORCHESTRATOR_PERSISTENCE_MODE=postgres`

Default is `file`.

## Required env for Postgres mode

- `DATABASE_URL`
- optional: `ORCHESTRATOR_DB_SCHEMA` default `orchestrator`

## Data model

- `orchestrator.tasks`
  - `id`
  - `payload jsonb`
  - `github_issue_number`
  - timestamps
- `orchestrator.meta`
  - `telegram.last_update_id`
  - `github.last_issue_sync_at`

## Setup

1. Apply [supabase/migrations/0002_orchestrator.sql](/Users/digitex/Desktop/Проект2/supabase/migrations/0002_orchestrator.sql:1)
2. Set:

```bash
export ORCHESTRATOR_PERSISTENCE_MODE=postgres
export DATABASE_URL=postgres://...
```

3. Start orchestrator:

```bash
npm run dev:orchestrator
```

## Notes

- File persistence remains available as fallback
- Task payload is stored whole as `jsonb`, so schema evolution is easier for the orchestrator layer
- `github_issue_number` is indexed for fast sync from GitHub back into task memory
