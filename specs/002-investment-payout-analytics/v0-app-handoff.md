# Web3 Analytics Admin Module — v0.app Handoff

Этот документ нужен как прямой handoff для `v0.app`.
Цель: сгенерировать не маркетинговый dashboard, а рабочий `daily control panel` для Web3 admin analytics.

## 1. Product Goal

Система должна ежедневно отвечать на 5 главных вопросов:

1. Сколько денег зашло сегодня.
2. Сколько денег уже ушло сегодня.
3. Сколько ещё нужно закрыть сегодня.
4. На какие обязательства система выходит на `7 / 30` дней.
5. Где именно источник риска: продукт, кошелёк, страна, лидер, ветка, трафик.

Главный KPI системы: `входящий поток`.

Это не лендинг, не investor pitch и не generic SaaS analytics.
Это `операционная финансовая панель`.

## 2. UX Direction

Интерфейс должен:

- быть на русском языке
- выглядеть как тёмная SaaS-админка
- давать ответ за `5–10 секунд`
- сначала показывать главное, потом детали
- использовать сворачиваемые блоки для длинных sections
- избегать визуального шума
- не перегружать первый экран равноправными KPI

Не делать:

- маркетинговые тексты про тарифы
- перегруженный hero
- агрессивные фильтры наверху
- 15 одинаково важных карточек на первом экране
- сложную навигацию ради красоты

## 3. IA / Tabs

Сделать модуль аналитики с внутренними вкладками.

### MVP Tabs

1. `Обзор`
2. `Трафик / Онлайн`
3. `Продукты / Циклы`
4. `Реинвест`
5. `Состав базы`
6. `Лидеры`
7. `География`
8. `Партнёрская структура`
9. `Кошельки`

### Tab Hints

- `Обзор` — день
- `Трафик / Онлайн` — онлайн
- `Продукты / Циклы` — тарифы
- `Реинвест` — повтор
- `Состав базы` — роли
- `Лидеры` — топы
- `География` — страны
- `Партнёрская структура` — ветки
- `Кошельки` — адреса

## 4. Overview Screen

Это главный экран.
Он должен быть самым коротким и самым управленческим.

### Top KPI Row

Первые карточки:

1. `Пришло сегодня`
2. `Выплаты сегодня`
3. `Цель на сегодня`
4. `Доступный остаток`
5. `Первая дата риска`

### KPI Group 2

Ниже или в отдельном collapsible block:

- `Требуемый новый приток`
- `Реферальная нагрузка`
- `Комиссия платформы`
- `Ваш остаток`
- `Можно забрать сейчас`
- `Начислено, но не выведено`

### Overview Block Order

Использовать такой порядок:

1. `Ключевые сигналы дня`
2. `План действий`
3. `Сигналы и действия`
4. `Сценарии`
5. `Графики`
6. `Активация`
7. `Финансовая структура`
8. `Детальная разбивка`

### Default Open / Closed

По умолчанию:

- KPI сверху — открыты
- `План действий` — свернут
- `Сигналы и действия` — свернут
- `Сценарии` — свернут
- `Графики` — свернут
- `Активация` — свернута
- `Финансовая структура` — свернута
- `Детальная разбивка` — свернута

## 5. Overview Graphs

В `Обзоре` нужны 6 графиков:

1. `Входящий поток по дням`
2. `Выплаты по дням`
3. `Разложение денег`
4. `Структура по продуктам`
5. `Покрытие обязательств`
6. `Давление по продуктам`

Графики не должны быть первым, что бросается в глаза.
Они secondary.

## 6. Activation Block

Нужен отдельный раскрываемый блок `Активация`.

### Что показывать

- `Регистрации`
- `Подключили кошелёк`
- `Активировали цикл`
- `Connect rate`
- `Cycle rate`

### Views

1. `Итог по выбранному периоду`
2. `Активация по дням`

### Period Filter

Локальный фильтр внутри блока:

- `За день`
- `За месяц`
- `За год`
- `За весь период`

### Table behavior

- таблица по дням должна листаться по страницам
- заголовки колонок должны оставаться видимыми
- не растягивать огромную портянку

## 7. Traffic / Online

### Purpose

Показать, сколько людей сейчас живы в системе и как они проходят путь:

`сайт -> кабинет -> кошелёк -> депозит -> цикл`

### Top Metrics

- пользователи на сайте сейчас
- пользователи в кабинете сейчас
- сессии за день
- авторизованные пользователи
- подключения кошельков
- регистрации сегодня
- активировали цикл

