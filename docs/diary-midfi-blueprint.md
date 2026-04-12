# Diary Mid-Fi Blueprint

## Goal

Дневник — это экран фиксации личного опыта, а не просто заметки.

Экран должен помогать:

- быстро создать запись
- связать запись с правилом
- удобно возвращаться к прошлым наблюдениям

## Visual thesis

`Самый тихий и самый личный экран системы`

## Hierarchy

### 1. Header

Содержит:

- title
- краткое описание
- CTA `Новая запись`
- поиск
- фильтры

### 2. View modes

Режимы:

- `Список`
- `Календарь`
- `Таймлайн`

### 3. Composer

Форма записи должна включать:

- title
- format
- privacy
- rule relation
- tags
- body

### 4. Entries stream

Каждая запись показывает:

- title
- format
- privacy
- rule link
- короткий текстовый фрагмент
- date

### 5. Favorites / pinned

Избранные записи — отдельный небольшой блок, не доминирующий над основным потоком.

## Desktop composition

- header
- controls row
- composer
- entries list
- favorites block

## Mobile composition

1. header
2. new entry CTA
3. compact filters
4. view mode switch
5. composer
6. entries list

## Entry card rules

Запись должна быть:

- text-first
- лёгкой для сканирования
- спокойной

Не должна быть:

- шумной
- перегруженной цветом
- перегруженной служебной метой

## Privacy rules

Приватность — важная часть экрана, но она не должна утяжелять форму.

Поддержка:

- `Только я`
- `Друзья`
- `Все`

## Empty states

### No entries

- объяснить ценность дневника
- предложить первую запись

### No favorites

- не выделять это как проблему
- просто спокойно показать отсутствие

## Copy rules

- дневник говорит с пользователем тихо
- минимум системного шума
- главное — сохранить мысль и контекст

## Anti-patterns

- не делать дневник похожим на соцленту
- не делать форму тяжёлой
- не прятать связь с правилом слишком глубоко

## Ready for next step

После этого blueprint можно переходить к:

1. визуальному mid-fi макету дневника
2. entry card component spec
3. rule-to-diary interaction flow
