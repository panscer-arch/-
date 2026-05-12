# API Gateway Analytics

Локальный analytics backend сейчас работает в двух режимах:

- `ANALYTICS_DATA_MODE=stub`
  Безопасный режим по умолчанию. Все endpoint'ы отдают stub/read-model данные.

- `ANALYTICS_DATA_MODE=database`
  Режим чтения из PostgreSQL через Prisma.

## Быстрый старт

1. Установить зависимости:

```bash
npm install --workspace @lifecoding/api-gateway
```

2. Подготовить env:

```bash
cp apps/api-gateway/.env.example apps/api-gateway/.env.local
```

Или использовать корневой `.env.local`, потому что `api-gateway` теперь его тоже читает.

3. Сгенерировать Prisma client:

```bash
npm run prisma:generate --workspace @lifecoding/api-gateway
```

4. Поднять схему в БД:

```bash
npm run prisma:push --workspace @lifecoding/api-gateway
```

5. Заполнить Phase 1 стартовыми данными:

```bash
npm run seed:phase1 --workspace @lifecoding/api-gateway
```

Или одним шагом:

```bash
npm run db:phase1 --workspace @lifecoding/api-gateway
```

6. Запустить API:

```bash
npm run dev --workspace @lifecoding/api-gateway
```

## Phase 1 таблицы

Для первого реального запуска аналитики критичны:

- `analytics_daily_cash_position`
- `analytics_daily_obligations`
- `analytics_plan_fact_inflow_daily`
- `analytics_wallet_daily`
- `analytics_partner_branch_daily`

После этого можно снять со stub:

- `overview`
- `cash-position`
- `obligations`
- `plan-fact`
- `wallets`
- `partner-structure`

## Что делает `seed:phase1`

Скрипт создаёт минимальный рабочий набор для:

- `users`
- `wallets`
- `products`
- `product_cycles`
- `orders`
- `analytics_daily_cash_position`
- `analytics_daily_obligations`
- `analytics_plan_fact_inflow_daily`
- `analytics_wallet_daily`
- `analytics_partner_branch_daily`

Этого уже хватает, чтобы перевести на real DB:

- `overview`
- `cash-position`
- `obligations`
- `plan-fact`
- `orders`
- `wallets`
- `partner-structure`

## Health

Проверка режима:

```bash
curl http://127.0.0.1:3100/health
```

В ответе есть `analyticsDataMode`.

## Phase 1 verification

Быстрая проверка готовности:

```bash
npm run check:phase1 --workspace @lifecoding/api-gateway
```

Полный checklist:

- [PHASE1_CHECKLIST.md](/Users/digitex/Desktop/Проект2/apps/api-gateway/PHASE1_CHECKLIST.md)
