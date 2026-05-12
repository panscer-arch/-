<!--
Sync Impact Report
- Version change: template -> 1.0.0
- Modified principles: introduced initial constitution from template
- Added sections: Product Boundaries, Workflow & Review Gates, Governance
- Removed sections: template placeholders
- Templates requiring updates:
  - ✅ reviewed: .specify/templates/plan-template.md
  - ✅ reviewed: .specify/templates/spec-template.md
  - ✅ reviewed: .specify/templates/tasks-template.md
  - ✅ reviewed: README.md
- Follow-up TODOs:
  - Decide whether the first delivery surface is web-only or web + Telegram operator layer in MVP
-->
# Serenko System Constitution

## Core Principles

### I. Portfolio-First Clarity
The product MUST give a clear cross-project view before it goes deeper into any
single project. Every feature must improve at least one of these operator
questions: what is moving, what is blocked, what needs attention now, and what
changed since the last review. If a feature adds detail without improving
decision clarity, it does not belong in the MVP.

### II. One Operating Record Per Project
Each project MUST have one canonical operating record that combines product
context, delivery state, marketing activity, notable events, and current next
steps. Users must not be forced to reconcile the same status across scattered
views. Derived views are allowed, but they must read from the same underlying
project record.

### III. Spec Before Build
Work MUST follow the Spec Kit sequence before implementation:
constitution, specification, plan, tasks, then build. New screens, workflow
changes, and data model additions require a written spec that explains the user
need, scope boundaries, assumptions, and measurable success criteria. Coding is
not the place where product scope is discovered.

### IV. Modular Expansion Without Rework
The system MUST support adding new projects without redesigning the operating
model. Shared concepts such as project health, stage, owner, priority,
marketing actions, risks, and milestones must use reusable structures rather
than hardcoded per-project logic. Project-specific fields are allowed only when
the shared model cannot express a real business need.

### V. Reality Over Theater
Status must reflect real execution, not presentation polish. Health states,
progress updates, and milestone movement MUST be grounded in explicit evidence:
completed outcomes, dated updates, blockers, owners, and next actions. Any
dashboard element that can look "green" while the project is actually stalled
should be treated as a design bug.

## Product Boundaries

The initial system is a founder-facing operating layer for multiple ventures,
starting with CopyBanner and Unity Income, with room for future projects.

The MVP MUST prioritize:
- portfolio visibility across projects
- per-project execution tracking
- marketing and launch coordination
- clear ownership and next actions
- lightweight event and milestone management

The MVP MUST NOT begin with:
- deep financial accounting
- full resource capacity planning
- enterprise permission matrices
- heavy Gantt or dependency management
- automation that hides missing product decisions

## Workflow & Review Gates

All meaningful work should map to one of these artifacts:
- `spec.md` for user and business intent
- `plan.md` for implementation shape and tradeoffs
- `tasks.md` for execution slices
- code and UI changes only after the above are stable enough to build

Each spec MUST define:
- cross-project value or project-specific value
- explicit non-goals
- success criteria that can be checked without subjective interpretation
- assumptions made due to incomplete discovery

Each review MUST confirm:
- the change improves operator clarity
- the change does not duplicate an existing source of truth
- the change keeps the model extensible for future projects
- the displayed status can be trusted by a busy founder

## Governance

This constitution is the default authority for product-shaping work in this
repository. When a spec, plan, or implementation conflicts with it, the
constitution wins unless it is formally amended.

Amendment policy:
- MAJOR: remove or redefine a core principle in a backward-incompatible way
- MINOR: add a new principle, review gate, or product boundary
- PATCH: clarify wording without changing operational meaning

Compliance policy:
- every new feature spec must reference these principles implicitly or directly
- reviews must call out constitution violations before discussing polish
- unresolved TODOs may exist, but hidden ambiguity may not

**Version**: 1.0.0 | **Ratified**: 2026-04-14 | **Last Amended**: 2026-04-14
