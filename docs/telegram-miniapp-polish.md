# Telegram Mini App Polish

## Цель

Сделать так, чтобы `Lifecoding` ощущался внутри Telegram не как просто мобильный web app, а как аккуратный native-like mini app.

## 1. Launch / bootstrap states

Нельзя предполагать, что Telegram bootstrap всегда идеален.

Нужны три состояния:

- `loading`
  app инициализируется, Telegram context поднимается
- `ready`
  app безопасно развернулся
- `error / degraded`
  Telegram context частично недоступен, но app не разваливается

Решение:

- mini app должен честно переживать отсутствие идеального `initData`
- `ready` и `expand` не считаем гарантированными

## 2. Back behavior map

Нужны единые правила возврата:

- `rule -> library`
- `diary/new -> previous logical page`
- `settings/* -> settings`
- `modal -> underlying screen`

Решение:

- back navigation не должен жить “как получится” по каждому экрану
- есть одна карта ожидаемого поведения, особенно для вложенных экранов

## 3. Keyboard / visual viewport

Самые чувствительные экраны:

- `diary/new`
- `feed/new`
- `onboarding`

Решение:

- клавиатура не должна ломать sticky CTA
- textarea/input не должны уезжать под клавиатуру
- visualViewport учитываем как отдельный mobile constraint

## 4. Safe areas

Проблемные места:

- bottom nav
- sticky actions
- banners
- fixed CTA

Решение:

- все fixed/sticky элементы живут с учетом safe area
- нижние экраны не должны визуально “залипать” в системную зону Telegram

## 5. Telegram-native share / open flows

Нужно разделить:

- обычный web share
- `openLink`
- `openTelegramLink`
- post-share feedback

Решение:

- Telegram share рассматриваем как отдельный сценарий
- после share должен быть понятный feedback, а не silent action

## 6. Offline drafts / retry

При плохой сети нельзя терять ввод пользователя.

Baseline:

- черновик записи сохраняется локально
- повторная отправка возможна
- пользователь видит, что действие не потерялось

## 7. Theme sync / haptics

Для более нативного ощущения:

- Telegram theme params должны маппиться на app theme
- haptic feedback нужен только на небольшом числе meaningful actions

Подход:

- не перегружать хаптиками
- использовать только там, где действие реально завершилось или требует явной обратной связи

## Итог

27-я задача считается выполненной, если зафиксированы:

- launch/bootstrap states
- back behavior map
- keyboard/viewport behavior
- safe area rules
- Telegram-native share flows
- offline draft baseline
- theme sync / haptics map

Это еще не полный final implementation pass, но уже полноценный UX contract для mini app внутри Telegram.
