# Feature Specification: Investment Payout Analytics

**Feature Branch**: `002-investment-payout-analytics`  
**Created**: 2026-04-21  
**Status**: Draft  
**Input**: User description: "Нужна аналитическая система, которая знает все кошельки и инвестиции пользователей, видит по каким циклам и в какие дни возникают выплаты, строит прогнозы на день, неделю и месяц, считает сколько новых денег нужно привлечь, показывает breakdown по рефералам, выплатам по циклам, комиссии платформы и личным поступлениям, сравнивает план и факт каждый день, сигнализирует о просадке и помогает улучшать структурную позицию партнёров и кошельков создателей проектов."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Forecast payout obligations and funding need (Priority: P1)

As an operator of the investment system, I want one forecast view that shows all
upcoming payout obligations and the required inflow of new money, so I can see
how much capital must be attracted before the system reaches a cash gap.

**Why this priority**: If the system cannot reliably show upcoming obligations
and funding need, it does not solve the core business risk.

**Independent Test**: Can be fully tested by loading wallet, user, investment,
cycle, and payout rule data, then verifying that the system produces a
30-day, weekly, and monthly obligation forecast with a funding target and
component breakdown.

**Acceptance Scenarios**:

1. **Given** active user investments and cycle rules exist, **When** the
   operator opens the forecast view, **Then** the system shows upcoming payout
   obligations by day, week, and month for the selected horizon.
2. **Given** future obligations are known, **When** the system calculates the
   required new inflow, **Then** it shows the gross target and the breakdown for
   cycle payouts, referral payouts, platform fee, and operator net proceeds.
3. **Given** the operator selects the next 30 days, **When** the forecast is
   displayed, **Then** the system highlights the total amount that must be
   covered within that period and the dates of the largest pressure points.

---

### User Story 2 - Track daily plan versus fact and escalate deficits (Priority: P2)

As an operator, I want the system to set a daily target, compare it to actual
results, and carry forward any deficit, so the team knows whether it is ahead,
on plan, or behind and what must be recovered next.

**Why this priority**: Daily plan-fact control is what turns passive analytics
into an operating system for decisions and corrective action.

**Independent Test**: Can be fully tested by creating a forecast target for a
time period, recording actual inflows and payouts for several days, and
verifying that the system recalculates variance, accumulated deficit, and the
next required target.

**Acceptance Scenarios**:

1. **Given** a daily attraction target exists, **When** actual inflow is below
   target, **Then** the system marks the day as behind plan and increases the
   required target for subsequent days according to the remaining obligation.
2. **Given** actual inflow meets or exceeds target, **When** the day closes,
   **Then** the system shows the day as on plan or ahead and updates the
   remaining need for the period.
3. **Given** the operator enters the workspace on a new day, **When** a prior
   shortfall exists, **Then** the system shows the revised minimum amount that
   must be attracted today to recover the plan.

---

### User Story 3 - Analyze wallet structure and partner placement quality (Priority: P3)

As an operator, I want the system to analyze creator wallets, referral flows,
and partner placement structure, so I can spot weak structural positions and
improve how rewards and fees accumulate across the network.

**Why this priority**: Forecasting explains cash pressure, but structural
analysis helps improve the economics that create or relieve that pressure.

**Independent Test**: Can be fully tested by loading wallet ownership,
referral relationships, and placement structure data, then verifying that the
system identifies concentration, leakage, underperforming structure segments,
and improvement recommendations.

**Acceptance Scenarios**:

1. **Given** creator, platform, and referral wallets are mapped, **When** the
   operator reviews wallet analytics, **Then** the system shows how much value
   has accumulated and is expected to accumulate into each wallet category.
2. **Given** a partner structure contains weak placement patterns, **When** the
   system evaluates the structure, **Then** it flags the weak points and states
   which positions reduce referral or fee efficiency.
3. **Given** the system identifies a structural issue, **When** it presents the
   result, **Then** it provides a concrete recommendation describing the
   expected direction of improvement rather than only reporting the problem.

---

### User Story 4 - Compare scenarios before a cash gap forms (Priority: P4)

As an operator, I want the system to compare base, upside, and downside
scenarios for future inflow and payout pressure, so I can act before a deficit
becomes critical.

**Why this priority**: A single-number forecast is too fragile for financial
operations. Scenario planning is what makes the analytics predictive rather
than merely descriptive.

**Independent Test**: Can be fully tested by defining multiple inflow and
conversion assumptions for the same period and verifying that the system shows
how the required attraction target, deficit risk, and operator net change under
each scenario.

**Acceptance Scenarios**:

1. **Given** the operator opens a forecast period, **When** scenario analysis
   is enabled, **Then** the system shows at least base, upside, and downside
   outcomes for the same obligation window.
