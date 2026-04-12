# Architecture

## Monorepo layout

- `apps/web`: main user-facing cabinet, App Router UI, route handlers, and protected layouts
- `apps/api-gateway`: future composition layer for cross-domain orchestration and service extraction
- `apps/admin`: moderation and operational tooling
- `packages/domain-*`: self-contained domain contracts and service abstractions
- `packages/shared-types`: public contracts and cross-domain entity types
- `packages/event-bus`: event-driven extension point for modular side effects
- `packages/feature-flags`: runtime capability switches

## Modular-to-microservice path

Every domain package must expose:

- public contract types
- application service interface
- repository boundary
- event names it emits
- zero direct dependency on UI concerns

Candidate modules for future extraction:

- `notifications`
- `recommendations`
- `feed`
- `gamification`
- media processing

## Event map

- `user_registered`
- `onboarding_completed`
- `rule_started`
- `rule_learned`
- `rule_applied`
- `diary_entry_created`
- `feed_post_published`
- `achievement_earned`
