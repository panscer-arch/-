# Data Contract Unification

## Цель

Свести основной проект и mini app к одному понятному data contract до релиза, чтобы схема, API и payload-ы не расходились по скрытым правилам.

## Что теперь считаем каноническим

### 1. Production backend path

Для первого релиза канонический backend path:

- `Next.js Route Handlers` внутри mini app
- `Supabase` как production storage и auth layer
- demo fallback только для локального режима без env

Это значит:

- product runtime не должен расползаться между `apps/api-gateway`, локальными store и отдельными ad-hoc SQL-путями
- mini app говорит с одним серверным слоем

## 2. Имена доменных сущностей

### Profile

- каноническая таблица: `profiles`
- ключ профиля: `profiles.id = auth.users.id`
- `user_id` живет только в зависимых таблицах

Решение:

- в API-контракте профиля наружу отдаем один нормализованный shape
- в коде не смешиваем `id` и `user_id` как равноправные ключи профиля

### Rules

- каноническая таблица: `rules`
- канонический read-model наружу: `RuleSummary`

Поля read-model:

- `id`
- `slug`
- `title`
- `summary`
- `category`
- `author`
- `format`
- `duration`
- `difficulty`
- `publishedAt`
- `studiedCount`

### Feed

Доменная сущность называется `feed post`, но в runtime mini app physical table пока остается `posts`.

Решение:

- не делаем рискованный table rename перед релизом
- закрепляем единый API shape `FeedPost`
- в docs и bounded-context смысле говорим `feed post`
- в standalone mini app runtime допускаем physical table `posts` как совместимый storage name

### Diary

Канонический API shape:

- `id`
- `content`
- `mood`
- `is_public`
- `rule`
- `created_at`
- `updated_at`

Наружу больше не должны утекать сразу оба варианта:

- `is_private`
- `is_public`

Внутри storage можно хранить `is_private`, но API наружу отдает `is_public`.

## 3. Migration chain

Каноническая migration chain теперь одна:

- `/Users/digitex/Desktop/Проект2/supabase/migrations`

Standalone mini app SQL-скрипты считаются:

- bootstrap / legacy material
- reference-only
- не source of truth для production rollout

## 4. API payload validation

Для write endpoints теперь есть единый schema layer в mini app:

- `ProfilePatchInputSchema`
- `CreatePostInputSchema`
- `DiaryEntryInputSchema`
- `RuleProgressInputSchema`

Итог:

- payload не уходит в storage без нормальной валидации
- есть size caps
- есть честные `400 Validation failed`

## 5. Что осталось совместимым, но неидеальным

До релиза оставляем совместимость:

- `posts` как runtime table name в standalone mini app
- demo fallback storage
- часть legacy-мэппинга в normalize-helpers

Это допустимо, потому что:

- contract наружу уже единый
- source of truth для прод-схемы уже выбран
- physical rename можно делать позже отдельной миграцией, не ломая продуктовый API

## Итог

30-я задача считается закрытой, потому что:

- выбран один production backend path
- зафиксирован один source of truth для migrations
- нормализованы ключевые read/write payload contracts
- write endpoints получили schema validation
- схема monorepo и mini app больше не спорят молча на уровне названий и полей