2. **Given** key assumptions change, **When** the scenario is recalculated,
   **Then** the system shows which output metrics changed most and by how much.
3. **Given** downside risk crosses the safe threshold, **When** the forecast is
   refreshed, **Then** the system flags the period before the expected cash gap
   date is reached.

---

### User Story 5 - Trust the numbers before acting on them (Priority: P5)

As an operator, I want to see data freshness, completeness, and confidence of
the forecast, so I know whether to act immediately or first investigate input
quality.

**Why this priority**: Detailed analytics is dangerous if the source data is
stale, partial, or internally inconsistent.

**Independent Test**: Can be fully tested by introducing missing, delayed, or
reconciled source data and verifying that the system downgrades confidence,
flags the affected metrics, and shows what is missing.

**Acceptance Scenarios**:

1. **Given** one or more critical data sources are stale, **When** the
   operator opens the analytics view, **Then** the system marks the affected
   forecast as low-confidence and identifies the stale inputs.
2. **Given** wallet totals and payout totals do not reconcile, **When** the
   system validates the inputs, **Then** it flags the mismatch before the
   operator relies on the forecast.
3. **Given** all critical sources are fresh and reconciled, **When** the
   analytics view is loaded, **Then** the system shows the forecast as ready for
   operational use.

### Edge Cases

- What happens when historical wallet data is incomplete or delayed for one or
  more days?
- What happens when a user has multiple wallets across multiple networks tied
  to one investment position?
- How does the system handle manual corrections to an already calculated payout
  day?
- How does the system handle an investment cycle that was created but later
  canceled, paused, or restructured?
- What happens when actual payouts differ from scheduled payouts because of a
  business override?
- How does the system handle users whose referral relationship changes after
  investment creation?
- What happens when one creator wallet receives both platform fee and referral
  income for the same period?
- What happens when historical plan-fact accuracy degrades and the forecasting
  model becomes unreliable?
- How does the system behave when actual inflow arrives, but attribution to
  source channel, partner, or wallet is still unknown?
- What happens when a forecast looks safe in the base case but fails in the
  downside scenario?
- How does the system present a forecast when one part of the data is confirmed
  and another part is estimated?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST maintain a unified register of all tracked user
  wallets that participate in the investment system.
- **FR-002**: System MUST associate each wallet with its user, role, and
  relevant investment activity.
- **FR-003**: System MUST maintain a register of all active and historical
  investment positions with their creation date, cycle, amount, and current
  status.
- **FR-004**: System MUST maintain the payout rules that determine when and how
  much is due for each investment cycle.
- **FR-005**: System MUST calculate expected payout obligations for each day
  based on active investment positions and payout rules.
- **FR-006**: System MUST aggregate payout obligations for configurable time
  windows including day, week, month, and the next 30 days.
- **FR-007**: System MUST calculate the amount of new inflow required to cover
  expected obligations for a selected time window.
- **FR-008**: System MUST break the required inflow into at least referral
  payouts, cycle payouts, platform fee, and operator net proceeds.
- **FR-009**: System MUST show both already-paid and still-outstanding amounts
  for each cycle and reporting window.
- **FR-010**: System MUST maintain daily plan targets for attracted capital and
  compare them with actual results.
- **FR-011**: System MUST calculate daily, weekly, and monthly plan-fact
  variance and carry forward unresolved deficits into the remaining period.
- **FR-012**: System MUST classify each reporting period as ahead of plan, on
  plan, at risk, or behind plan.
- **FR-013**: System MUST generate operational alerts when forecasted or actual
  inflow is insufficient to cover upcoming obligations.
- **FR-014**: System MUST explain the main drivers of each alert, including the
  dates, cycles, or wallet groups creating the pressure.
- **FR-015**: System MUST maintain a map of referral relationships and partner
  placement structure relevant to reward distribution.
- **FR-016**: System MUST analyze creator, referral, and platform wallets to
  show historical and forecasted accumulation by wallet category.
- **FR-017**: System MUST detect structurally weak partner placement patterns
  that reduce referral or fee efficiency.
- **FR-018**: System MUST provide recommendations for improving structural
  position based on identified inefficiencies or concentration risks.
- **FR-019**: System MUST allow the operator to inspect the underlying inputs
  behind a forecast or alert so the numbers are auditable.
- **FR-020**: System MUST preserve historical snapshots of forecasts, actuals,
  and adjustments so the team can review how the plan changed over time.
- **FR-021**: System MUST produce at least base, upside, and downside forecast
  scenarios for the same reporting period.
- **FR-022**: System MUST expose the key assumptions used in each scenario and
  distinguish clearly between factual inputs and modeled assumptions.
