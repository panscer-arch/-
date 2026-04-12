# Lifecoding Platform

Microservice-ready modular monorepo for the `Лайфкодинг` MVP.

## Workspace

- `apps/web` - Next.js user cabinet
- `apps/api-gateway` - API facade placeholder for service orchestration
- `apps/admin` - admin surface placeholder
- `apps/orchestrator` - Telegram-first lead-agent runtime with GitHub sync
- `packages/domain-*` - isolated domain modules
- `packages/ui` - shared UI building blocks
- `packages/shared-types` - public contracts and entity types
- `packages/event-bus` - in-process event bus for modular orchestration
- `packages/feature-flags` - runtime feature toggles
- `supabase` - schema and migrations for Postgres/Supabase
- `docs` - architecture and delivery docs

## Product docs

- `docs/mvp-spec.md` - product core, MVP boundaries, key flows, and screen map
- `docs/dashboard-midfi-blueprint.md` - first design blueprint for the dashboard screen
- `docs/library-midfi-blueprint.md` - mid-fi blueprint for the rules library
- `docs/rule-page-midfi-blueprint.md` - mid-fi blueprint for a single rule page
- `docs/diary-midfi-blueprint.md` - mid-fi blueprint for the diary screen
- `docs/feed-midfi-blueprint.md` - mid-fi blueprint for the community feed
- `docs/screen-roadmap.md` - full screen design and implementation order for the MVP
- `docs/component-spec.md` - component rules for the Quiet System design layer

## Guiding principles

- Modular first, microservice-ready later
- Feature flags for plug-and-play capabilities
- Typed contracts between domains
- Event-driven side effects instead of tight coupling
- UI depends on contracts, not on database internals

## Next steps

1. Install dependencies in the workspace.
2. Connect Supabase keys in local env files.
3. Replace mock repositories in domain packages with real data adapters.
4. Turn API placeholders into working route handlers and service orchestration.
5. Run the orchestrator and connect Telegram/GitHub credentials to manage work through one lead agent.
6. Switch orchestrator persistence from file storage to Postgres/Supabase when you want shared durable task memory.
