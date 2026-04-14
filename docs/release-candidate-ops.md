# Release Candidate Ops

## Цель

Сделать не просто deploy path, а живой release candidate контур, который можно прогнать перед выкладкой и получить внятный ответ: релиз готов или нет.

## Что теперь есть

### 1. Env preflight

Есть отдельный preflight-шаг, который проверяет:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- важные Telegram env

В preview-режиме missing env считаются warning, в production-режиме обязательные env валят запуск.

## 2. Один RC pipeline

Теперь есть последовательность:

1. `npm run preflight`
2. `npm run typecheck`
3. `npm run build`
4. `npm run smoke`

И объединяющая команда:

- `npm run rc`

## 3. Smoke coverage расширена

Smoke теперь смотрит не только страницы, но и:

- `/api/health`
- `/api/events`
- `/api/posts?type=insight`
- auth-protected API routes

## 4. Monitoring baseline

Есть health endpoint, который показывает:

- runtime
- configured/missing env classes
- demo fallback vs Supabase mode
- Telegram readiness

Это не полноценный Sentry/DataDog, но уже дает живой технический heartbeat для preview/prod.

## 5. Staging / preview path

До production принимаем такую схему:

- preview deploy на Vercel
- прогон `npm run rc`
- ручной acceptance pass на preview URL
- только потом production alias/domain

## 6. Support runbook

Наиболее вероятные инциденты перед запуском:

- missing env / broken preview boot
- Supabase configured incorrectly
- Telegram auth failures
- write endpoint regressions
- migration mismatch

Для first release это достаточно держать как операторский checklist, а не как сложную on-call платформу.
