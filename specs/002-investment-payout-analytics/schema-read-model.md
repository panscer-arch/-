# Schema & Read Model — Investment Payout Analytics

## Goal

Этот документ фиксирует минимальную data model и analytics read-model для backend.

Задача:
- хранить реальные факты по кошелькам, инвестициям, claim и выплатам
- строить поверх них быстрые read-model для аналитики
- не заставлять frontend считать критичную финансовую логику сам

## Design Principle

Модель делим на 2 слоя:

1. `Core transactional model`
Хранит фактические сущности:
- users
- wallets
- products
- cycles
- orders
- claims
- referral events
- wallet balance snapshots

2. `Analytics read model`
Хранит агрегаты и слепки для кабинета:
- cash position by day
- obligations schedule
- plan vs fact
- wallet risk/load
- partner structure finance
- reinvest analytics

## A. Core Transactional Model

### 1. `users`

```text
id
external_user_id?
full_name?
country
city?
language?
created_at
updated_at
```

Purpose:
- мастер-профиль пользователя
- источник географии и сегментации

### 2. `wallets`

```text
id
user_id?                nullable for treasury/platform wallets
address                 unique
network
role                    user | creator | treasury | platform
owner_type              investor | partner | mixed | creator | treasury | platform
is_active
first_seen_at
last_seen_at
created_at
updated_at
```

Purpose:
- единый реестр всех кошельков
- основа для wallet analytics и flow tracking

### 3. `products`

```text
id
code                    unity_lockup | unity_daily
name
product_type            lockup | daily
is_active
created_at
updated_at
```

### 4. `product_cycles`

```text
id
product_id
code
title
duration_days
yield_mode              fixed_total | daily_percent
yield_percent_total?
yield_percent_daily?
principal_returned      boolean
platform_fee_percent
is_active
created_at
updated_at
```

Examples:
- `lockup_30d_0_27`
- `daily_1_0_200`
- `daily_1_2_200`

### 5. `orders`

```text
id
user_id
wallet_id
product_id
cycle_id
deposit_amount_usd
created_at
matures_at?
expected_income_total_usd
expected_payout_total_usd
principal_amount_usd
status                  active | matured | partially_claimed | fully_claimed | closed
source_channel?
leader_id?
partner_branch_id?
```

Purpose:
- главная сущность инвестиционного входа
- база для обязательств, клеймов и прогнозов

### 6. `order_accruals_daily`

```text
id
order_id
accrual_date
accrued_amount_usd
claimable_amount_usd
status                  accrued | claimable | claimed
created_at
```

Purpose:
- особенно важно для `Unity Daily`
- separates `accrued` vs `claimable`

### 7. `claims`

```text
id
order_id
user_id
wallet_id
claim_type              user_cycle_payout | user_daily_claim
claim_date
amount_usd
tx_hash?
status                  pending | completed | failed
created_at
```

Purpose:
- реальные пользовательские выплаты

### 8. `referral_relationships`

```text
id
inviter_user_id
invitee_user_id
branch_id?
level
created_at
```

Purpose:
- структура партнёрской сети

### 9. `partner_branches`

```text
id
name
leader_user_id?
creator_wallet_id?
created_at
updated_at
```

### 10. `referral_accruals`

```text
id
claim_id
partner_user_id
partner_wallet_id
branch_id
level
base_amount_usd
accrued_amount_usd
accrual_date
status                  accrued | claimable | claimed
created_at
```

Purpose:
- начисление партнёрки от пользовательских claim events

### 11. `referral_payouts`

```text
id
referral_accrual_id
partner_user_id
partner_wallet_id
payout_date
amount_usd
tx_hash?
status                  pending | completed | failed
created_at
```

### 12. `platform_fee_events`

```text
id
source_type             user_income | referral_claim
source_id
wallet_id?
event_date
base_amount_usd
fee_percent
fee_amount_usd
status                  accrued | collected
created_at
```

Purpose:
- учёт комиссии платформы отдельно от пользовательских и партнёрских выплат

### 13. `wallet_balance_snapshots`

```text
id
wallet_id
snapshot_at
balance_usd
inflow_usd_24h
outflow_usd_24h
created_at
```

Purpose:
- основа для real cash position

### 14. `traffic_attribution_daily`

```text
id
date
source_channel
country
leader_id?
product_id?
sessions
cabinet_entries
wallet_connects
deposit_starts
deposit_amount_usd
cac_usd?
created_at
```

Purpose:
- bridge между traffic и money

## B. Analytics Read Model

Read-model лучше хранить либо как materialized snapshots, либо как денормализованные daily aggregates.

### 1. `analytics_daily_cash_position`

```text
date                    pk
opening_balance_usd
incoming_fact_usd
outgoing_fact_usd
closing_balance_usd
available_cash_usd
reserved_for_payouts_usd
created_at
updated_at
```

Used by:
- `overview`
- `cash-position`

### 2. `analytics_daily_obligations`

