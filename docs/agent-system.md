# Telegram Lead-Agent System

## Goal

You talk to one responsible agent in Telegram. Inside the repo, that lead agent triages work into specialist tracks and optionally mirrors the work into GitHub issues.

## Implemented shape

- `apps/orchestrator` - standalone orchestration runtime
- `lead-agent` - single point of responsibility
- specialist tracks:
  - product
  - frontend
  - backend
  - data
  - qa
  - devops
- file-based runtime memory in `runtime/orchestrator/memory.json`
- Telegram polling or webhook mode via Bot API
- GitHub issue creation, comment sync, task branch creation, draft PR automation, PR review sync, and state sync back into tasks
- internal worker engine that produces specialist results and mirrors them to GitHub comments
- pluggable agent execution runtime: `template` fallback or external `command` mode

## Current flow

1. You send a task in Telegram.
2. Lead agent receives the message.
3. Lead triages the request into specialist workstreams.
4. The task is stored in local runtime memory.
5. Internal specialist workers generate first-pass outputs by role.
   If command mode is enabled, these can be real external sub-agents instead of template workers.
6. If GitHub is configured, the task is mirrored into a GitHub issue and worker outputs are added as comments.
7. A task branch is created or prepared in GitHub.
8. GitHub comments and PR reviews are synced back into local memory.
9. The requester can receive Telegram notifications when GitHub issue or PR state changes.
10. The requester can also receive periodic digests for open tasks.
11. The lead replies in Telegram with the task id, priority, and assigned tracks.

## Commands

- `/start`
- `/help`
- `/status`
- `/tasks <new|triaged|in_progress|blocked|done>`
- `/sync`
- `/task <id>`
- `/comment <id> <text>`
- `/done <id>`
- `/blocked <id>`
- `/unblock <id>`
- `/reopen <id>`
- `/priority <id> <low|medium|high|critical>`
- `/label <id> <label>`
- `/owner <id> <role>`
- `/assign <id> <role>`
- `/branch <id>`
- `/pr <id>`

## Run

### Polling mode

```bash
cp examples/orchestrator.env.example .env.local
export $(grep -v '^#' .env.local | xargs)
npm run dev:orchestrator
```

### Webhook mode

1. Set `ORCHESTRATOR_TRANSPORT_MODE=webhook`
2. Expose the server publicly, for example through a reverse proxy or tunnel
3. Register the Telegram webhook:

```bash
curl -X POST "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://YOUR_DOMAIN${TELEGRAM_WEBHOOK_PATH}\"}"
```

4. Start the orchestrator:

```bash
npm run dev:orchestrator
```

## Environment

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_ALLOWED_CHAT_ID` optional but recommended
- `ORCHESTRATOR_AGENT_EXECUTION_MODE` = `template` or `command`
- `ORCHESTRATOR_AGENT_COMMAND`
- `ORCHESTRATOR_AGENT_COMMAND_ARGS`
- `ORCHESTRATOR_LETTA_AGENT_ID`
- `ORCHESTRATOR_PROJECT_ROOT`
- `ORCHESTRATOR_AGENT_TIMEOUT_MS`
- `ORCHESTRATOR_TRANSPORT_MODE` = `polling` or `webhook`
- `ORCHESTRATOR_WEBHOOK_PORT`
- `TELEGRAM_WEBHOOK_PATH`
- `GITHUB_TOKEN`
- `GITHUB_OWNER`
- `GITHUB_REPO`
- `POLLING_INTERVAL_MS` optional
- `GITHUB_SYNC_INTERVAL_MS` optional
- `ORCHESTRATOR_DIGEST_INTERVAL_MS` optional
- `ORCHESTRATOR_RUNTIME_DIR` optional

## Limits of the current implementation

- external sub-agent mode depends on a command-line runtime that accepts a prompt file path and returns text or JSON
- a ready Letta adapter is included at `apps/orchestrator/scripts/letta-agent-runner.mjs`
- the Letta adapter can target a specific existing agent through `ORCHESTRATOR_LETTA_AGENT_ID`
- the Letta adapter can run in the real project context through `ORCHESTRATOR_PROJECT_ROOT`
- GitHub draft PR creation requires commits ahead of the base branch
- GitHub review and merge notifications require both GitHub credentials and a Telegram requester chat id
- task memory can use file mode or Postgres mode, but branch/PR automation still depends on GitHub credentials
- digest scheduling is interval-based, not true wall-clock calendar scheduling yet
- webhook mode needs a public reachable endpoint and Telegram webhook registration

## Best next upgrades

1. Replace template workers with real specialty runtimes or agent executors
2. Add true calendar-based digest scheduling and quiet hours
3. Sync GitHub reviews and merge events into richer Telegram digests
4. Add slash commands for label removal, reassignment, and bulk updates
5. Add user-specific notification preferences
