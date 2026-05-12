# Analytics Recovery Map

Этот документ нужен, чтобы восстановить старую рабочую версию аналитики без догадок.

Главный вывод:

- `ничего критичного не исчезло`
- `живая кодовая аналитика сохранена`
- `старый HTML-прототип сохранён`
- `ТЗ, формулы и API-контракт сохранены`
- `точные промежуточные UI-состояния без git-коммитов автоматически не восстанавливаются`

То есть старую систему можно собрать заново, но делать это нужно по сохранённым слоям.

## 1. Что сохранилось

### 1.1. Старая концептуальная версия

Старый HTML-прототип:

- [runtime/checklist/web3-analytics-admin-module.html](/Users/digitex/Desktop/Проект2/runtime/checklist/web3-analytics-admin-module.html)

Что в нём есть:

- базовая идеология модуля
- блок `Incoming vs Obligations`
- блок `Breakdown & Forecast`
- блок `Wallets & Structure`
- блок `Alerts & Recommendations`
- первоначальная формулировка смысла аналитики

Что в нём нет:

- живых вкладок
- графиков
- подробной таблицы тарифов
- трафика / географии / реинвеста / состава базы

### 1.2. Живая кодовая версия аналитики

Главный источник текущей большой аналитики:

- [apps/admin/src/modules/analytics](/Users/digitex/Desktop/Проект2/apps/admin/src/modules/analytics)

Ключевые файлы:

- [AnalyticsPage.jsx](/Users/digitex/Desktop/Проект2/apps/admin/src/modules/analytics/AnalyticsPage.jsx)
- [analyticsApi.js](/Users/digitex/Desktop/Проект2/apps/admin/src/modules/analytics/services/analyticsApi.js)
- [analyticsMockData.js](/Users/digitex/Desktop/Проект2/apps/admin/src/modules/analytics/data/analyticsMockData.js)
- [analytics.css](/Users/digitex/Desktop/Проект2/apps/admin/src/modules/analytics/styles/analytics.css)

Что в ней уже есть:

- `Обзор`
- `Трафик / Онлайн`
- `Продукты / Циклы`
- `Реинвест`
- `Состав базы`
- `Лидеры`
- `География`
- `Партнёрская структура`
- `Кошельки`

### 1.3. Собранный build snapshot

Собранная сборка, которая тоже осталась:

- [apps/admin/dist/index.html](/Users/digitex/Desktop/Проект2/apps/admin/dist/index.html)
- [apps/admin/dist/assets/index-BwzBIwB0.js](/Users/digitex/Desktop/Проект2/apps/admin/dist/assets/index-BwzBIwB0.js)
- [apps/admin/dist/assets/index-Do2t21V9.css](/Users/digitex/Desktop/Проект2/apps/admin/dist/assets/index-Do2t21V9.css)

Это полезно как snapshot на момент одной из сборок, но редактировать или восстанавливать из него UI вручную неудобно.

### 1.4. Спецификация и аналитическая логика

ТЗ и расчётные документы:

- [spec.md](/Users/digitex/Desktop/Проект2/specs/002-investment-payout-analytics/spec.md)
- [data-outputs.md](/Users/digitex/Desktop/Проект2/specs/002-investment-payout-analytics/data-outputs.md)
- [formulas.md](/Users/digitex/Desktop/Проект2/specs/002-investment-payout-analytics/formulas.md)
- [api-contract.md](/Users/digitex/Desktop/Проект2/specs/002-investment-payout-analytics/api-contract.md)
- [schema-read-model.md](/Users/digitex/Desktop/Проект2/specs/002-investment-payout-analytics/schema-read-model.md)
- [v0-app-handoff.md](/Users/digitex/Desktop/Проект2/specs/002-investment-payout-analytics/v0-app-handoff.md)

## 2. Что не сохранилось как отдельные версии

Для файлов аналитики нет нормальной полезной git-истории с промежуточными UI-состояниями.

Это значит:

- нельзя одной командой вернуть “тот экран, который был в середине переписки”
- если он не был отдельно закоммичен, он существует только:
  - в текущем коде
  - в старом HTML-прототипе
  - в логике переписки

## 3. Из чего восстанавливать старую версию

### 3.1. Если нужен старый смысл системы

Брать из:

- [runtime/checklist/web3-analytics-admin-module.html](/Users/digitex/Desktop/Проект2/runtime/checklist/web3-analytics-admin-module.html)

Использовать оттуда:

- главный hero
- формулировку `incoming vs obligations`
- общую структуру блоков
- раннюю business-логику панели

