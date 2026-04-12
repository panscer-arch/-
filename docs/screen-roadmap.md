# Screen Roadmap

## Purpose

Этот документ фиксирует:

- какие экраны входят в MVP
- в каком порядке их проектировать
- что именно должно быть готово до перехода в код
- какие экраны являются ядром, а какие вторичным слоем

Главная цель: прекратить хаотичное обсуждение и двигаться по понятной дорожной карте.

---

## Product core

Ядро Лайфкодинга строится вокруг цикла:

`изучить -> применить -> зафиксировать -> увидеть прогресс`

Поэтому главные экраны MVP:

1. `Dashboard`
2. `Library`
3. `Rule Page`
4. `Diary`

Второй слой:

5. `Feed`
6. `Achievements`
7. `Notifications`
8. `Profile / Settings`

Входной слой:

9. `Auth`
10. `Onboarding`

---

## Working sequence

Правильный порядок работы по каждому экрану:

1. screen logic
2. low-fi wireframe
3. mid-fi blueprint
4. design system alignment
5. implementation
6. responsive pass
7. empty / loading / error states

Пока экран не прошёл шаги 1–4, кодить его рано.

---

## Priority map

### P0 — Product core

#### 1. Dashboard

Роль:

- центральный экран продукта
- показывает состояние пользователя
- даёт следующий шаг

Обязательно должно быть:

- hero / status
- quick actions
- focus overview
- recommended next
- recent diary
- achievements
- notifications
- community preview

Definition of done:

- есть desktop composition
- есть mobile composition
- hero — главный блок экрана
- recommendations сильнее social blocks
- есть empty states
- есть clear CTA hierarchy

---

#### 2. Library

Роль:

- каталог правил
- точка выбора следующего материала

Обязательно должно быть:

- search
- categories
- filters
- sorting
- featured rule
- rules list
- readable statuses

Definition of done:

- рабочая иерархия выбора
- featured rule не ломает список
- фильтры не доминируют над контентом
- mobile flow быстрее и короче desktop
- есть no-results state

---

#### 3. Rule Page

Роль:

- главный экран изучения одного правила
- соединяет контент и действие

Обязательно должно быть:

- title / summary / metadata
- media / text block
- theses
- life translation
- self-check
- primary actions
- related rules
- discussion

Definition of done:

- это не выглядит как просто статья
- есть переход к diary
- action area видна и понятна
- mobile не прячет главный CTA
- контент не оторван от применения

---

#### 4. Diary

Роль:

- личная фиксация опыта
- превращение правила в личное наблюдение

Обязательно должно быть:

- header
- new entry flow
- privacy
- format
- rule relation
- list / calendar / timeline
- entry cards

Definition of done:

- экран ощущается тихим и личным
- форма записи не тяжёлая
- связь с правилом проста и понятна
- есть empty state для первой записи
- mobile flow не мешает писать

---

### P1 — Secondary product layer

#### 5. Feed

Роль:

- социальный слой
- обмен опытом применения правил

Обязательно должно быть:

- feed filters
- composer
- post card
- linked rule context
- comments / likes / save / report

Definition of done:

- акцент на смысле поста
- social mechanics вторичны
- нет ощущения шумной соцсети

---

#### 6. Achievements

Роль:

- визуализировать прогресс и награды

Обязательно должно быть:

- список достижений
- XP reward
- milestones
- progress framing

Definition of done:

- achievements поддерживают ядро, а не заменяют его
- экран не превращается в витрину бейджей

---

#### 7. Notifications

Роль:

- собирает входящие сигналы

Обязательно должно быть:

- types
- read/unread state
- timestamps
- deeplink logic

Definition of done:

- легко сканируется
- не перегружен
- useful empty state

---

#### 8. Profile / Settings

Роль:

- личная идентичность
- управление средой

Обязательно должно быть:

- avatar / name / level
- privacy
- notifications
- language
- account actions

Definition of done:

- профиль не выглядит как соцсеть
- настройки читаются как рабочая среда

---

### P2 — Entry layer

#### 9. Auth

Роль:

- вход и регистрация

Обязательно должно быть:

- login
- register
- forgot password
- validation
- error states

Definition of done:

- формы ясные
- нет маркетингового шума
- mobile работает чисто

---

#### 10. Onboarding

Роль:

- мягко ввести в продукт

Обязательно должно быть:

- name / nickname
- topics of interest
- privacy defaults
- notification preferences

Definition of done:

- onboarding короткий
- не перегружает
- ведёт в dashboard

---

## Design execution order

Если двигаться правильно, порядок макетирования такой:

1. `Dashboard`
2. `Library`
3. `Rule Page`
4. `Diary`
5. `Feed`
6. `Achievements`
7. `Notifications`
8. `Profile / Settings`
9. `Auth`
10. `Onboarding`

Почему именно так:

- первые четыре экрана собирают ядро продукта
- всё остальное зависит от уже принятой визуальной логики

---

## Coding order

После макетов код идёт не в том же порядке 1-в-1, а так:

1. design tokens
2. app shell
3. dashboard
4. library
5. rule page
6. diary
7. feed
8. profile/settings
9. achievements / notifications
10. auth / onboarding integration polish

---

## Rules for moving forward

Перед тем как идти к следующему экрану, текущий экран должен иметь:

- purpose
- block order
- CTA hierarchy
- desktop layout
- mobile layout
- empty states
- copy direction

Если этого нет, экран считается неготовым.

---

## Immediate next step

На текущем этапе уже зафиксированы:

- `docs/mvp-spec.md`
- `docs/dashboard-midfi-blueprint.md`
- `docs/library-midfi-blueprint.md`
- `docs/rule-page-midfi-blueprint.md`
- `docs/diary-midfi-blueprint.md`

Следующий рабочий шаг:

1. закрыть `Feed` blueprint
2. затем зафиксировать `design system component spec`
3. потом переходить к visual mid-fi dashboard

---

## Practical decision

Если не расползаться, рабочий маршрут сейчас такой:

`Feed blueprint -> component spec -> visual dashboard -> code`

Это и есть текущая дорожная карта проекта.
