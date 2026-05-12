# Investment Analytics Formulas

Этот документ фиксирует, как именно должны считаться ключевые метрики
аналитической системы.

Цель документа:

- убрать двусмысленность в расчётах
- разделить фактические данные и вычисляемые значения
- подготовить логику для будущей реализации без привязки к API

## 1. Basic Definitions

### 1.1 Fact Data

Это данные, которые система получает как факт:

- `deposit_amount`
- `deposit_date`
- `claim_date`
- `claimed_amount`
- `product_code`
- `cycle_id`
- `wallet_address`
- `user_id`
- `referrer_user_id`
- `platform_fee_percent`

### 1.2 Calculated Data

Это данные, которые система должна считать сама:

- `expected_income_total`
- `expected_payout_total`
- `claimable_amount_today`
- `accrued_unclaimed_amount`
- `required_new_money`
- `carry_forward_deficit`
- `projected_gap`
- `operator_net`

## 2. Product Rules

## 2.1 Unity Lockup

Логика продукта:

- пользователь вносит `deposit_amount`
- по окончании срока получает `deposit_amount + income`
- доходность задаётся как итоговая за весь срок

### Lockup Total Income

```text
expected_income_total = deposit_amount * lockup_yield_percent
```

Где `lockup_yield_percent` хранится как десятичное значение.

Примеры:

- `0.01% = 0.0001`
- `0.05% = 0.0005`
- `0.15% = 0.0015`
- `0.27% = 0.0027`

### Lockup Total Payout

```text
expected_payout_total = deposit_amount + expected_income_total
```

### Lockup Claimable Amount

Если `today < matures_at`, то:

```text
claimable_amount_today = 0
```

Если `today >= matures_at` и claim ещё не был произведён:

```text
claimable_amount_today = expected_payout_total - claimed_total
```

### Lockup Accrued Economic Obligation

Для `Lockup` до наступления maturity можно считать два режима.

Для базовой аналитики рекомендованный режим:

```text
accrued_economic_obligation = expected_payout_total
```

если ордер активен и ещё не закрыт.

Это нужно, чтобы видеть будущую полную нагрузку по сроку.

## 2.2 Unity Daily

Логика продукта:

- пользователь вносит `deposit_amount`
- ежедневно ему начисляется доход
- тело депозита не возвращается
- claim можно делать по накопленной сумме

### Daily Daily Income

```text
daily_income_amount = deposit_amount * daily_rate_percent
```

Где:

- `1% = 0.01`
- `1.2% = 0.012`

### Daily Total Income Over Full Term

```text
expected_income_total = daily_income_amount * term_days
```

Для текущей модели:

```text
term_days = 200
```

### Daily Total Payout

Так как тело депозита не возвращается:

```text
expected_payout_total = expected_income_total
```

### Daily Accrued Amount By Day

```text
days_elapsed = max(0, min(term_days, today - deposit_date in days))
accrued_amount_total = daily_income_amount * days_elapsed
```

### Daily Claimable Amount

```text
claimable_amount_today = accrued_amount_total - claimed_total
```

### Daily Unclaimed Economic Obligation

```text
accrued_unclaimed_amount = accrued_amount_total - claimed_total
```

### Daily Remaining Future Obligation

```text
remaining_future_obligation = expected_income_total - claimed_total - accrued_unclaimed_amount
```

или эквивалентно:

```text
remaining_future_obligation = expected_income_total - accrued_amount_total
```

если `claimed_total <= accrued_amount_total`.

## 3. Referral Formulas

Из текущих вводных:

- партнёрка считается `от дохода`
- расчёт привязан к `Claim`

### Referral Base

Для базовой модели:

```text
referral_base = user_income_claimed
```

Не от `deposit_amount`, а от доходной части claim.

### Referral Accrual On Claim

```text
referral_accrued_on_claim = referral_base * referral_percent_total
```

Если уровней несколько:

```text
referral_accrued_level_n = referral_base * referral_percent_level_n
referral_accrued_total = sum(referral_accrued_level_n)
```

### Unclaimed Referral Balance

```text
unclaimed_referral_balance = total_referral_accrued - total_referral_claimed
```

### Referral Cash Obligation

Рекомендуемая формула для операционной аналитики:

```text
claimable_referral_amount = unclaimed_referral_balance_that_is_available_for_referral_claim
```

