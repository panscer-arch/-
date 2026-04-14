# Launch Blocker Triage

## Короткий вердикт

Сейчас проект находится в состоянии `go for staged beta`, но еще не в состоянии `go for public open launch`.

Это значит:

- локально и в preview проект уже достаточно собран, чтобы прогнать живой beta-pass;
- `typecheck`, `build`, `smoke`, `preflight` и `rc` уже проходят;
- но перед публичным доменом нужно закрыть несколько launch-blocker пунктов.

## Что уже закрыто

- `34. alpha click-pass`
- `35. beta state-pass`
- `36. visual regression`
- `37. accessibility`

## Что считается стоп-релизом

### P0

1. `favorites` и `rule-progress` не должны оставаться на общем demo-user path для публичного релиза.
   Сейчас в fallback-режиме это безопасно только как demo/preview, но не как настоящий multi-user launch.

2. Protected auth surface не должен работать в fail-open режиме на production-конфигурации.
   Если env не заданы, preview еще может жить как demo, но public launch должен идти только с нормальной auth/env конфигурацией.

3. `analytics/events` sink не должен оставаться публично writable без минимального guard/rate limit в production.
   Для внутренней preview-среды это терпимо, для внешнего запуска уже нет.

### P1

1. Telegram native back behavior еще не доведен до системного уровня.
2. Верхняя safe-area и конфликт sticky controls на некоторых Telegram/mobile экранах еще требуют финального ручного прогона.
3. Settings / profile / public feed privacy boundary уже лучше, но нуждаются в финальном ручном signoff перед доменом.

## Что можно оставить на beta-хвост

- более глубокий accessibility pass;
- screen-reader polish beyond baseline;
- richer Telegram-native polish;
- advanced abuse-protection beyond baseline;
- UX-polish вокруг cold-start community.

## Owner map

### App / code owner

- demo-user isolation
- auth hardening
- events sink guard
- Telegram back wiring
- safe-area/sticky polish

### Release / infra owner

- задать production env в Vercel
- проверить домен и callback URLs
- запустить `npm run rc` уже в env-подобной конфигурации

### Human QA signoff

- ручной проход по `profile`, `settings`, `feed/new`, `diary/new`, `library/[id]`
- ручной проход в Telegram container
- финальная проверка приватного/публичного контента

## Signoff criteria

Можно честно идти в выкладку, если:

1. Заданы production env.
2. `favorites/progress` больше не делят один demo-user path на launch-сценарии.
3. Events sink защищен хотя бы baseline-guard слоем.
4. Protected surfaces проверены с реальным auth path.
5. Прогнаны `preflight`, `typecheck`, `build`, `smoke`, `rc`.
6. Есть финальный ручной mobile/Telegram smoke pass.

## Handoff

Следующий практический шаг:

1. закрыть P0 hardening хвост;
2. прогнать финальный Telegram/mobile pass;
3. только потом выкатывать на Vercel и сажать домен.
