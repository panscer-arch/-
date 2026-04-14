# Auth & Identity Hardening

## Что закрыли

### 1. Telegram auth contract

`/api/auth/telegram` теперь возвращает нормализованный payload:

- `user`
- `session`
- `access_token`
- `refresh_token`
- `isNewUser`

Это убирает разъезд между server response и клиентским `useAuth`.

### 2. Telegram credential derivation

Убран самый грубый вариант с явной password-схемой от куска bot token.

Теперь credential derivation строится через secret-based HMAC:

- `TELEGRAM_AUTH_SECRET` если задан
- иначе fallback на `TELEGRAM_BOT_TOKEN`

Это не идеальный финальный auth layer, но уже заметно безопаснее и не светит схему наружу.

### 3. Canonical profile contract

Введен единый profile helper:

- `buildDefaultProfile`
- `normalizeProfile`

`/api/profile` теперь:

- умеет bootstrap-ить профиль, если он еще не создан
- возвращает один и тот же shape для app
- перестает разъезжаться по format / naming внутри UI

### 4. useAuth больше не лезет напрямую в таблицу profiles

Клиентский hook теперь идет через `/api/profile`, а не руками дублирует SQL-логику.

Это важно, потому что profile contract должен жить на сервере, а не в нескольких фронтовых местах сразу.

### 5. Protected route surface

В middleware зафиксирован реальный protected page surface:

- `/diary`
- `/profile`
- `/notifications`
- `/achievements`
- `/settings`
- `/feed/new`

Если Supabase включен и пользователя нет, эти страницы больше не считаются “публичными по умолчанию”.

## Что это дает

- меньше шансов на silent auth bugs
- меньше расхождения между login response и клиентом
- более понятный identity/profile contract
- более взрослое поведение приватных страниц

## Что еще не идеально

- это не финальная production auth architecture
- Telegram auth все еще не переведен на отдельный first-class provider model
- middleware warning `middleware -> proxy` еще отдельно надо убрать

Но для текущего уровня это уже нормальный шаг от демо-состояния к launch-ready auth layer.
