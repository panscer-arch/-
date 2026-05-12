# Investment Analytics Operating Model

Этот документ дополняет [spec.md](/Users/digitex/Library/Mobile%20Documents/com~apple~CloudDocs/Code/Проект2/specs/002-investment-payout-analytics/spec.md) и отвечает на вопрос: кого нужно подключить, чтобы аналитика была подробная, управленческая и прогнозируемая.

## Recommended Core Stack

1. `product-manager`
   Держит границы MVP, определяет какие цифры действительно влияют на решение,
   а какие создают шум.

2. `finance-financial-analyst`
   Отвечает за финансовую модель системы: cash pressure, payout obligations,
   сценарии, чувствительность и объяснимость прогнозов.

3. `finance-fpa-analyst`
   Отвечает за план-факт, rolling forecast, дневные и месячные цели, дефицит,
   recovery logic и управленческий ритм.

4. `engineering-data-engineer`
   Отвечает за ingest, качество данных, сверку источников, freshness, lineage,
   расчетные витрины и доверие к цифрам.

5. `design-ux-architect`
   Раскладывает, как именно оператор читает аналитику: portfolio view,
   pressure timeline, plan-fact loop, drill-down до кошелька и рекомендации.

6. `design-ui-designer`
   Делает аналитику читаемой: статусные зоны, тревоги, сценарии, waterfall,
   confidence markers, heatmap по дням и структурные рекомендации.

7. `engineering-frontend-developer`
   Реализует сам аналитический кабинет: фильтры, временные окна, сценарии,
   drill-down, карточки давления и ежедневный operating screen.

8. `engineering-minimal-change-engineer`
   Нужен для безопасных точечных доработок формул, отчётов, breakdown-логики и
   чувствительных правок в уже работающем аналитическом контуре.

9. `testing-reality-checker`
   Проверяет, что цифры не просто красиво отображаются, а действительно сходятся
   с входными данными, сценариями и историческим plan-fact.

## Minimal Practical Team

Если собирать минимальный рабочий контур именно под эту задачу, то достаточно:

1. `product-manager`
2. `finance-financial-analyst`
3. `finance-fpa-analyst`
4. `engineering-data-engineer`
5. `frontend-developer`
6. `reality-checker`

## What Each Role Adds

### `finance-financial-analyst`

Без него система обычно умеет считать отчётность, но не умеет:

- строить base / upside / downside сценарии
- считать sensitivity по ключевым драйверам
- показывать earliest cash-gap date
- объяснять, почему прогноз изменился

### `finance-fpa-analyst`

Без него система обычно видит “сколько нужно”, но не умеет:

- разложить план на день / неделю / месяц
- переносить недобор вперёд
- считать recovery target на следующий день
- вести rolling forecast и оценку forecast accuracy

### `engineering-data-engineer`

Без него система быстро теряет доверие, потому что:

- кошельки и инвестиции могут задваиваться
- часть данных будет приезжать с задержкой
- фактическая выплата и плановая выплата будут расходиться
- никто не поймёт, какие цифры подтверждены, а какие оценочные

### `testing-reality-checker`

Без него аналитика почти всегда выглядит умнее, чем она есть.
Он нужен, чтобы проверять:

- сходится ли daily total с детализацией по кошелькам и циклам
- правильно ли переносится дефицит на следующий день
- не ломается ли прогноз при ручных корректировках
- не врёт ли интерфейс при stale data и partial data

## Analytics Layers

Чтобы аналитика была именно подробной и прогнозируемой, ей нужны 5 слоёв:

1. `Data Truth Layer`
   Реестр кошельков, пользователей, инвестиций, циклов, выплат, рефералов,
   creator wallets, platform wallets.

2. `Calculation Layer`
   Плановые обязательства, фактические выплаты, breakdown по потокам,
   план-факт, накопленный дефицит, структурные коэффициенты.

3. `Forecast Layer`
   Base / upside / downside, earliest risk date, sensitivity, confidence score,
   expected gap by period.

4. `Recommendation Layer`
   Что делать: сколько привлечь сегодня, где structural leak, какой сегмент
   недодаёт, где концентрация риска, что исправить в расстановке партнёров.

5. `Operator Layer`
   Один экран, где видно:
   - сколько нужно закрыть сегодня
   - сколько уже закрыто
   - где дыра на 7 / 30 дней
   - из-за чего она возникла
   - какой следующий action нужен

## Extra Metrics Needed For Real Forecasting

Если хотите не просто красивую аналитику, а реально полезный прогноз, нужно
добавить ещё эти группы метрик:

- `Forecast confidence`
  Насколько прогнозу можно верить по свежести и полноте данных.

- `Forecast accuracy`
  Как прошлые прогнозы совпадали с фактом.

- `Concentration risk`
  Не висит ли слишком большая часть обязательств или притока на малом числе
  кошельков, партнёров или циклов.

- `Leading indicators`
  Ранние признаки будущего провала плана: просадка в притоке, падение по
  отдельным партнёрским веткам, смещение сроков привлечения, рост payout load.

- `Structural efficiency`
  Насколько текущая партнёрская структура хорошо превращает новый приток в
  устойчивый cash coverage, а не только в краткосрочное закрытие дыры.

## Operating Rhythm

Рекомендуемый ритм работы системы:

1. Ежедневно утром
   Пересчитать план на сегодня, дефицит, pressure points и safe / risk status.

2. В течение дня
   Обновлять факт притока, выплат и отклонение от плана.

3. Ежедневно вечером
   Закрывать день, переносить недобор или избыток, обновлять target next day.

4. Раз в неделю
   Пересматривать сценарии, концентрацию риска и структурные рекомендации.

5. Раз в месяц
   Сверять точность прогнозов и пересматривать сами формулы прогноза.

## Best Practical Pairings

### Product Framing

1. `product-manager`
2. `finance-financial-analyst`
3. `finance-fpa-analyst`

### Predictive Model

1. `finance-financial-analyst`
2. `finance-fpa-analyst`
3. `engineering-data-engineer`
4. `reality-checker`

### Operator Dashboard

1. `ux-architect`
2. `ui-designer`
3. `frontend-developer`
4. `reality-checker`

### Safe Formula Change

1. `minimal-change-engineer`
2. `finance-fpa-analyst`
3. `reality-checker`

## Bottom Line

Если коротко, кроме обычного продуктового и фронтенд-стека, для этой системы
критичны не один, а сразу два аналитика:

- `finance-financial-analyst` для модели и сценариев
- `finance-fpa-analyst` для plan-fact и управленческого ритма

И один обязательный технический партнёр:

- `engineering-data-engineer` для доверия к данным

Иначе получится витрина с цифрами, но не система, которая реально подсказывает,
сколько нужно привлечь сегодня, где образуется кассовая дыра и почему прогнозу
вообще можно верить.
