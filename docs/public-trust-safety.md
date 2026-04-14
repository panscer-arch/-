# Public Trust & Safety

## Цель

Закрыть последний взрослый слой перед внешним запуском community/feed: не дать private-слою случайно утечь в public, защититься от примитивного abuse и дать человеку понятный путь на export/delete/unlink.

## Что выбрано

### 1. Public feed не должен раскрывать identity по умолчанию

Если `profile.is_public = false`, то public feed:

- не показывает `@username`
- не показывает avatar
- подменяет имя на нейтральное `Участник сообщества`

Это мягкая privacy boundary до полноценной social/privacy системы.

### 2. Publication flow должен быть понятен человеку

Перед созданием public post человек явно подтверждает, что запись уйдет в общую ленту.

Это закрывает риск “я думал, что это как дневник”.

### 3. Public actions получают базовый rate limit

До полноценного anti-abuse слоя вводим baseline:

- Telegram auth attempts rate-limited
- create post rate-limited
- reaction toggles rate-limited
- operator requests rate-limited

Это не enterprise WAF, но уже достаточно, чтобы launch не был полностью голым.

### 4. Export / delete / unlink должны существовать уже на MVP

На первом релизе делаем operator-assisted path:

- пользователь отправляет запрос
- запрос получает request id
- обработка идет вручную

Это лучше, чем обещать действие, которого не существует.

## Что это дает

- quieter public boundary
- меньше accidental oversharing
- меньше примитивного abuse
- уже существует честный путь для privacy-sensitive операций