### Referral Economic Obligation

```text
accrued_referral_amount = total_referral_accrued - total_referral_claimed
```

## 4. Platform Fee Formulas

Из текущих вводных:

- `platform_fee_percent = 8%`
- fee берётся с продуктовой доходности и с партнёрских клеймов

### Platform Fee On User Claim

```text
platform_fee_user_claim = user_income_claimed * 0.08
```

### Platform Fee On Referral Claim

```text
platform_fee_referral_claim = referral_income_claimed * 0.08
```

### Platform Fee Total

```text
platform_fee_total = platform_fee_user_claim + platform_fee_referral_claim
```

### User Net Claim

Если у пользователя claim состоит из тела + дохода, fee должен списываться
только с доходной части:

```text
user_net_claim = principal_claimed + user_income_claimed - platform_fee_user_claim
```

Для `Daily`, где principal не возвращается:

```text
user_net_claim = user_income_claimed - platform_fee_user_claim
```

## 5. Order-Level Formulas

### Order Claimed Total

```text
claimed_total = sum(all successful user claims for order)
```

### Order Unclaimed Total

Для `Lockup`:

```text
unclaimed_total = expected_payout_total - claimed_total
```

Для `Daily`:

```text
unclaimed_total = accrued_amount_total - claimed_total
```

### Order Status

`active`

```text
today < maturity_date and unclaimed_total > 0
```

`matured`

```text
today >= maturity_date and claimed_total = 0
```

`partially-claimed`

```text
claimed_total > 0 and remaining_obligation > 0
```

`fully-claimed`

```text
remaining_obligation <= 0
```

## 6. Daily Inflow Formulas

### New Money In

Главная метрика.

```text
new_money_in(date) = sum(deposit_amount of all deposits opened on date)
```

### New Lockup Amount

```text
new_lockup_amount(date) = sum(deposit_amount where product_type = lockup and deposit_date = date)
```

### New Daily Amount

```text
new_daily_amount(date) = sum(deposit_amount where product_type = daily and deposit_date = date)
```

### Average Ticket

```text
avg_ticket(date) = new_money_in(date) / new_orders_count(date)
```

если ордера есть, иначе `0`.

### Top 10 Wallet Share Of Inflow

```text
top_10_wallet_share_of_inflow = inflow_from_top_10_wallets / new_money_in
```

## 7. Daily Claims And Accruals

### User Claims Paid

```text
user_claims_paid(date) = sum(net user claim payouts executed on date)
```

### Referral Claims Paid

```text
referral_claims_paid(date) = sum(referral claim payouts executed on date)
```

### Platform Fee Collected

```text
platform_fee_collected(date) = sum(all platform fee amounts recognized on date)
```

### New Income Accrued

```text
new_income_accrued(date) = sum(income accrued across all active orders during date)
```

Для `Daily` это в основном:

```text
sum(daily_income_amount for active daily orders)
```

Для `Lockup` в v1 можно считать либо ноль ежедневно, либо распределённую
модель. Рекомендуемый базовый вариант для ежедневного accrual-слоя:

```text
new_income_accrued_lockup(date) = expected_income_total / term_days
```

если нужен экономический accrual по сроку.

## 8. Cash And Economic Obligations

## 8.1 Cash Obligation

Это то, что уже может быть реально выведено / заклеймлено.

```text
cash_obligation(date) = claimable_user_amount(date) + claimable_referral_amount(date)
```

## 8.2 Economic Obligation

Это то, что уже начислено или гарантировано бизнес-логикой.

```text
economic_obligation(date) = accrued_user_amount(date) + accrued_referral_amount(date)
```

## 8.3 Gross Pressure Total

Для будущей даты:

```text
gross_pressure_total(date) =
  lockup_principal_due(date)
  + lockup_income_due(date)
  + daily_income_expected(date)
  + referral_expected(date)
```

Platform fee при этом выводится отдельным блоком, не как расход системы на
пользователя, а как поток распределения.

## 9. Plan-Fact Formulas

### Variance Amount

```text
variance_amount = actual_new_money_in - planned_new_money_in
```

### Variance Percent

```text
variance_percent = variance_amount / planned_new_money_in
```

если план не равен нулю.

### Carry Forward Deficit

