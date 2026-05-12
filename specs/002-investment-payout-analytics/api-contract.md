# API Contract — Investment Payout Analytics

## Purpose

Этот контракт описывает минимальный backend API для аналитического модуля админ-панели.

Цель API:
- дать `daily control panel` для владельца
- показывать реальные деньги, обязательства и разрывы
- поддерживать аналитические вкладки без вычисления критичной логики на фронте

## Principles

- Backend отдаёт `read-model`, а не сырые транзакции.
- Frontend не должен сам собирать сложные финансовые агрегаты.
- Все money values возвращаются в `usd`.
- Все даты возвращаются в ISO `YYYY-MM-DD`.
- Все endpoints принимают одинаковый базовый фильтр.

## Base Query Params

Используются почти в каждом endpoint:

- `dateRange`: `7d | 30d | 90d | current_month | next_month | custom`
- `dateFrom`: `YYYY-MM-DD` optional for custom
- `dateTo`: `YYYY-MM-DD` optional for custom
- `segment`: `all | retail | leaders | partners | whales | custom`
- `product`: `all | unity_lockup | unity_daily`
- `country`: `all | <country_code_or_name>`
- `network`: `all | bnb | ethereum | polygon | ...`

## 1. Overview

### `GET /api/admin/analytics/overview`

Главный endpoint для вкладки `Обзор`.

#### Response

```json
{
  "generatedAt": "2026-05-07T12:00:00.000Z",
  "currency": "USD",
  "summary": {
    "incomingToday": 18250,
    "planToday": 24000,
    "factToday": 18250,
    "gapToday": 5750,
    "carryForwardDeficit": 3200,
    "targetToday": 27200,
    "targetTomorrow": 30150,
    "obligations7d": 48600,
    "obligations30d": 121400,
    "deficit7d": 9200,
    "deficit30d": 28100,
    "coverage7d": 81.1,
    "coverage30d": 76.8,
    "requiredNewMoney": 121400,
    "referralBurden": 9700,
    "platformFee": 4100,
    "operatorNet": 18300,
    "claimableNow": 22350,
    "accruedLater": 41700,
    "firstRiskDate": "2026-05-14",
    "firstRiskGap": 6100
  },
  "cashPosition": {
    "openingBalance": 31200,
    "incomingFact": 18250,
    "outgoingFact": 9400,
    "closingBalance": 40050,
    "availableCash": 28600,
    "reservedForPayouts": 11450
  },
  "signals": [
    {
      "id": "sig-gap-today",
      "tone": "danger",
      "title": "Сегодня нужно добрать 5750",
      "description": "Если день не закрыть, цель на завтра вырастет."
    }
  ],
  "actions": [
    {
      "id": "act-fill-gap",
      "tone": "danger",
      "title": "Добрать 5750 сегодня",
      "description": "Не переносить хвост недобора на завтрашнюю цель."
    }
  ]
}
```

## 2. Daily Cash Position

### `GET /api/admin/analytics/cash-position`

Даёт реальный cash-view по дням.

#### Response

```json
{
  "currency": "USD",
  "days": [
    {
      "date": "2026-05-07",
      "openingBalance": 31200,
      "incomingFact": 18250,
      "outgoingFact": 9400,
      "closingBalance": 40050,
      "availableCash": 28600,
      "reservedForPayouts": 11450
    }
  ]
}
```

## 3. Obligations Schedule

### `GET /api/admin/analytics/obligations`

Календарь обязательств по дням, продуктам и типам.

#### Response

```json
{
  "currency": "USD",
  "totals": {
    "today": 9800,
    "next7d": 48600,
    "next30d": 121400
  },
  "schedule": [
    {
      "date": "2026-05-08",
      "product": "unity_daily",
      "cycle": "daily_1_2_200",
      "wallet": "0xA91...7D1",
      "obligationType": "user_cycle_payout",
      "amount": 2450,
      "status": "scheduled"
    },
    {
      "date": "2026-05-08",
      "product": "unity_daily",
      "cycle": "daily_1_2_200",
      "wallet": "0xA91...7D1",
      "obligationType": "claimable_now",
      "amount": 820,
      "status": "claimable"
    }
  ]
}
```

### Allowed `obligationType`

- `user_cycle_payout`
- `referral_payout`
- `platform_fee`
- `claimable_now`
- `accrued_not_claimed`

## 4. Plan vs Fact Inflow

### `GET /api/admin/analytics/plan-fact`

#### Response

```json
{
  "currency": "USD",
  "summary": {
    "planToday": 24000,
    "factToday": 18250,
    "gapToday": 5750,
    "carryForwardDeficit": 3200,
    "requiredTargetNextDay": 30150
  },
  "breakdown": [
    {
      "date": "2026-05-07",
      "source": "unity_daily",
      "country": "UAE",
      "leader": "Aisha Karim",
      "product": "unity_daily",
      "plan": 8000,
      "fact": 5200,
      "gap": 2800
    }
  ]
}
```

## 5. Orders and Cycles

### `GET /api/admin/analytics/orders`

#### Response

```json
{
  "currency": "USD",
  "rows": [
    {
      "orderId": "ord_1001",
      "userId": "usr_201",
      "wallet": "0xA91...7D1",
      "product": "unity_lockup",
      "cycle": "lockup_30d_0_27",
      "depositAmount": 5000,
      "createdAt": "2026-04-12",
      "maturesAt": "2026-05-12",
      "expectedPayoutTotal": 5135,
      "paidAmount": 0,
      "remainingAmount": 5135,
      "claimableNow": 0,
      "accruedLater": 5135,
      "status": "active"
    }
  ]
}
```

## 6. Wallets

