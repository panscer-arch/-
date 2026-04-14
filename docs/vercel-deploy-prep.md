# Vercel Deploy Prep

## Статус

42-я задача считается выполненной, потому что:

- `npm run preflight` прошел
- `npm run rc` прошел
- build и smoke зеленые
- P0 release blockers уже закрыты
- onboarding/auth/release хвосты сведены в один релизный контур

## Что выкладываем

- source app: `/Users/digitex/Desktop/v0-telegram-mini-app-dashboard-main`
- platform: `Vercel`
- target domain: `lifecoding.app`

## Что выставить в Vercel

### Обязательное для production

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Обязательно, если включаем Telegram auth на первом релизе

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_AUTH_SECRET`

## Что проверить руками перед доменом

### Telegram / mobile smoke

- app открывается без пустого экрана
- onboarding проходит до первого полезного действия
- deep link в защищенный экран уводит в onboarding и потом возвращает обратно
- `Library -> Rule -> Diary -> Dashboard` проходит без тупиков
- нижний nav не конфликтует со sticky action
- safe area в верхних и нижних экранах выглядит чисто
- theme/light/dark не ломает читаемость

### Release smoke

- `/api/health` отвечает
- `/api/profile`, `/api/diary`, `/api/notifications` не падают
- feed, library, achievements, settings открываются
- logout/login path не выглядит фальшивым

## Go / No-Go

### Go, если

- env заведены в Vercel
- preview deploy поднялся
- `npm run rc` зеленый
- ручной mobile/Telegram проход зеленый

### No-Go, если

- production env отсутствуют
- Telegram auth включаем, но секреты не заведены
- preview boot падает
- ручной проход показывает сломанный onboarding/deep link

## Последний шаг

Порядок такой:

1. import project в Vercel
2. завести env
3. поднять preview
4. вручную пройти smoke
5. только потом цеплять домен `lifecoding.app`

## Итог

До реального deploy остался уже не продуктовый код, а операторский шаг:

- занести env
- поднять preview на Vercel
- сделать ручной signoff
- переключить домен