### Blocks

1. summary block
2. KPI block
3. `Регистрации -> Кошелёк -> Цикл по дням`
4. `Живой поток по дням`
5. `Онлайн по странам`
6. `Воронка пути`
7. `Конверсия по шагам`
8. `Активация`
9. `Качество live-потока по странам`
10. `Качество источников`
11. `Источники и продукты в live-потоке`

### Important Metrics

- `Конв. в депозит`
- `Подкл. кошелёк`
- `Отказы`
- `Качество`

## 8. Products / Cycles

### Purpose

Это не продуктовый каталог.
Это аналитика по тарифам и их нагрузке.

### Product Order

Сначала всегда:

1. `Lockup`
2. `Daily Flow`

### Lockup Tariffs

1. `Contract Test`
2. `Launch`
3. `Momentum`
4. `Premiere`
5. `President`
6. `Imperium`

### Daily Flow Tariffs

7. `Core`
8. `Elite`

### Minimal Short Labels

Рядом с названием тарифа можно показывать короткое условие:

- `Contract Test` — `Тест смарт-контракта`
- `Launch` — `1 день • тело + 0.3%`
- `Momentum` — `5 дней • тело + 2%`
- `Premiere` — `10 дней • тело + 5%`
- `President` — `20 дней • тело + 12%`
- `Imperium` — `30 дней • тело + 22.5%`
- `Core` — `До 2,000$ • daily без возврата тела`
- `Elite` — `Свыше 2,000$ • daily без возврата тела`

### What to show per tariff

Только аналитика:

- `Входящий поток`
- `Ордера`
- `Клейм сейчас`
- `Начислено позже`
- `Обязательства 30д`
- `Дата риска`
- `Разрыв`

Не показывать много описательной воды.

### Product Visual Hierarchy

- `Lockup` — grouped tier cards
- `Daily Flow` — larger emphasized cards
- ниже — `Сводная таблица всех тарифов`

### Summary Table

Сводная таблица должна быть readable, not dense.
Группы внутри строк:

- `Тариф`
- `Деньги`
- `Нагрузка`
- `Риск`

## 9. Reinvest

### Purpose

Понять, насколько система живая:
люди забирают деньги и снова заводят их в систему или нет.

### Metrics

- `Reinvest users rate`
- `Reinvest capital rate`
- `Repeat deposit rate`
- `Среднее время claim -> reinvest`

### Blocks

- summary
- KPI
- `Реинвест по продуктам`
- `Скорость реинвеста`
- `Реинвест по продуктам` table
- `Реинвест по странам` table

## 10. Base Composition

### Purpose

Понять поведение базы.
Особенно:

- пассивные инвесторы
- активные инвесторы
- пассивные партнёры
- активные партнёры

### Role Segments

- `Только инвесторы`
- `Только партнёры`
- `Инвесторы + партнёры`

### Behavioral splits

- `Активные / Спящие`
- `Новые / Повторные`
- `Платящие / Неплатящие`
- `С claim / Без claim`
- `С рефдоходом / Без рефдохода`
- `Крупные / Средние / Мелкие`
- `Реинвест / Без реинвеста`
- `Глубоко спят / Вернулись / Отвалились`

## 11. Leaders

Две логики:

### По участию

- объём инвестиций
- число циклов
- активность
- net contribution
- reinvest
- retention

### По привлечению

- приглашено
- активных
- inflow
- referral load
- dependency risk
- reinvest
- claim pressure

## 12. Geography

Нужно показывать:

- users по странам
- wallets по странам
- inflow по странам
- obligations по странам
- deposits по странам
- repeat / reinvest
- risk score
- growth score

## 13. Partner Structure

Показывать по веткам:

- inflow
- invited
- active invited
- depositing invited
- referral accrual
- referral paid
- obligations
- leader dependency
- depth
- structural leak
- net branch

## 14. Wallets

Показывать:

- wallet
- role
- owner type
- inflow
- obligations
- claimable
- accrued
- claim pressure
- concentration share
- obligation load
- risk score
- activity score
- net contribution

## 15. Data States

Для каждой вкладки описать states:

- `loading`
- `empty`
- `error`
- `partial data`
- `no data for selected period`
- `fallback / mock mode`

### Empty State Copy Style

Коротко и по делу.
Без комичных фраз.

## 16. Alerts

### Must-have alerts

- сегодня недобор плана
- не хватает покрытия на 7 дней
- не хватает покрытия на 30 дней
- первая дата риска
- слишком растёт реферальная нагрузка
- продукт создаёт опасное давление
- ветка создаёт structural leak
- кошелёк создаёт концентрацию риска