### `GET /api/admin/analytics/wallets`

#### Response

```json
{
  "currency": "USD",
  "summary": {
    "top5Concentration": 58,
    "avgClaimPressure": 27.4,
    "avgActivityScore": 68.2
  },
  "rows": [
    {
      "wallet": "0xA91...7D1",
      "role": "user",
      "ownerType": "Инвестор",
      "network": "BNB",
      "balance": 12400,
      "inflow": 17100,
      "outflow": 8900,
      "claimable": 3100,
      "accrued": 5800,
      "linkedObligations": 6400,
      "claimPressure": 18.1,
      "obligationLoad": 37.4,
      "riskScore": 41,
      "activityScore": 82,
      "netContribution": 7250,
      "concentrationShare": 22
    }
  ]
}
```

### Allowed `role`

- `user`
- `creator`
- `treasury`
- `platform`

## 7. Partner Structure Finance

### `GET /api/admin/analytics/partner-structure`

#### Response

```json
{
  "currency": "USD",
  "summary": {
    "referralAccrual": 11200,
    "referralPaid": 8900,
    "avgReferralRate": 14.7,
    "avgLeaderDependency": 39.2
  },
  "rows": [
    {
      "partnerId": "partner_11",
      "branch": "North Star",
      "leader": "Leader 1",
      "generatedInflow": 22800,
      "referralAccrual": 3200,
      "referralPaid": 2500,
      "downlineObligations": 7100,
      "netContribution": 12500,
      "structuralLeak": 13,
      "leaderDependency": 51,
      "conversionToDeposit": 46,
      "depthScore": 76
    }
  ]
}
```

## 8. Reinvest

### `GET /api/admin/analytics/reinvest`

#### Response

```json
{
  "currency": "USD",
  "summary": {
    "reinvestUsersRate": 37.2,
    "reinvestCapitalRate": 41.0,
    "repeatDepositRate": 29.0,
    "avgDaysToReinvest": 4.6
  },
  "byProduct": [
    {
      "product": "unity_daily",
      "claimUsers": 420,
      "reinvestUsers": 174,
      "userRate": 41.4,
      "claimedCapital": 22800,
      "reinvestedCapital": 9600,
      "capitalRate": 42.1
    }
  ],
  "byCountry": [
    {
      "country": "UAE",
      "claimUsers": 84,
      "reinvestUsers": 37,
      "userRate": 44.0,
      "claimedCapital": 4800,
      "reinvestedCapital": 2160,
      "capitalRate": 45.0
    }
  ]
}
```

## 9. Traffic to Money Bridge

### `GET /api/admin/analytics/traffic-bridge`

#### Response

```json
{
  "summary": {
    "sessions": 1240,
    "cabinetEntries": 610,
    "walletConnects": 330,
    "depositStarts": 192,
    "depositAmount": 18350,
    "newObligationsCreated": 10620
  },
  "bySource": [
    {
      "source": "unity_daily",
      "country": "UAE",
      "sessions": 310,
      "cabinetEntries": 160,
      "walletConnects": 92,
      "depositStarts": 54,
      "depositAmount": 5200,
      "newObligationsCreated": 3010,
      "cac": 780,
      "netCashContribution": 1420
    }
  ]
}
```

## 10. Geography

### `GET /api/admin/analytics/geography`

#### Response

```json
{
  "currency": "USD",
  "rows": [
    {
      "country": "UAE",
      "city": "Dubai",
      "users": 210,
      "wallets": 184,
      "inflow": 24800,
      "obligations": 17100,
      "deposits": 24800,
      "activeRate": 69.0,
      "repeatRate": 38.0,
      "reinvestRate": 21.0,
      "payingRate": 57.0,
      "claimRate": 34.0,
      "obligationLoad": 68.9,
      "riskScore": 24,
      "growthScore": 79
    }
  ]
}
```

## 11. Leaders

### `GET /api/admin/analytics/leaders`

#### Response

```json
{
  "currency": "USD",
  "participation": [
    {
      "name": "Barny Broflovsky",
      "country": "Great Britain",
      "investment": 18200,
      "cycles": 34,
      "activeDays": 29,
      "obligations": 6400,
      "referralIncome": 1500,
      "netContribution": 10300,
      "reinvestRate": 52,
      "retentionRate": 74,
      "claimRate": 39
    }
  ],
  "attraction": [
    {
      "name": "Aisha Karim",
      "country": "UAE",
      "invited": 120,
      "activeInvited": 86,
      "depositingInvited": 55,
      "inflow": 17400,
      "referralLoad": 2400,
      "leaderDependency": 49,
      "baseRetention": 68,
      "reinvestRate": 33,
      "claimPressure": 22,
      "netContribution": 9100
    }
  ]
}
```

## Recommended Rollout Order

### Phase 1

- `GET /api/admin/analytics/overview`
- `GET /api/admin/analytics/cash-position`
- `GET /api/admin/analytics/obligations`
- `GET /api/admin/analytics/plan-fact`
- `GET /api/admin/analytics/orders`

### Phase 2

- `GET /api/admin/analytics/wallets`
- `GET /api/admin/analytics/partner-structure`
- `GET /api/admin/analytics/reinvest`

### Phase 3

- `GET /api/admin/analytics/traffic-bridge`
- `GET /api/admin/analytics/geography`
- `GET /api/admin/analytics/leaders`

## Notes for NestJS Backend

- Лучше собрать отдельный `analytics read layer`.
- Prisma models не должны напрямую течь на frontend.
- Для тяжёлых вкладок допускаются materialized snapshots / daily aggregates.
- `PostgreSQL first`, при росте объёмов — выделить hot analytics path в `ClickHouse`.
