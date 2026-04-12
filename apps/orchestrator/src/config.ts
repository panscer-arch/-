import path from "node:path";

function getEnv(name: string, fallback = "") {
  return process.env[name] ?? fallback;
}

export const config = {
  appName: "lifecoding-orchestrator",
  persistenceMode: getEnv("ORCHESTRATOR_PERSISTENCE_MODE", "file"),
  agentExecutionMode: getEnv("ORCHESTRATOR_AGENT_EXECUTION_MODE", "template"),
  agentCommand: getEnv("ORCHESTRATOR_AGENT_COMMAND"),
  agentCommandArgs: getEnv("ORCHESTRATOR_AGENT_COMMAND_ARGS", ""),
  agentTimeoutMs: Number(getEnv("ORCHESTRATOR_AGENT_TIMEOUT_MS", "120000")),
  pollingIntervalMs: Number(getEnv("POLLING_INTERVAL_MS", "4000")),
  digestIntervalMs: Number(getEnv("ORCHESTRATOR_DIGEST_INTERVAL_MS", "86400000")),
  transportMode: getEnv("ORCHESTRATOR_TRANSPORT_MODE", "polling"),
  webhookPort: Number(getEnv("ORCHESTRATOR_WEBHOOK_PORT", "8787")),
  telegramWebhookPath: getEnv("TELEGRAM_WEBHOOK_PATH", "/telegram/webhook"),
  githubSyncIntervalMs: Number(getEnv("GITHUB_SYNC_INTERVAL_MS", "15000")),
  runtimeDir: getEnv(
    "ORCHESTRATOR_RUNTIME_DIR",
    path.resolve(process.cwd(), "runtime/orchestrator")
  ),
  telegram: {
    token: getEnv("TELEGRAM_BOT_TOKEN"),
    allowedChatId: getEnv("TELEGRAM_ALLOWED_CHAT_ID")
      ? Number(getEnv("TELEGRAM_ALLOWED_CHAT_ID"))
      : undefined
  },
  github: {
    token: getEnv("GITHUB_TOKEN"),
    owner: getEnv("GITHUB_OWNER"),
    repo: getEnv("GITHUB_REPO"),
    baseUrl: "https://api.github.com"
  },
  postgres: {
    url: getEnv("DATABASE_URL"),
    schema: getEnv("ORCHESTRATOR_DB_SCHEMA", "orchestrator")
  }
};

export function hasTelegramConfig() {
  return Boolean(config.telegram.token);
}

export function hasGitHubConfig() {
  return Boolean(config.github.token && config.github.owner && config.github.repo);
}

export function isWebhookMode() {
  return config.transportMode === "webhook";
}

export function isPostgresPersistence() {
  return config.persistenceMode === "postgres";
}

export function isCommandAgentMode() {
  return config.agentExecutionMode === "command";
}

export function getAgentCommandArgs() {
  return config.agentCommandArgs
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
