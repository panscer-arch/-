# Privacy & Security Baseline

## Цель

До публичного релиза зафиксировать минимальный baseline по privacy и security, чтобы:

- понимать, какие данные у нас чувствительные
- не смешивать private и public слои
- знать, как удалять и экспортировать данные
- не оставить bot / auth / public feed без базовой защиты

## 1. Карта чувствительных данных

Что считаем чувствительными данными:

- email / login identity
- linked Telegram identity
- private diary entries
- user progress history
- notification preferences
- bot-facing auth state

Что не считаем чувствительными в той же степени:

- публичный username
- публичный profile name
- public feed posts
- derived public level / visible achievements

Правило:

- private diary никогда не становится public автоматически
- feed post живет как отдельная публичная сущность
- identity layer не протекает в public profile

## 2. Delete / export baseline

Для первого нормального продукта нужна хотя бы определенная логика:

- экспорт профиля и личных записей
- удаление аккаунта
- отвязка Telegram identity
- удаление или де-публикация public posts

Решение:

- сначала делаем operator-assisted flow, не full self-serve
- export = profile + diary + progress summary + linked identities metadata
- delete = soft-delete / revocation-first, не мгновенное уничтожение всего без следа

## 3. Session model

Нужно разделить:

- browser/web session
- mini app bootstrap session
- linked identity session state

Baseline:

- app account остается root identity
- Telegram = linked identity
- истекшие сессии должны честно ронять пользователя в re-auth
- опасные изменения профиля и привязок не должны жить в бесконечной сессии

## 4. Abuse / spam baseline

Для public layer нужны минимальные ограничения:

- rate limiting на post/create/reaction/report
- flood protection на повторяющиеся действия
- базовый report path
- защита от массового шума в public feed

Для mini app этого достаточно на старте:

- per-user rate limits
- per-IP / per-session soft limits там, где есть web auth
- server-side validation для public actions

## 5. Secrets handling

Правила:

- секреты не логируем
- секреты не храним в git
- dev / prod secrets разделяем
- rotation описана хотя бы в runbook

Что сюда входит:

- Supabase keys
- Telegram bot token
- любые GitHub automation tokens

## 6. Bot / GitHub safety gates

Опасные команды не должны выполняться “по одному сообщению”.

Правило:

- destructive actions только с human gate
- GitHub merge / deploy / billing / destructive data operations не автоматизируются без explicit approval
- audit trail должен оставаться либо в CRM, либо в GitHub / orchestrator memory

## Итоговый baseline

24-я задача считается закрытой, если:

- карта чувствительных данных понятна
- private/public boundary зафиксирована
- delete/export path хотя бы определен
- session model не размазана
- abuse baseline и rate limits описаны
- secrets handling и bot safety gates зафиксированы

Это еще не “полная enterprise security”, но уже нормальная база, с которой не страшно идти к первому публичному релизу.
