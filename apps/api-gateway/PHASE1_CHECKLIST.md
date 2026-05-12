# Phase 1 Checklist

Цель этого этапа:
- перевести `Обзор`
- `Кошельки`
- `Партнёрскую структуру`

со `stub` на реальную PostgreSQL через Prisma.

## 1. Инфраструктура

- [ ] Есть рабочий `DATABASE_URL`
- [ ] PostgreSQL доступна локально или по сети
- [ ] Установлены зависимости `@prisma/client` и `prisma`
- [ ] Сгенерирован Prisma client
- [ ] `api-gateway` читает `.env.local`

## 2. Режим данных

- [ ] В env выставлен `ANALYTICS_DATA_MODE=database`
- [ ] `/health` показывает `analyticsDataMode: database`
- [ ] `api-gateway` стартует без ошибки подключения

## 3. Схема БД

- [ ] Выполнен `npm run prisma:push --workspace @lifecoding/api-gateway`
- [ ] В БД появились таблицы:
  - [ ] `analytics_daily_cash_position`
  - [ ] `analytics_daily_obligations`
  - [ ] `analytics_plan_fact_inflow_daily`
  - [ ] `analytics_wallet_daily`
  - [ ] `analytics_partner_branch_daily`

## 4. Базовые сущности

- [ ] Есть `users`
- [ ] Есть `wallets`
- [ ] Есть `products`
- [ ] Есть `product_cycles`
- [ ] Есть `orders`

## 5. Phase 1 seed

- [ ] Выполнен `npm run seed:phase1 --workspace @lifecoding/api-gateway`
- [ ] В `analytics_daily_cash_position` есть минимум 1 день
- [ ] В `analytics_daily_obligations` есть будущие обязательства
- [ ] В `analytics_plan_fact_inflow_daily` есть строки по `unity_daily` и `unity_lockup`
- [ ] В `analytics_wallet_daily` есть минимум 2 кошелька
- [ ] В `analytics_partner_branch_daily` есть минимум 2 ветки

## 6. Backend-проверка

- [ ] `GET /api/admin/analytics/overview` отвечает из `analytics-prisma-read-model`
- [ ] `GET /api/admin/analytics/cash-position` отвечает из `analytics-prisma-read-model`
- [ ] `GET /api/admin/analytics/obligations` отвечает из `analytics-prisma-read-model`
- [ ] `GET /api/admin/analytics/plan-fact` отвечает из `analytics-prisma-read-model`
- [ ] `GET /api/admin/analytics/wallets` отвечает из `analytics-prisma-read-model`
- [ ] `GET /api/admin/analytics/partner-structure` отвечает из `analytics-prisma-read-model`

## 7. Frontend-проверка

- [ ] На [http://127.0.0.1:5173/analytics](http://127.0.0.1:5173/analytics) header показывает `api-gateway`
- [ ] `Обзор` не падает и не уходит в `mock fallback`
- [ ] Во вкладке `Кошельки` видны DB-значения
- [ ] Во вкладке `Партнёрская структура` видны DB-значения

## 8. Команды

```bash
npm run check:phase1 --workspace @lifecoding/api-gateway
npm run prisma:push --workspace @lifecoding/api-gateway
npm run seed:phase1 --workspace @lifecoding/api-gateway
```

Или:

```bash
npm run db:phase1 --workspace @lifecoding/api-gateway
```

## 9. Готовность к следующему этапу

Считаем `Phase 1` завершённым, если:
- `overview`
- `cash-position`
- `obligations`
- `plan-fact`
- `wallets`
- `partner-structure`

идут из `database`, а не из `stub`.
