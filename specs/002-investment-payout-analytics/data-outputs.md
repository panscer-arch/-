# Investment Analytics Data Outputs

Этот документ фиксирует первый этап: какие данные система должна уметь
выводить и считать сама по себе, ещё до подключения к проекту по API.

Идея простая:

- сначала определяем полный список данных, срезов и расчётных таблиц
- потом проверяем, что логика аналитики полная и понятная
- и только потом подключаем источники и API-слой

## Core Principle

Главный KPI системы: `входящие деньги`.

Все остальные данные нужны затем, чтобы ежедневно отвечать на вопрос:

`хватает ли входящего потока на покрытие текущих и будущих обязательств`

## Output Layers

Система должна уметь выводить данные на 5 уровнях:

1. `Raw register outputs`
   Справочники и сырые сущности: кто, куда, сколько, когда.

2. `Operational outputs`
   Что происходит сегодня: входы, клеймы, начисления, недобор, факт.

3. `Financial obligation outputs`
   Что система уже должна или скоро будет должна выплатить.

4. `Forecast outputs`
   Что будет на 7 / 30 / 90 дней вперёд.

5. `Structural outputs`
   Как устроены кошельки, партнёрка, creator wallets, treasury и где перекос.

## 1. Raw Register Outputs

### 1.1 Users

По каждому пользователю система должна выводить:

- `user_id`
- `registration_date`
- `referrer_user_id`
- `current_status`
- `linked_wallets_count`
- `total_deposit_amount`
- `total_claimed_amount`
- `total_unclaimed_amount`
- `total_referral_earned`
- `total_referral_claimed`

### 1.2 Wallets

По каждому кошельку:

- `wallet_address`
- `wallet_type`
  Значения:
  - `user`
  - `creator`
  - `platform`
  - `treasury`
  - `referral-payout`
- `owner_user_id` если применимо
- `network`
- `first_seen_at`
- `last_activity_at`
- `total_inflow`
- `total_outflow`
- `current_analytic_balance`

### 1.3 Products

По каждому продукту:

- `product_code`
- `product_name`
- `product_type`
  Значения:
  - `lockup`
  - `daily`
- `status`
- `min_deposit`
- `max_deposit`
- `platform_fee_rule`

### 1.4 Tariffs / Cycles

По каждому тарифу / циклу:

- `cycle_id`
- `product_code`
- `cycle_name`
- `duration_days`
- `yield_type`
  Значения:
  - `fixed-total`
  - `fixed-daily`
- `yield_value`
- `deposit_return_rule`
  Значения:
  - `principal-returned`
  - `principal-not-returned`

### 1.5 Orders / Investments

По каждому ордеру:

- `order_id`
- `user_id`
- `wallet_address`
- `product_code`
- `cycle_id`
- `opened_at`
- `matures_at`
- `deposit_amount`
- `expected_income_total`
- `expected_payout_total`
- `claimed_total`
- `unclaimed_total`
- `status`
  Значения:
  - `active`
  - `matured`
  - `partially-claimed`
  - `fully-claimed`
  - `closed`

## 2. Operational Outputs

### 2.1 Daily Inflow Summary

Это самый важный блок. На каждый день система должна выводить:

- `date`
- `new_money_in`
- `new_users_count`
- `new_orders_count`
- `new_lockup_amount`
- `new_daily_amount`
- `avg_ticket`
- `top_10_wallet_share_of_inflow`

### 2.2 Daily Claims Summary

На каждый день:

- `date`
- `user_claims_paid`
- `referral_claims_paid`
- `platform_fee_collected`
- `creator_wallet_inflow`
- `treasury_wallet_inflow`
- `orders_closed_count`

### 2.3 Daily Accrual Summary

На каждый день:

- `date`
- `new_income_accrued`
- `new_referral_accrued`
- `new_platform_fee_accrued`
- `total_unclaimed_user_amount`
- `total_unclaimed_referral_amount`

### 2.4 Daily Plan-Fact

На каждый день:

- `date`
- `planned_new_money_in`
- `actual_new_money_in`
- `variance_amount`
- `variance_percent`
- `carry_forward_deficit`
- `required_target_next_day`
- `status`
  Значения:
  - `ahead`
  - `on-plan`
  - `behind`
  - `critical`

## 3. Financial Obligation Outputs

Система должна различать два контура обязательств.

### 3.1 Cash Obligations

Это деньги, которые уже можно забрать сейчас или в конкретную дату.

По дням:

- `date`
- `claimable_user_amount`
- `claimable_referral_amount`
- `claimable_total`

### 3.2 Economic Obligations

Это деньги, которые уже начислены, даже если ещё не были заклеймлены.

По дням:

- `date`
- `accrued_user_amount`
- `accrued_referral_amount`
- `accrued_total`

### 3.3 Payout Calendar

По каждой будущей дате:

- `date`
- `lockup_principal_due`
- `lockup_income_due`
- `daily_income_expected`
- `referral_expected`
- `platform_fee_expected`
- `gross_pressure_total`

