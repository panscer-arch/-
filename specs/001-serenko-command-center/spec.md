# Feature Specification: Serenko Command Center

**Feature Branch**: `001-serenko-command-center`  
**Created**: 2026-04-14  
**Status**: Draft  
**Input**: User description: "Build a founder-facing system to manage CopyBanner, Unity Income, and future projects in one place with visibility into execution, creation, marketing, and important events."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See all projects without losing context (Priority: P1)

As a founder managing multiple ventures, I want one screen that shows the
current state of all projects so I can immediately understand what is active,
blocked, at risk, or needs attention this week.

**Why this priority**: Without a trusted portfolio view, the system does not
solve the main problem of mental overload across projects.

**Independent Test**: Can be fully tested by creating at least two projects,
assigning different stages and health states, and verifying that a single
dashboard shows the latest update, priority, next action, and blocker state for
each project.

**Acceptance Scenarios**:

1. **Given** multiple active projects exist, **When** the founder opens the
   command center, **Then** the system shows a portfolio summary with each
   project's stage, health, owner, next action, and latest update.
2. **Given** one project is blocked, **When** the founder reviews the command
   center, **Then** that project is visually distinguishable from on-track
   projects and shows its blocker reason.

---

### User Story 2 - Run one project from a canonical workspace (Priority: P2)

As a founder, I want each project to have one operating workspace so I can see
its goal, scope, marketing, milestones, blockers, and next steps without
opening multiple disconnected tools.

**Why this priority**: The portfolio view is only useful if every project has a
consistent operating record behind it.

**Independent Test**: Can be fully tested by opening one project and confirming
that the founder can view and update the project's core context, milestones,
marketing state, risks, and recent activity from one workspace.

**Acceptance Scenarios**:

1. **Given** a project exists, **When** the founder opens its workspace,
   **Then** the system displays the project goal, stage, health, next actions,
   milestones, marketing status, and recent updates.
2. **Given** the founder updates a project milestone or status, **When** the
   change is saved, **Then** the project workspace and portfolio summary remain
   consistent.

---

### User Story 3 - Add future projects without redesigning the system (Priority: P3)

As a founder, I want to add a new project using the same operating model so the
system can grow with the portfolio instead of becoming a custom dashboard for
only the first two ventures.

**Why this priority**: The product must scale with new ventures, otherwise it
becomes another short-lived internal tool.

**Independent Test**: Can be fully tested by creating a new project from the
shared model and verifying that it appears in the portfolio and receives the
same standard fields and views as existing projects.

**Acceptance Scenarios**:

1. **Given** the founder creates a new project, **When** they save the project,
   **Then** the project appears in the portfolio with the standard operating
   fields.
2. **Given** a new project has unique needs, **When** the founder uses optional
   project-specific fields, **Then** the shared model still remains intact for
   cross-project comparison.

---

### Edge Cases

- What happens when a project has no recent update but is still marked on track?
- What happens when a project belongs to the portfolio but has no owner yet?
- How does the system handle projects that share one milestone date but have
  different health states?
- How does the system handle a new project that does not fit the default stage
  template?
- What happens when marketing status and delivery status conflict with each
  other?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow the founder to create and maintain multiple
  projects inside one portfolio.
- **FR-002**: System MUST provide a portfolio-level view that shows each
  project's stage, health, priority, owner, latest update, and next action.
- **FR-003**: System MUST allow the founder to open a project-specific workspace
  from the portfolio view.
- **FR-004**: System MUST maintain one canonical operating record per project.
- **FR-005**: System MUST let the founder record milestones, events, blockers,
  and recent updates for each project.
- **FR-006**: System MUST let the founder track marketing status and marketing
  next steps per project.
- **FR-007**: System MUST support adding future projects without schema redesign
  for core cross-project fields.
- **FR-008**: System MUST distinguish clearly between on-track, at-risk,
  blocked, and no-update states.
- **FR-009**: System MUST preserve a recent activity history so the founder can
  recover context after time away from the system.
- **FR-010**: System MUST support project-specific optional fields without
  breaking portfolio comparison.

### Key Entities *(include if feature involves data)*

- **Portfolio**: The founder's full set of tracked ventures and their shared
  cross-project operating view.
- **Project**: A single venture or initiative with standard operating fields,
  status, milestones, updates, and optional project-specific metadata.
- **Project Update**: A dated status note describing progress, blockers,
  changes, and next actions.
- **Milestone/Event**: A dated operational or marketing event that matters for
  project tracking and decision-making.
- **Marketing Track**: Structured information about launch, promotion, campaign
  state, and marketing next steps for a project.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The founder can review the current state of all active projects in
  under 3 minutes from one portfolio screen.
- **SC-002**: The founder can open any project and identify its current goal,
  health, next action, and latest update in under 30 seconds.
- **SC-003**: A new project can be added to the system with the shared standard
  fields in under 5 minutes.
- **SC-004**: 100% of active projects in the portfolio have a visible latest
  update timestamp and explicit next action.

## Assumptions

- The first active ventures are CopyBanner and Unity Income, with future
  projects added later.
- The MVP is founder-operated and does not require complex team permissions.
- Early versions can rely on manual updates instead of deep third-party
  automation.
- Marketing tracking is lightweight in v1 and focused on visibility, not full
  campaign analytics.
- The first delivery surface is a web application unless a later spec states
  otherwise.