```text
carry_forward_deficit(today) =
  max(0, carry_forward_deficit(yesterday) + planned_new_money_in(today) - actual_new_money_in(today))
```

### Required Target Next Day

```text
required_target_next_day =
  base_required_target_next_day + carry_forward_deficit(today)
```

Где `base_required_target_next_day` считается из будущего pressure window.

### Status

`ahead`

```text
actual_new_money_in > planned_new_money_in
```

`on-plan`

```text
actual_new_money_in ~= planned_new_money_in
```

`behind`

```text
actual_new_money_in < planned_new_money_in and no immediate gap risk
```

`critical`

```text
actual_new_money_in < planned_new_money_in and projected_gap exists within chosen risk window
```

## 10. Forecast Formulas

### Expected Obligations Total

По окну `W`:

```text
expected_obligations_total(W) =
  sum(gross_pressure_total(date)) for all date in W
```

### Required New Money In

Базовая модель:

```text
required_new_money_in(W) =
  max(0, expected_obligations_total(W) - available_coverage(W))
```

### Available Coverage

На первом этапе рекомендуем считать так:

```text
available_coverage(W) = confirmed_available_balance + already_overachieved_inflow_buffer
```

Если резервов отдельно не учитываем, можно начать с:

```text
available_coverage(W) = 0
```

и тогда required new money будет равен full pressure.

### Required Per Day

```text
required_per_day(W) = required_new_money_in(W) / days_remaining_in_window(W)
```

### Projected Gap

```text
projected_gap(W) = max(0, expected_obligations_total(W) - projected_available_cash(W))
```

### First Risk Date

Это первая дата, на которую:

```text
cumulative_required_cash(date) > cumulative_projected_coverage(date)
```

## 11. Breakdown Formulas

### Referral Component

```text
referral_component(W) = sum(referral_expected(date)) for date in W
```

### Cycle Payout Component

```text
cycle_payout_component(W) =
  sum(lockup_principal_due + lockup_income_due + daily_income_expected) for date in W
```

### Platform Fee Component

```text
platform_fee_component(W) = sum(platform_fee_expected(date)) for date in W
```

### Operator Net Component

В аналитике это нужно выводить как:

```text
operator_net_component(W) =
  projected_new_money_in(W)
  - cycle_payout_component(W)
  - referral_component(W)
  - platform_fee_out_component_if_treated_as_external
```

Если platform fee — это ваш же поток, его нужно показывать отдельно и не
вычитать второй раз из operator net.

## 12. Concentration Risk Formulas

### Obligation Concentration

```text
obligation_concentration_top_10 =
  obligations_of_top_10_wallets / total_obligations
```

### Inflow Concentration

```text
inflow_concentration_top_10 =
  inflow_of_top_10_wallets / total_inflow
```

### Referral Concentration

```text
referral_concentration_top_10 =
  referral_pressure_of_top_10_branches / total_referral_pressure
```

## 13. Forecast Confidence

### Estimated Share Percent

```text
estimated_share_percent = estimated_amount / total_forecast_amount
```

### Forecast Accuracy Last 30d

```text
forecast_accuracy_last_30d =
  1 - abs(actual_30d - forecasted_30d) / forecasted_30d
```

или в reporting form:

```text
forecast_error_percent =
  abs(actual_30d - forecasted_30d) / forecasted_30d
```

### Confidence Level

Простой rule-based вариант:

`high`

- данные свежие
- данные сверены
- estimated_share низкий
- forecast accuracy acceptable

`medium`

- есть частичная оценка или частичное расхождение

`low`

- stale data
- missing reconciliation
- высокий estimated share
- слабая accuracy истории

## 14. Recommended Implementation Notes

Чтобы избежать путаницы, каждая формула должна быть маркирована как:

- `fact`
- `derived`
- `forecast`
- `scenario`

И каждый расчёт должен хранить:

- input fields used
- calculation timestamp
- version of business rules

## 15. Bottom Line

Базовая расчётная модель должна всегда отвечать на 4 вопроса:

1. сколько новых денег зашло
2. сколько система уже должна или скоро будет должна выплатить
3. сколько новых денег нужно добрать
4. сколько из них уйдёт на user payouts, referral, platform fee и сколько
   останется в net-результате

Если эти формулы зафиксированы, дальше API, базы и интерфейс уже можно
подключать без риска, что сама финансовая логика расползётся.
