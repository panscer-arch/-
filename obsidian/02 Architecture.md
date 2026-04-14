# Architecture

Технический каркас проекта:
- `apps/web`
- `apps/api-gateway`
- `apps/admin`
- `apps/orchestrator`
- `packages/domain-*`
- `packages/ui`
- `supabase`

Основные документы:
- [[docs/architecture|Architecture]]
- [[docs/api-map|API Map]]
- [[docs/agent-system|Agent System]]
- [[docs/orchestrator-postgres|Orchestrator Postgres]]

Нужно отслеживать:
- как доменные пакеты связаны с UI
- что уже моковое, а что настоящее
- где проходит граница между orchestrator и product app