- **FR-023**: System MUST identify the sensitivity of the forecast to major
  drivers such as inflow volume, timing, payout concentration, and referral
  burden.
- **FR-024**: System MUST estimate the earliest projected cash-gap date for a
  reporting period when obligations are not fully covered.
- **FR-025**: System MUST surface leading indicators that warn about future
  plan failure before the payout date arrives.
- **FR-026**: System MUST track forecast accuracy over time and show how prior
  forecasts compared with actual outcomes.
- **FR-027**: System MUST validate freshness, completeness, and internal
  consistency of critical source data before marking a forecast as trusted.
- **FR-028**: System MUST display a confidence level for forecasts and alerts
  based on data quality, reconciliation status, and recent forecast accuracy.
- **FR-029**: System MUST distinguish confirmed amounts from estimated amounts
  inside every major forecast output.
- **FR-030**: System MUST explain why the required daily attraction target rose
  or fell compared with the previous reporting day.
- **FR-031**: System MUST identify concentration risk where obligations,
  inflows, or referral exposure depend too heavily on a small set of wallets,
  users, cycles, or structure segments.
- **FR-032**: System MUST support drill-down from portfolio forecast to period,
  cycle, user, wallet, and payout-obligation detail.

### Key Entities *(include if feature involves data)*

- **Wallet**: A tracked address or account that receives or sends investment,
  payout, referral, or platform-fee related value.
- **User**: A participant whose wallets, investments, referral relationships,
  and payout exposure are tracked by the system.
- **Investment Position**: A single user contribution into the system with a
  creation date, amount, cycle assignment, and payout lifecycle.
- **Cycle Rule**: The business rule that defines payout timing, expected
  returns, and obligation schedule for a class of investment positions.
- **Payout Obligation**: A scheduled or completed amount due for a specific
  investment position on a specific date.
- **Funding Plan**: A target view that states how much new money must be
  attracted over a period and how that amount is distributed across uses.
- **Plan-Fact Record**: The daily, weekly, or monthly comparison between target
  inflow, actual inflow, paid obligations, and remaining gap.
- **Structure Map**: The placement and referral relationship model that
  determines how partners, creators, and platform wallets participate in value
  distribution.
- **Recommendation**: A system-generated advisory explaining what structural or
  operational action could improve coverage, efficiency, or positioning.
- **Scenario Assumption Set**: A named set of forecast assumptions that defines
  expected inflow, timing, conversion, or risk conditions for a reporting
  period.
- **Data Quality Signal**: A status record describing freshness,
  completeness, reconciliation, and confidence of a source dataset or metric.
- **Leading Indicator**: An early warning metric that increases or decreases
  the probability that the system will miss its future attraction or payout
  target.
- **Forecast Accuracy Record**: A comparison between prior forecast values and
  realized outcomes for the same period.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: An operator can see the total outstanding payout obligation for
  the next 30 days and its daily breakdown in under 2 minutes.
- **SC-002**: An operator can identify the required gross inflow and the
  referral, cycle, platform-fee, and operator-net components for any selected
  reporting window in under 3 minutes.
- **SC-003**: The system flags a daily shortfall and updates the remaining
  required target for the period no later than the next reporting refresh.
- **SC-004**: 100% of forecast totals shown in the main analytics view are
  traceable to underlying wallet, investment, cycle, or payout records.
- **SC-005**: An operator can identify the top structural risk or inefficiency
  affecting referral and fee accumulation for the current period in under
  5 minutes.
- **SC-006**: An operator can compare base, upside, and downside outcomes for
  the next 30 days in under 3 minutes and identify the earliest risk date for
  each scenario.
- **SC-007**: 100% of main forecast views show whether the numbers are based on
  confirmed data, estimated data, or a mix of both.
- **SC-008**: When critical source data is stale or unreconciled, the system
  warns the operator before a forecast is used for decision-making.

## Assumptions

- The business has access to a reliable mapping between users, wallets, and
  investment positions, even if some of that mapping is maintained manually in
  early versions.
- Payout logic for each investment cycle can be expressed as explicit business
  rules rather than informal operator judgment only.
- Initial versions may ingest data from internal tables, exports, or manual
  reconciliations instead of requiring full real-time blockchain indexing.
- Recommendations in v1 are advisory and do not automatically rebalance partner
  structure or move funds.
- Forecasting is based on known current investments and configured rules, not
  on guaranteed prediction of future sales or market behavior.
- The first version should prioritize operator trust and explainability over
  mathematically complex black-box forecasting.
- A useful forecast for this business requires both lagging metrics
  (actual inflow, actual payouts) and leading metrics (pipeline, expected
  partner performance, upcoming concentration pressure).
