# Research Log

Лог наблюдений по продукту и экранам.

Связанные узлы:
- [[obsidian/05 Research|Research]]
- [[obsidian/screens/Dashboard Workspace|Dashboard Workspace]]
- [[obsidian/notes/Telegram Mini App|Telegram Mini App]]
- [[obsidian/notes/v0 Workspace|v0 Workspace]]

Что сюда писать:
- заметки после просмотра экранов
- реакции на `v0` варианты
- выводы после ранних тестов
- гипотезы по улучшению dashboard

Шаблон записи:
- дата
- экран
- что увидели
- что не сработало
- гипотеза
- следующее действие

---

## 2026-04-12 — Dashboard / v0 Telegram Mini App

- экран: `Dashboard`, mobile Telegram Mini App
- источник: `v0` generation + GitHub repo `v0-telegram-mini-app-dashboard`

### Что увидели
- структура экрана в целом рабочая: hero, quick actions, stats, recommendations, diary, achievements, notifications, community
- `v0` собрал технически удобную основу на `Next + Tailwind + shadcn`
- mobile-first направление для Telegram Mini App считывается

### Что не сработало
- визуально получилось слишком generic и шаблонно
- палитра не взята из `Quiet System`
- hero слишком обычный и не ощущается как сильная точка возврата
- много одинаковых карточек с равным визуальным весом
- слишком заметно ощущение стандартного `v0/shadcn` результата

### Гипотеза
- `v0` нужно использовать не как автора финального дизайна, а как генератор направлений
- лучший процесс: `docs + palette + жесткий prompt -> 3 directions -> отбор -> Figma -> код`
- если прямо требовать repo palette, quiet tone и запрет на generic SaaS UI, результат будет сильно лучше

### Следующее действие
- написать новый жесткий prompt для `v0`
- выбрать один основной direction для dashboard
- перенести уже не raw output, а отобранную direction в Figma