### 3.2. Если нужен большой экран с вкладками

Брать из:

- [AnalyticsPage.jsx](/Users/digitex/Desktop/Проект2/apps/admin/src/modules/analytics/AnalyticsPage.jsx)

Использовать оттуда:

- вкладки
- overview
- traffic
- products
- reinvest
- base composition
- leaders
- geography
- partner structure
- wallets

### 3.3. Если нужен визуальный стиль текущей версии

Брать из:

- [analytics.css](/Users/digitex/Desktop/Проект2/apps/admin/src/modules/analytics/styles/analytics.css)

### 3.4. Если нужны данные и формулировки вкладок

Брать из:

- [analyticsApi.js](/Users/digitex/Desktop/Проект2/apps/admin/src/modules/analytics/services/analyticsApi.js)
- [analyticsMockData.js](/Users/digitex/Desktop/Проект2/apps/admin/src/modules/analytics/data/analyticsMockData.js)

## 4. Что было в старой сильной версии, что нельзя потерять

Ниже список того, что по переписке было признано важным и должно быть восстановлено обязательно.

### 4.1. Overview must-have

- `Пришло сегодня`
- `Выплаты сегодня`
- `Цель на сегодня`
- `Доступный остаток`
- `Первая дата риска`

### 4.2. Главная идея

Экран должен отвечать:

- сколько денег зашло
- сколько денег ушло
- сколько нужно добрать
- где дата риска
- что делать сегодня

### 4.3. Активация

Отдельный блок:

- регистрации
- подключили кошелёк
- активировали цикл
- по дням
- по периоду

### 4.4. Вкладки

Обязательный состав:

- Обзор
- Трафик / Онлайн
- Продукты / Циклы
- Реинвест
- Состав базы
- Лидеры
- География
- Партнёрская структура
- Кошельки

### 4.5. Порядок в Продуктах

Всегда:

1. `Lockup`
2. `Daily Flow`

### 4.6. Продуктовая логика

Lockup:

- Contract Test
- Launch
- Momentum
- Premiere
- President
- Imperium

Daily Flow:

- Core
- Elite

### 4.7. Главное правило по продуктовой вкладке

Нужна аналитика, а не описание продукта.

Показывать:

- входящий поток
- ордера
- клейм сейчас
- начислено позже
- обязательства 30д
- дата риска
- разрыв

## 5. Что считать “старой версией” для восстановления

Чтобы не путаться, фиксируем:

### Не считать старой версией

- голый HTML-прототип на `3002`
- только текущую polished версию на новом порту

### Считать старой рабочей версией

Такую версию, в которой уже были:

- вкладки
- обзор
- кошельки
- география
- трафик
- продукты
- реинвест
- партнёрская структура
- базовая логика обязательств и входящего потока

То есть “старая версия” = `первый полноценный analytics module`, а не только ранний HTML.

## 6. Практический план восстановления

### Вариант A — Восстановить как отдельную legacy-версию

Сделать отдельную страницу/маршрут:

- `AnalyticsLegacyPage`
или
- `analytics-restored`

Туда вернуть:

- старый порядок блоков
- старые формулировки верхних KPI
- старую структуру overview
- старую более простую логику вкладок

Плюс не трогать текущую новую версию.

Это самый безопасный путь.

### Вариант B — Откатить текущую аналитику к более раннему виду

Минусы:

- большой риск потерять полезные новые блоки
- сложнее сравнивать
- сложнее понять, что именно вернули, а что сломали

Использовать только если точно надо заменить текущий экран.

### Вариант C — Собрать “restored stable version”

Лучший путь:

1. взять структуру и смысл из старого HTML-прототипа
2. взять вкладки и живую логику из текущего analytics module
3. вернуть старые формулировки верхнего overview
4. зафиксировать отдельную “stable recovered version”

Это даст:

- старую читаемость
- новую полноту
- меньше хаоса

## 7. Что я рекомендую делать дальше

Я рекомендую не пытаться “магически найти точную потерянную версию”.

Рекомендую:

1. восстановить `stable old analytics version` как отдельный экран
2. не трогать текущую новую версию
3. сравнить их рядом
4. уже потом решить, что объединять

## 8. Следующий рабочий шаг

Если делать правильно, следующий шаг такой:

### Собрать отдельную восстановленную версию

Название:

- `analytics-restored`

Основа:

- старый overview
- текущие вкладки
- старая продуктовая простота
- старая логика “входящие деньги / обязательства / что делать сегодня”

Это и будет реальным восстановлением системы.