```text
id
date
product_id?
cycle_id?
wallet_id?
obligation_type
amount_usd
status
source_order_id?
source_claim_id?
created_at
```

Used by:
- `obligations`
- `overview`
- `products`
- `wallets`

### 3. `analytics_plan_fact_inflow_daily`

```text
id
date
source_channel?
country?
leader_id?
product_id?
segment?
plan_usd
fact_usd
gap_usd
carry_forward_deficit_usd
required_target_next_day_usd
created_at
updated_at
```

Used by:
- `overview`
- `plan-fact`

### 4. `analytics_wallet_daily`

```text
id
date
wallet_id
balance_usd
inflow_usd
outflow_usd
claimable_usd
accrued_usd
linked_obligations_usd
claim_pressure_percent
obligation_load_percent
risk_score
activity_score
net_contribution_usd
concentration_share_percent
created_at
updated_at
```

Used by:
- `wallets`
- `overview`

### 5. `analytics_partner_branch_daily`

```text
id
date
branch_id
leader_user_id?
generated_inflow_usd
referral_accrual_usd
referral_paid_usd
downline_obligations_usd
net_contribution_usd
structural_leak_percent
leader_dependency_percent
conversion_to_deposit_percent
depth_score
created_at
updated_at
```

Used by:
- `partner-structure`
- `overview`

### 6. `analytics_reinvest_daily`

```text
id
date
dimension_type          product | country | leader | segment | total
dimension_id?
claim_users
reinvest_users
reinvest_users_rate
claimed_capital_usd
reinvested_capital_usd
reinvest_capital_rate
avg_days_to_reinvest
created_at
updated_at
```

Used by:
- `reinvest`
- `base composition`
- `geography`
- `leaders`

### 7. `analytics_country_daily`

```text
id
date
country
city?
users_count
wallets_count
inflow_usd
obligations_usd
deposits_usd
active_rate_percent
repeat_rate_percent
reinvest_rate_percent
paying_rate_percent
claim_rate_percent
obligation_load_percent
risk_score
growth_score
created_at
updated_at
```

Used by:
- `geography`
- `overview`

### 8. `analytics_leader_daily`

```text
id
date
leader_user_id
country
investment_usd
cycles_count
active_days
obligations_usd
referral_income_usd
net_contribution_usd
reinvest_rate_percent
retention_rate_percent
claim_rate_percent
invited_count
active_invited_count
depositing_invited_count
leader_dependency_percent
claim_pressure_percent
created_at
updated_at
```

Used by:
- `leaders`
- `overview`

### 9. `analytics_traffic_bridge_daily`

```text
id
date
source_channel
country?
leader_user_id?
product_id?
sessions
cabinet_entries
wallet_connects
deposit_starts
deposit_amount_usd
new_obligations_created_usd
cac_usd?
net_cash_contribution_usd?
bounce_rate_percent?
quality_score?
created_at
updated_at
```

Used by:
- `traffic`
- arbitrage layer

## C. Recommended Prisma Model Order

Если переносить в Prisma по этапам, я бы делал так:

### Phase 1 — Core
- `User`
- `Wallet`
- `Product`
- `ProductCycle`
- `Order`
- `OrderAccrualDaily`
- `Claim`
- `WalletBalanceSnapshot`

### Phase 2 — Structure
- `PartnerBranch`
- `ReferralRelationship`
- `ReferralAccrual`
- `ReferralPayout`
- `PlatformFeeEvent`

### Phase 3 — Read Model
- `AnalyticsDailyCashPosition`
- `AnalyticsDailyObligation`
- `AnalyticsPlanFactInflowDaily`
- `AnalyticsWalletDaily`
- `AnalyticsPartnerBranchDaily`
- `AnalyticsReinvestDaily`
- `AnalyticsCountryDaily`
- `AnalyticsLeaderDaily`
- `AnalyticsTrafficBridgeDaily`

## D. Backend Processing Notes

### Snapshot cadence

Recommended:
- hot metrics: every `5-15 min`
- day-level aggregates: nightly rebuild + intraday incremental refresh

### Source of truth

- Orders and claims come from smart-contract indexed events
- Wallet balances come from chain snapshots / balance polling / indexed state
- Traffic comes from product analytics / cookie analytics / attribution logs

### Why read model is required

Без отдельного analytics read-model:
- frontend начнёт пересчитывать too much logic
- SQL станет слишком тяжёлым для каждого экрана
- появятся расхождения между вкладками

## E. Must-Have Before Real API

До первого подключения фронта к backend должны существовать:

1. `User -> Wallet -> Order -> Claim` path
2. `Order accrual vs claimable vs paid` separation
3. `Referral accrual vs referral paid` separation
4. `Platform fee accrual` tracking
5. `Wallet balance snapshot` tracking
6. `Daily obligations calendar`
7. `Daily plan vs fact inflow`

Без этого аналитика будет красивой, но не достаточно точной для ежедневного управления.