### Alert Style

- `success`
- `warning`
- `danger`

Красный использовать умеренно и только для реального риска.

## 17. Filters

Глобальные фильтры пока не делать акцентными.
Лучше локальные фильтры там, где они реально нужны.

### Current approved filter pattern

- фильтр периода внутри `Активации`
- локальные фильтры внутри таблиц/срезов

Не делать шумную общую фильтр-панель наверху.

## 18. Copy Rules

### Tone

- коротко
- управленчески
- без “маркетинговой” воды
- без смешения русского и английского там, где это можно перевести

### Good copy examples

- `Пришло сегодня`
- `Выплаты сегодня`
- `Цель на сегодня`
- `Доступный остаток`
- `Первая дата риска`
- `Конв. в депозит`
- `Подкл. кошелёк`

### Bad copy examples

- `Daily control overview`
- `Health metric`
- `Live funnel`
- `Deposit conv.`
- длинные описания тарифов

## 19. Visual Rules

### Desired feel

- dark premium admin
- clean spacing
- secondary info subdued
- important info clearer
- cards should feel intentional, not Bootstrap-default

### Priority hierarchy

1. верхние KPI
2. actions / alerts
3. scenarios
4. graphs
5. tables
6. collaboration / board tools

### Buttons

В шапке:

- `Графики` — primary
- `Открыть доску` — secondary

### Collapsible blocks

Называть как действия:

- `Посмотреть, что сделать сегодня`
- `Посмотреть сигналы и реакции`
- `Посмотреть динамику, структуру и графики`
- `Посмотреть активацию пользователей`
- `Посмотреть детальную разбивку`

CTA внутри:

- `Развернуть`
- `Свернуть`

## 20. Responsive Rules

### Mobile

- табы должны скроллиться горизонтально
- таблицы должны оставаться usable
- breakdown rows должны переносить helper-text на новую строку
- большие grids продуктов должны схлопываться в `1 column`
- padding у panels уменьшать

### Desktop

- использовать воздух
- не растягивать тексты слишком широко
- summary blocks не должны выглядеть как сплошная стена

## 21. Collaboration Utilities

В модуле может быть встроен internal utility block:

- `Открыть доску`
- embedded board
- quick idea capture

Но он не должен быть главным смыслом экрана.
Это utility layer, не основной analytics layer.

## 22. What v0.app Should Generate

Нужно сгенерировать:

- layout всех вкладок
- dark SaaS admin UI
- card system
- tabs
- collapsible section pattern
- readable tables
- chart cards
- mobile-responsive behavior
- Russian UI copy

## 23. What v0.app Should Not Generate

Не надо:

- маркетинговый landing hero
- слишком яркие gradient banners наверху
- много декоративных иллюстраций
- product brochure вместо analytics
- giant filter bar
- overload of decorative icons

## 24. v0.app Prompt Seed

Ниже seed prompt, который можно использовать как основу:

```text
Design a dark Russian-language SaaS admin analytics module for a Web3 investment project.

This is not a marketing dashboard. It is a daily financial control panel.

The first screen must quickly answer:
- how much money came in today
- how much was paid out today
- what the target for today is
- how much cash is currently available
- what the first risk date is

The module has internal tabs:
- Overview
- Traffic / Online
- Products / Cycles
- Reinvest
- Base Composition
- Leaders
- Geography
- Partner Structure
- Wallets

The UI should feel premium, clean, dark, structured, readable, and operational.
Use collapsible blocks for heavy sections.
Keep Overview concise and action-oriented.
Use Russian copy everywhere.
Avoid marketing-style product descriptions. Show mostly analytics and statistics.
Lockup products must appear before Daily Flow.
Tables must be readable and not overly dense.
```

## 25. Recommended Attachments For v0

Передавать вместе с этим документом:

- [spec.md](/Users/digitex/Desktop/Проект2/specs/002-investment-payout-analytics/spec.md)
- [data-outputs.md](/Users/digitex/Desktop/Проект2/specs/002-investment-payout-analytics/data-outputs.md)
- [formulas.md](/Users/digitex/Desktop/Проект2/specs/002-investment-payout-analytics/formulas.md)
- [api-contract.md](/Users/digitex/Desktop/Проект2/specs/002-investment-payout-analytics/api-contract.md)
- [schema-read-model.md](/Users/digitex/Desktop/Проект2/specs/002-investment-payout-analytics/schema-read-model.md)

