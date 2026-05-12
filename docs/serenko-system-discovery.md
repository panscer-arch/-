# Serenko System Discovery

## Product Intent

Serenko System is a founder operating system for managing multiple ventures from
one place without mixing their execution. The goal is not to replace every
specialized tool. The goal is to give one trusted control surface for:

- portfolio visibility across projects
- project creation and ongoing delivery control
- marketing coordination
- event and milestone awareness
- "what needs attention now" clarity

Initial seed projects:
- CopyBanner
- Unity Income / Unit smart-contract initiative
- future projects not yet defined

## Research Signals From Existing Tools

These tools are useful reference points, but not product requirements.

### Linear

Linear's Initiatives model groups multiple projects under one objective and
rolls up project health, target date, owners, and recent updates into a
leadership view. That is a strong reference for our cross-project layer.

Source:
- [Linear Initiatives](https://linear.app/docs/initiatives)
- [Linear Initiative and Project Updates](https://linear.app/docs/initiative-and-project-updates)

What to borrow:
- one portfolio-level view with health rollups
- explicit owner and target date
- structured written updates instead of vague progress bars

What not to copy blindly:
- team-centric language and workflow assumptions
- software-only framing for all projects

### Asana

Asana Portfolios emphasizes one place to monitor important projects, request or
review status updates, and drill into project details without losing the higher
level overview.

Source:
- [Asana Portfolios Overview](https://help.asana.com/s/article/portfolios-overview)

What to borrow:
- top-down portfolio summary
- quick access to latest status updates
- project drill-down from a shared command center

What not to copy blindly:
- nested portfolio complexity in early MVP
- enterprise-heavy navigation depth

### OpenProject

OpenProject is explicit that a portfolio is for visibility and coordination,
not detailed task execution. That distinction is important for Serenko System:
the founder dashboard should stay strategic first.

Source:
- [OpenProject Portfolios](https://www.openproject.org/docs/user-guide/portfolios/)

What to borrow:
- clear hierarchy between portfolio and project
- strategic visibility over operational overload

What not to copy blindly:
- heavy PMO structure
- formal enterprise program terminology

### GitHub Projects

GitHub Projects shows the value of one underlying data set rendered in multiple
views such as table, board, and roadmap. This is a good product principle for
Serenko System even if the UI ends up very different.

Source:
- [GitHub Projects Overview](https://docs.github.com/en/issues/planning-and-tracking-with-projects)
- [GitHub Projects Quickstart](https://docs.github.com/issues/planning-and-tracking-with-projects/learning-about-projects/quickstart-for-projects)

What to borrow:
- one source of truth, many views
- custom fields for operating metadata
- roadmap as a view, not a separate disconnected module

What not to copy blindly:
- issue-first mental model
- engineering workflow details leaking into every project

## Product Shape We Actually Want

The product should behave more like a founder control room than a generic task
manager.

### Core layers

1. Portfolio layer
   One screen that answers: which projects exist, what stage they are in, what
   changed recently, what is blocked, and what needs attention this week.

2. Project layer
   One operating space per project with the current goal, scope, stage, health,
   owners, risks, next actions, milestones, marketing plan, and recent events.

3. Activity layer
   A chronological feed of important updates across all projects so context is
   not lost between sessions.

4. Template layer
   A reusable model so new projects can be added without redesigning the
   system.

## Recommended MVP Modules

- Portfolio dashboard
- Project registry
- Project detail workspace
- Milestones and events
- Marketing tracker
- Risks and blockers
- Weekly update log

## MVP Fields Worth Standardizing

Across every project:
- project name
- project type
- current stage
- health
- current priority
- owner
- target milestone
- next key action
- latest update
- blocker status
- marketing status

Project-specific but optional:
- smart contract readiness
- marketplace liquidity/readiness
- advertiser or publisher pipeline
- launch dependencies

## What To Avoid In V1

- full CRM inside the same product
- deep analytics before the workflow is stable
- budgeting and accounting modules
- long dependency chains and Gantt-first planning
- permissions and roles more complex than necessary

## Near-Term Product Questions

- Is the primary home screen portfolio-first or "today-first"?
- Should events and milestones live in one timeline or separate modules?
- Does marketing need a dedicated workspace or just a structured block inside each project?
- Do we need manual updates only first, or should GitHub/Telegram signals feed the system early?
- Is Unity Income a separate project line or a subtype template for future Web3 projects?

## Recommendation For Our Next Spec

Start with a single feature spec for the founder command center, not the whole
platform at once. If that works, we can then spec:

1. project detail workspace
2. marketing tracker
3. milestone and event timeline
4. project creation template flow
