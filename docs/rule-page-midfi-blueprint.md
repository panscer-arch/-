# Rule Page Mid-Fi Blueprint

## Goal

Страница правила — главный экран изучения и применения одного конкретного правила.

Экран должен отвечать на вопрос:

`Как мне это понять, проверить и встроить в свою жизнь?`

## Visual thesis

`Не статья, а спокойный экран осмысления и действия`

## Hierarchy

### 1. Header

Содержит:

- title
- summary
- category
- format
- duration
- difficulty
- user status

### 2. Main content

Поддерживает:

- аудио
- видео
- текст
- схему

Контент должен занимать центральное место, но не изолироваться от действий.

### 3. Key theses

Короткий блок:

- 3–5 тезисов
- легко считывается
- помогает удержать смысл

### 4. Life translation

Блок:

- как это проявляется в жизни
- где чаще всего замечается
- где человек ошибается

### 5. Self-check

Блок:

- что проверить на себе
- мини-практика
- короткие вопросы

### 6. Action area

Главные действия:

- `Отметить как изученное`
- `Отметить как применённое`
- `Добавить запись в дневник`

Вторичные:

- `В избранное`

### 7. Related rules

2–4 правила рядом по смыслу.

### 8. Discussion layer

- комментарии
- social proof
- счётчик изучивших правило

## Desktop composition

- верхний блок с title и metadata
- основная медиа/текстовая зона
- theses
- life translation
- self-check
- action area
- related rules
- discussion

## Mobile composition

Последовательность:

1. header
2. media player / main content
3. theses
4. life translation
5. self-check
6. primary actions
7. related rules
8. discussion

## Action rules

Это не должны быть случайные кнопки внизу экрана.

Action area обязана:

- читаться как естественное продолжение изучения
- быть видимой и на desktop, и на mobile
- вести пользователя в дневник

## Empty states

### No discussion

- спокойно показать, что обсуждение пока пусто
- предложить стать первым участником

### No related rules

- не ломать экран, а скрыть блок или заменить переходом в библиотеку

## Copy rules

- короткие meaningful summaries
- без инфошума
- всё должно вести к применению

## Anti-patterns

- не превращать страницу в длинное полотно без ориентиров
- не прятать actions слишком далеко
- не перегружать metadata и badges

## Ready for next step

После этого blueprint можно переходить к:

1. визуальному mid-fi макету страницы правила
2. actions component spec
3. diary transition flow
