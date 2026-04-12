# API Map

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

## Me

- `GET /api/me`
- `PATCH /api/me/profile`
- `PATCH /api/me/settings`

## Dashboard

- `GET /api/dashboard`

## Rules

- `GET /api/rules`
- `GET /api/rules/:slug`
- `POST /api/rules/:id/favorite`
- `POST /api/rules/:id/progress/start`
- `POST /api/rules/:id/progress/learned`
- `POST /api/rules/:id/progress/applied`

## Diary

- `GET /api/diary`
- `POST /api/diary`
- `GET /api/diary/:id`
- `PATCH /api/diary/:id`
- `DELETE /api/diary/:id`

## Feed

- `GET /api/feed`
- `POST /api/feed`
- `POST /api/feed/:id/comments`
- `POST /api/feed/:id/like`
- `POST /api/reports`

## Supporting modules

- `GET /api/achievements`
- `GET /api/notifications`
- `POST /api/notifications/read`
- `GET /api/recommendations`
