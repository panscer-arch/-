# Component Spec

## Purpose

Этот документ фиксирует общие правила для компонентов design system `Quiet System`.

Задача: чтобы экранные макеты и код строились из одной логики, а не из случайного набора элементов.

---

## 1. App shell

### Sidebar

Содержит:

- logo / product name
- краткое описание
- primary navigation
- secondary navigation / settings

Правила:

- sidebar спокойная, не декоративная
- active state мягкий, а не агрессивный
- не перегружать иконками

### Topbar

Содержит:

- page title
- short subheading
- notifications shortcut
- profile shortcut

Правила:

- topbar не должна спорить с hero
- справа только действительно важные actions

### Mobile bottom nav

Содержит только ключевые разделы:

- dashboard
- library
- diary
- feed
- profile

---

## 2. Hero

Роль:

- самый сильный блок главного экрана

Содержит:

- имя / статус
- уровень
- прогресс
- основной CTA
- вторичный CTA

Правила:

- hero всегда крупнее других секций
- в hero не больше двух CTA
- не делать hero баннером без практической пользы

---

## 3. Quick action tile

Роль:

- быстрый переход к частым действиям

Содержит:

- короткое название действия
- optional short helper

Правила:

- не больше 4 в одной зоне
- действия должны быть глагольными
- action tile не должен быть декоративной карточкой

---

## 4. Section header

Содержит:

- kicker
- title
- short description
- optional action link

Правила:

- каждый section header должен отвечать на вопрос `что это и зачем`
- description короткий и полезный
- без маркетингового пафоса

---

## 5. Stat tile

Содержит:

- label
- main value
- helper text

Правила:

- одна метрика = одна плитка
- helper не должен быть длинным
- использовать для progress / signals / overview, но не везде подряд

---

## 6. Rule card

Содержит:

- title
- summary
- format
- duration
- difficulty
- tags
- status
- primary CTA

Правила:

- карта компактная
- summary короткий
- статус виден сразу
- не перегружать pills
- CTA один главный, остальные вторичные

---

## 7. Diary entry card

Содержит:

- title
- format
- privacy
- optional rule link
- text fragment
- date

Правила:

- text-first
- тихая визуальная подача
- минимум цветового шума

---

## 8. Feed post card

Содержит:

- author
- level
- achievements count
- body
- optional linked rule
- social actions

Правила:

- главный акцент — тело поста
- author meta компактная
- реакции не должны быть визуально громче текста

---

## 9. Notification item

Содержит:

- type
- read/unread state
- title
- body
- timestamp

Правила:

- легко сканируется списком
- new state виден мгновенно
- не превращать notification center в визуальную кашу

---

## 10. Achievement block

Содержит:

- achievement title
- description
- XP reward
- optional milestone context

Правила:

- achievements поддерживают progress loop
- не делать их главным содержанием экрана, кроме страницы достижений

---

## 11. Buttons

### Primary

Для главного действия в зоне.

Примеры:

- `Продолжить изучение`
- `Открыть правило`
- `Сохранить запись`

### Secondary

Для поддерживающих действий.

Примеры:

- `В избранное`
- `Открыть позже`

### Ghost

Для тихих вспомогательных действий.

### Danger

Для удаления и потенциально разрушительных действий.

Правила:

- один primary на секцию
- secondary не должен спорить с primary

---

## 12. Inputs and forms

Форма должна включать:

- label
- field
- helper / error
- submit

Правила:

- placeholder не заменяет label
- error короткий и конкретный
- submit понятный и один главный

---

## 13. Pills and badges

Используются для:

- format
- status
- category
- difficulty
- privacy

Правила:

- не злоупотреблять
- не превращать экран в суп из бейджей
- текст всегда важнее цвета

---

## 14. Empty states

Каждый empty state должен содержать:

- title
- short explanation
- next action

Правила:

- не шутить ради шутки
- не быть абстрактным
- всегда вести к полезному действию

---

## 15. Loading and error states

### Loading

- layout не должен прыгать
- skeleton или stable placeholder

### Error

- короткое объяснение
- одно понятное следующее действие

---

## 16. Copy system

Общие правила:

- utility-first
- без рекламной риторики
- короткие формулировки
- один блок = одна мысль

Для продукта Лайфкодинг:

- писать спокойно
- без мистического языка
- без пафоса
- без generic startup tone

---

## 17. Anti-patterns

- слишком много карточек одинаковой важности
- слишком много акцентных цветов
- перегрузка pills и badges
- длинные marketing-style заголовки на product screens
- слабая иерархия CTA
- шумные surfaces без функции

---

## 18. Ready for implementation

Когда компонент можно кодить:

- понятна роль
- понятен content model
- понятна CTA hierarchy
- понятны desktop/mobile states
- понятны empty/loading/error states

Только после этого компонент идёт в реализацию.
