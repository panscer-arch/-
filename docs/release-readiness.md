# Release Readiness

## Цель

Собрать один понятный релизный контур для первого внешнего выката `Lifecoding`, чтобы было ясно:

- что деплоим
- откуда деплоим
- какие env обязательны
- как проверяем релиз
- как откатываемся
- куда смотреть, если что-то сломалось

## 1. Единый deploy path

Первым наружу релизим только mini app:

- app source: `/Users/digitex/Desktop/v0-telegram-mini-app-dashboard-main`
- target platform: `Vercel`
- primary domain target: `lifecoding.app`

Монорепа `/Users/digitex/Desktop/Проект2` пока остается:

- product docs
- CRM/checklist
- Supabase migrations
- architectural source of truth

Решение:

- наружу выкатываем один Next.js app
- production deploy path не размазываем между mini app, CRM и orchestrator

## 2. Env contract

Обязательные env для первого нормального релиза:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Условно обязательные, если включаем Telegram-layer:

- `TELEGRAM_BOT_TOKEN`

Правило:

- dev = локальные env
- prod = только через Vercel project settings
- секреты не храним в git, docs только перечисляют contract

## 3. Pre-release smoke checklist

Перед релизом должны пройти:

- app открывается
- onboarding не падает
- library открывается и фильтры живы
- rule page открывается
- progress actions живы
- diary save живой
- dashboard живой
- feed живой
- profile / notifications / achievements живы
- settings pages не ломаются
- API routes отдают честные ответы

Быстрый автоматический прогон:

- `npm run smoke`
- `npm run build`

После этого обязателен ручной проход по главным экранам.

## 4. Rollback plan

Откат нужен для трех вещей:

- код
- env
- schema / migrations

Решение:

- код откатываем через предыдущий deployment на Vercel
- env откатываем через Vercel project settings
- destructive migrations не катим без отдельного ручного gate
- baseline migrations должны быть additive-first

Правило:

- если migration risky, rollout не делаем в один шаг с UI-изменением

## 5. Monitoring и alerts

Первый baseline:

- Vercel deployment status
- server/API errors
- failed auth
- failed Telegram auth/webhook path
- database errors

Первый уровень допустим без тяжелой observability-платформы, но не без сигналов вообще.

## 6. Support / investigation runbook

При инциденте идем в таком порядке:

1. проверить deployment status
2. проверить env
3. проверить critical API routes
4. проверить Supabase connectivity
5. проверить auth path
6. проверить recent code changes / last deploy

Для первого релиза этого достаточно, если путь закреплен заранее и не размазан между несколькими фронтами.

## Итог

23-я задача считается выполненной, если:

- есть один deploy path
- есть env contract
- есть release checklist
- есть rollback logic
- есть monitoring baseline
- есть support runbook

То есть не просто “умеем задеплоить”, а “понимаем, как пережить первый реальный релиз”.