### 3.4 Product Pressure Split

По каждому продукту и периоду:

- `period`
- `product_code`
- `active_orders`
- `deposit_base`
- `future_payout_total`
- `future_referral_total`
- `future_platform_fee_total`
- `pressure_share_percent`

## 4. Forecast Outputs

### 4.1 Main Forecast Windows

Система должна всегда выводить прогноз минимум на:

- `today`
- `7d`
- `30d`
- `current_month`
- `next_month`
- `90d`

### 4.2 Funding Need Forecast

По каждому окну:

- `window`
- `expected_obligations_total`
- `required_new_money_in`
- `required_per_day`
- `referral_component`
- `cycle_payout_component`
- `platform_fee_component`
- `operator_net_component`

### 4.3 Risk Date Output

По каждому окну:

- `first_risk_date`
- `projected_gap_amount`
- `days_until_gap`
- `main_driver`

### 4.4 Scenario Output

Для `base`, `upside`, `downside`:

- `scenario_name`
- `window`
- `required_new_money_in`
- `projected_gap`
- `first_risk_date`
- `expected_operator_net`
- `confidence_level`

### 4.5 Forecast Confidence

По каждому прогнозу:

- `data_freshness_status`
- `reconciliation_status`
- `estimated_share_percent`
- `forecast_accuracy_last_30d`
- `confidence_level`
  Значения:
  - `high`
  - `medium`
  - `low`

## 5. Structural Outputs

### 5.1 Wallet Structure Summary

По creator / treasury / platform / user wallet groups:

- `wallet_group`
- `wallet_count`
- `historical_inflow`
- `historical_outflow`
- `expected_30d_inflow`
- `expected_30d_outflow`
- `net_position`

### 5.2 Referral Structure Summary

По всей сети:

- `total_referral_accrued`
- `total_referral_claimed`
- `unclaimed_referral_balance`
- `top_referral_branches_share`
- `top_10_referrers_share`
- `referral_pressure_next_30d`

### 5.3 Concentration Risk

Система должна отдельно выводить:

- долю обязательств, приходящуюся на топ-10 кошельков
- долю входящего потока, приходящуюся на топ-10 кошельков
- долю выплат, зависящую от топ-10 ордеров
- долю referral pressure, приходящуюся на топ-10 веток

### 5.4 Structural Recommendations

На выходе система должна формировать рекомендации вида:

- `слишком высокая концентрация по крупным кошелькам`
- `слишком высокая нагрузка от Unity Daily`
- `ветка N даёт непропорционально высокий referral pressure`
- `creator wallet X получает ниже ожидаемого уровня`
- `на 30 дней структура входов не покрывает структуру будущих claim`

## 6. Required Daily Screens / Tables

До API система должна уметь хотя бы логически формировать эти 8 таблиц.

### Table 1 — Daily Executive Summary

- дата
- входящий поток
- план на день
- отклонение
- сколько нужно добрать
- статус дня

### Table 2 — 7/30/90 Obligation Summary

- окно
- user payouts
- referral payouts
- platform fee
- total pressure
- required inflow

### Table 3 — Product Split

- продукт
- активные ордера
- база депозитов
- будущие выплаты
- нагрузка %

### Table 4 — Cycle Split

- цикл
- число ордеров
- сумма депозитов
- ожидаемый доход
- ожидаемый возврат
- paid already
- unpaid still

### Table 5 — Claim Readiness

- сегодня claimable
- claimable 7d
- claimable 30d
- unclaimed accrued

### Table 6 — Referral Summary

- начислено партнёрам
- выплачено партнёрам
- осталось незаклеймленным
- ожидается на 30 дней

### Table 7 — Wallet Pressure

- wallet / group
- inflow
- outflow
- expected obligations
- net position

### Table 8 — Plan-Fact Tracker

- день
- план входа
- факт входа
- отклонение
- перенос недобора
- новый required target

## 7. Mandatory Derived Metrics

Вот метрики, которые система обязана считать сама:

- `new_money_in`
- `gross_obligations`
- `cash_obligations`
- `economic_obligations`
- `required_new_money`
- `required_new_money_today`
- `carry_forward_deficit`
- `projected_gap`
- `days_to_gap`
- `referral_burden`
- `platform_fee_burden`
- `operator_net`
- `product_pressure_index`
- `concentration_risk_index`
- `forecast_confidence_index`

## 8. Order Of Implementation

До API логика должна идти в таком порядке:

1. собрать полный список сущностей
2. собрать ежедневные и прогнозные таблицы
3. зафиксировать формулы по каждому полю
4. проверить, что все нужные управленческие выводы покрыты
5. только после этого подключать API-источники

## 9. Bottom Line

На первом этапе система должна уметь не "интегрироваться", а
`правильно считать и выводить все нужные данные`.

Если этот слой собран хорошо, API потом будет лишь отвечать на вопрос:

`откуда брать эти поля`

а не:

`как вообще понять, что считать и что показывать`.
