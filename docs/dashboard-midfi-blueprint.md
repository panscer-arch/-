# Dashboard Mid-Fi Blueprint

## Goal

Dashboard — это центральный экран продукта. Он не должен быть мозаикой из карточек или BI-панелью.

Главная цель экрана:

- показать состояние пользователя
- подсказать следующий шаг
- дать ощущение движения

## Visual thesis

`Спокойная технологичная система личного движения`

Экран должен ощущаться:

- собранным
- взрослым
- ясным
- личным
- не перегруженным

## Hierarchy

### 1. Hero

Содержит:

- приветствие по имени
- уровень
- статус
- процент прогресса
- один главный CTA
- один вторичный CTA

Главный CTA:

- `Продолжить изучение`

Вторичный CTA:

- `Добавить запись`

### 2. Quick actions

Короткий набор действий:

- `Библиотека`
- `Дневник`
- `Лента`
- `Достижения`

### 3. Focus overview

Три компактных блока:

- progress
- diary activity
- signals

### 4. Recommended next

2–4 правила с краткой причиной рекомендации.

### 5. Recent diary + achievements

Левая колонка:

- последние записи

Правая колонка:

- свежие достижения
- следующий milestone

### 6. Community + notifications

Нижняя часть экрана:

- короткая community activity
- уведомления

Оба блока вторичны по отношению к hero и recommendations.

## Desktop composition

- верхняя панель
- широкий hero-блок
- строка быстрых действий
- строка из 3 обзорных блоков
- двухколоночная зона `recommended next + recent study`
- двухколоночная зона `diary + achievements`
- двухколоночная зона `community + notifications`

## Mobile composition

Последовательность:

1. hero
2. quick actions
3. recommended next
4. progress
5. diary
6. achievements
7. notifications
8. community
9. bottom nav

Mobile должен быстрее вести к действию, чем desktop.

## Copy rules

- utility-first
- без рекламных формулировок
- короткие подзаголовки
- каждое название блока отвечает на вопрос: `что это и зачем`

## Empty states

### No diary entries

- объяснить, зачем нужен дневник
- предложить первую запись

### No recommendations

- отправить в библиотеку

### No notifications

- спокойно сообщить, что новых сигналов нет

## Component guidance

- hero — крупная surface
- quick actions — короткие action tiles
- overview — 3 stat surfaces
- recommendations — rule cards
- diary — тихие text-first cards
- achievements — компактный milestone block
- notifications — list format

## Anti-patterns

- не делать всё равнозначной сеткой
- не ставить community выше recommendations
- не перегружать pills и badges
- не превращать hero в баннер ради баннера

## Ready for next step

После этого blueprint можно переходить к:

1. визуальному mid-fi макету dashboard
2. токенам и компонентам design system
3. реализации экрана в `apps/web`
