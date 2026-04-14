# Lifecoding Agent Guide

Этот репозиторий уже содержит большую библиотеку ролей в `.claude/agents/`, но для повседневной работы нужен короткий набор.

## Recommended Core

Используй эти 7 ролей как основной стек проекта:

1. `orchestrator`
   Координирует большие задачи и держит общий pipeline.

2. `product-manager`
   Держит границы MVP, scope и приоритеты.

3. `ux-architect`
   Собирает логику экрана, flow и структуру.

4. `ui-designer`
   Доводит визуальную систему и UI polish.

5. `frontend-developer`
   Реализует экраны, состояния и навигацию.

6. `minimal-change-engineer`
   Делает точечные правки без расползания diff.

7. `reality-checker`
   Проверяет, что решение реально готово, а не только выглядит готовым.

## Where The Full Library Lives

- Source library: `.claude/agents/`
- Curated stack: `.claude/AGENT_STACK.md`
- Starter pack: `.claude/STARTER_PACK.md`

## How To Use In Practice

Для Lifecoding используй такие связки:

### New screen

1. `ux-architect`
2. `ui-designer`
3. `frontend-developer`
4. `reality-checker`

### Product decision

1. `product-manager`
2. `ux-architect`
3. `reality-checker`

### Careful fix

1. `minimal-change-engineer`
2. `reality-checker`

### Large feature

1. `orchestrator`
2. `product-manager`
3. `ux-architect`
4. `frontend-developer`
5. `reality-checker`

## Important

Эти агенты не являются отдельными демонами, которые нужно запускать в фоне.
В Codex-процессе они работают как repo-local роли и инструкции: ты выбираешь нужную роль под задачу, а не поднимаешь отдельный сервер для каждой.
