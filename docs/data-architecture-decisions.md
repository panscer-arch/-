# Data Architecture Decisions

## Цель

Зафиксировать спорные границы доменов до того, как модель данных расползется между mini app, API, CRM и будущим production backend.

## 1. Rule = не один огромный объект

`Rule` разделяем на четыре слоя:

- `rule_definition`
  Главная смысловая сущность. Содержит `id`, `slug`, `title`, `summary`, `format`, `difficulty`, `estimated_duration`.
- `rule_content`
  Контент правила: body, blocks, examples, CTA-тексты, связанные материалы.
- `rule_taxonomy`
  Категории, теги, thematic grouping, related rules.
- `rule_stats`
  Только derived-данные: просмотры, completion rate, popularity, recent usage.

Решение:

- В продукте каноническим объектом считаем `rule_definition`
- Контент и таксономию не смешиваем с derived stats
- UI может собирать composite view model, но не хранит все в одном schema-object

## 2. Progress source of truth = гибрид

Чистый snapshot слишком слаб для аналитики, чистый event sourcing слишком тяжел для продукта на текущей стадии.

Берем гибрид:

- `user_rule_progress` = главный read/write snapshot для app
- `rule_progress_events` = append-only история ключевых переходов

Snapshot хранит:

- `status`
- `started_at`
- `learned_at`
- `applied_at`
- `last_activity_at`

Events хранят:

- `started`
- `marked_learned`
- `marked_applied`
- `reopened`

Решение:

- UI и API читают snapshot
- analytics, audit и future gamification могут читать event history
- snapshot обновляется транзакционно вместе с записью события

## 3. Diary entry и feed post = разные сущности

`Diary entry` — это личная запись.
`Feed post` — это публичная публикация.

Они связаны, но это не одно и то же.

Решение:

- `diary_entries` остается личным каноническим reflection layer
- `feed_posts` — отдельная публичная сущность
- у `feed_posts` есть `source_diary_entry_id` при публикации из дневника
- feed post хранит собственный public-ready snapshot текста, чтобы не ломать публичный контент при редактировании private entry

Следствие:

- не делаем одну таблицу “записи вообще”
- privacy rules проще
- moderation rules живут на `feed_posts`, а не на private diary

## 4. Identity, profile, settings, gamification = четыре разных слоя

Нельзя держать в одном UI-object и auth, и bio, и notifications, и XP.

Решение:

- `identity`
  auth user, login methods, linked identities
- `profile`
  public name, username, avatar, bio
- `settings`
  notification prefs, privacy prefs, app preferences
- `gamification_summary`
  level, xp, streak, unlocked achievements

Следствие:

- `/api/profile` не должен быть свалкой всего сразу
- server profile snapshot может агрегировать данные для UI, но доменно слои остаются раздельными

## 5. CRM = отдельный operational bounded context

CRM-доска нужна, но это не продуктовый домен пользователя.

Решение:

- CRM не смешиваем с runtime product schema
- CRM остается отдельным operational context
- source of truth по продукту:
  - app runtime tables для продукта
  - GitHub для кода
  - CRM для human-facing delivery/status

Следствие:

- не надо тянуть CRM сущности в Supabase product schema как будто это часть user-facing app
- если позже понадобится operator/admin слой, он будет отдельным bounded context, не текущей CRM-доской

## Итоговая рамка

Что считаем каноническим:

- `rule_definition`
- `user_rule_progress`
- `diary_entries`
- `feed_posts`
- `identity`
- `profile`
- `settings`
- `gamification_summary`

Что считаем отдельными operational/read-model слоями:

- `rule_stats`
- `rule_progress_events`
- `crm board`
- analytics/event sinks

## Что это дает

- меньше путаницы между private и public слоями
- проще RLS и privacy
- чище API-контракты
- понятнее, какие сущности будут жить в production schema, а какие нет
- меньше риска, что mini app и backend начнут считать одну и ту же вещь по-разному
