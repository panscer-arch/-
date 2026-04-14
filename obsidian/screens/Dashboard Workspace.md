# Dashboard Workspace

Главный рабочий узел по экрану `Dashboard`.

Связанные документы:
- [[docs/dashboard-midfi-blueprint|Dashboard Blueprint]]
- [[docs/component-spec|Component Spec]]
- [[docs/screen-roadmap|Screen Roadmap]]
- [[obsidian/notes/Figma Workspace|Figma Workspace]]
- [[obsidian/notes/v0 Workspace|v0 Workspace]]
- [[obsidian/notes/Research Log|Research Log]]

Что здесь фиксировать:
- какой вариант дашборда сейчас основной
- чем отличается desktop от Telegram Mini App
- что не работает в hero
- какие CTA оставляем
- какие блоки вторичны

Текущий фокус:
- собрать сильный дашборд без generic SaaS-ощущения
- сохранить `Quiet System`
- найти нормальный путь через `v0 -> отбор -> Figma -> код`

## Текущее состояние

- blueprint есть: [[docs/dashboard-midfi-blueprint|Dashboard Blueprint]]
- quiet-system правила есть: [[docs/component-spec|Component Spec]]
- `v0` уже дал mobile dashboard, но он пока слишком шаблонный
- в Figma уже есть несколько рабочих фреймов, но качество пока неровное

## Основные проблемы

- hero недостаточно сильный
- много одинаковых карточек
- generic `v0` feel
- слабая связь между личным progress loop и visual hierarchy

## Рабочий план

1. Задать `v0` более жесткий prompt на основе repo и `Quiet System`
2. Получить 2-3 новых направления
3. Выбрать один основной direction
4. Перенести выбранную direction в Figma
5. Довести до чистой мобильной версии
6. Только после этого переносить в основной код

## Что считаем хорошим результатом

- экран не похож на обычный SaaS dashboard
- есть один читаемый главный маршрут
- progress ощущается спокойно, а не как gamification-first
- Telegram Mini App версия не теряет зрелость продукта
