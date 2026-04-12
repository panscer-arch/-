# Recommended Agent Stack

Ниже — короткий набор ролей из `agency-agents`, которые лучше всего подходят для этого проекта.

## Core

### 1. Orchestrator
- файл: `.claude/agents/agents-orchestrator.md`
- когда использовать: если нужно разложить большую задачу по ролям и держать общий pipeline
- роль в проекте: координация `product -> design -> engineering -> testing`

### 2. Product Manager
- файл: `.claude/agents/product-manager.md`
- когда использовать: MVP scope, roadmap, фичи, приоритизация экранов и потоков
- роль в проекте: держать границы `Лайфкодинга`, чтобы мы не раздували MVP

### 3. Feedback Synthesizer
- файл: `.claude/agents/product-feedback-synthesizer.md`
- когда использовать: интервью, ранние тесты, сигналы, синтез обратной связи
- роль в проекте: превращать наблюдения по первым пользователям в конкретные продуктовые решения

## Design

### 4. UX Architect
- файл: `.claude/agents/design-ux-architect.md`
- когда использовать: screen logic, flow, IA, навигация, сценарии
- роль в проекте: не дать экранам стать просто красивыми макетами без логики

### 5. UI Designer
- файл: `.claude/agents/design-ui-designer.md`
- когда использовать: визуальная система, компоненты, отступы, иерархия, polish
- роль в проекте: доводить `Quiet System` и макеты в Figma

### 6. UX Researcher
- файл: `.claude/agents/design-ux-researcher.md`
- когда использовать: usability tests, мини-группа, сценарии интервью, вопросы
- роль в проекте: проверять понятность дашборда, библиотеки и онбординга

### 7. Brand Guardian
- файл: `.claude/agents/design-brand-guardian.md`
- когда использовать: если начинает плыть стиль, тон, палитра, типографика
- роль в проекте: держать визуальную линию `Quiet System`

## Engineering

### 8. Frontend Developer
- файл: `.claude/agents/engineering-frontend-developer.md`
- когда использовать: реализация экранов, компонентов, responsive, UI states
- роль в проекте: перенос макетов в `apps/web`

### 9. Codebase Onboarding Engineer
- файл: `.claude/agents/engineering-codebase-onboarding-engineer.md`
- когда использовать: быстро понять незнакомый участок монорепы
- роль в проекте: ускорять вход в `apps/*`, `packages/*`, orchestrator и domain-модули

### 10. Minimal Change Engineer
- файл: `.claude/agents/engineering-minimal-change-engineer.md`
- когда использовать: аккуратные точечные правки без лишних рефакторингов
- роль в проекте: безопасно дорабатывать существующее без расползания изменений

### 11. Backend Architect
- файл: `.claude/agents/engineering-backend-architect.md`
- когда использовать: API facade, orchestrator flows, Supabase integration
- роль в проекте: проектировать server-side часть без хаоса

## Testing

### 12. Reality Checker
- файл: `.claude/agents/testing-reality-checker.md`
- когда использовать: проверить, не уехали ли мы в красивые, но нереалистичные решения
- роль в проекте: приземлять продуктовые и дизайнерские идеи

### 13. Accessibility Auditor
- файл: `.claude/agents/testing-accessibility-auditor.md`
- когда использовать: цвет, контраст, states, keyboard flow, readable UI
- роль в проекте: не потерять доступность при polishing

### 14. Evidence Collector
- файл: `.claude/agents/testing-evidence-collector.md`
- когда использовать: собрать понятную фиксацию результатов теста или ревью
- роль в проекте: документировать, что именно мы проверили и что увидели

## Suggested Workflows

### New screen
1. `product-manager`
2. `design-ux-architect`
3. `design-ui-designer`
4. `engineering-frontend-developer`
5. `testing-reality-checker`

### Early user testing
1. `design-ux-researcher`
2. `product-feedback-synthesizer`
3. `product-manager`

### Big feature / system change
1. `agents-orchestrator`
2. `product-manager`
3. `engineering-backend-architect`
4. `engineering-frontend-developer`
5. `testing-evidence-collector`

## Recommended Default Set

Если держать короткое ядро, я бы оставил:
- `agents-orchestrator`
- `product-manager`
- `product-feedback-synthesizer`
- `design-ux-architect`
- `design-ui-designer`
- `design-ux-researcher`
- `engineering-frontend-developer`
- `engineering-minimal-change-engineer`
- `testing-reality-checker`
