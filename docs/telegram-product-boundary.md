# Telegram Product Boundary

## Главное решение

В продукте должно быть **два разных Telegram-слоя**, а не один смешанный бот:

1. **Product bot**
   - пользовательский вход
   - уведомления
   - возврат в mini app
   - короткие команды и deep links

2. **Dev orchestrator**
   - внутренняя система для разработки
   - triage задач
   - GitHub sync
   - агентские потоки
   - не пользовательский продуктовый интерфейс

Их нельзя смешивать в одну роль.

## Роль product bot

Product bot не должен заменять mini app.

Его правильная роль:
- inbox / notification layer
- быстрый re-entry point
- reminder layer
- link to app state
- точка для account linking

Product bot не должен быть:
- основной библиотекой правил
- основным интерфейсом дневника
- главным social feed
- местом для сложной настройки профиля

## Роль mini app

Mini app остается главным продуктовым интерфейсом.

Туда идут:
- библиотека
- страница правила
- дневник
- лента
- профиль
- dashboard

Telegram нужен, чтобы:
- вернуть человека в app
- прислать полезный сигнал
- дать короткое действие
- поддержать ритм возврата

## Root identity

Главный аккаунт = **app account**.

Telegram = **linked identity**, а не корень системы.

Это значит:
- человек может зайти через `lifecoding.app`
- может войти через Google
- потом привязать Telegram
- mini app и домен используют один и тот же профиль

## Mapping identity

Нужная модель:

- `users`
- `profiles`
- `linked_identities`
  - provider = `google`
  - provider = `telegram`

Минимально:
- один app user
- один optional telegram link
- одна история прогресса, дневника и feed

## App -> Telegram -> App flow

Канонический пользовательский сценарий:

1. Человек заходит на `lifecoding.app` или из Telegram.
2. Создается или находится его `app account`.
3. Telegram привязывается к аккаунту.
4. Product bot отправляет:
   - reminder
   - digest
   - “вернись к правилу”
   - “у тебя есть запись в процессе”
5. Кнопка в сообщении открывает mini app в нужной точке.

## Что реально уходит в Telegram

Да:
- daily/weekly digest
- reminder вернуться
- уведомление о новом достижении
- notification о незавершенном правиле
- link на конкретный экран

Нет:
- длинное чтение правила
- полноценный social layer
- тяжелая настройка профиля
- админка

## Source of truth для задач

Для нашей текущей системы:

- **CRM board** = главный human-facing источник состояния работ
- **GitHub** = источник кода, веток, PR и review
- **orchestrator memory** = operational mirror, а не главный truth

То есть orchestrator не должен владеть задачами один.

## GitHub automation policy

Можно автоматизировать без ручного gate:
- создать issue
- создать branch
- открыть draft PR
- синхронизировать комментарии
- обновить статус в CRM

Нельзя без человека:
- merge
- deploy production
- менять billing / pricing
- удалять данные
- делать destructive database actions

## Где Telegram реально дает ценность

Самые сильные сценарии Telegram:
- вернуть человека в продукт
- напомнить о незавершенном шаге
- показать короткий digest
- дать быстрый deep link в mini app

Слабые сценарии Telegram:
- long-form consumption
- настройка и исследование библиотеки
- чтение длинных обсуждений
- полноценный work surface

## Вывод

Правильная модель такая:

- **mini app = основной продукт**
- **product bot = уведомления, возврат, companion layer**
- **dev orchestrator = внутренняя система разработки**

Именно в таком разделении Telegram усиливает продукт, а не размывает его.
