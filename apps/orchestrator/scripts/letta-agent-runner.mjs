#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const defaultProjectRoot = path.resolve(scriptDir, "..", "..", "..");

async function main() {
  const [, , ...args] = process.argv;
  const promptPath = args.at(-1);
  const explicitAgentId =
    args.length > 1 && args[0].startsWith("agent-") ? args[0] : process.env.ORCHESTRATOR_LETTA_AGENT_ID;
  if (!promptPath) {
    console.error("Usage: letta-agent-runner.mjs [agent-id] <prompt-file>");
    process.exitCode = 1;
    return;
  }

  const prompt = await fs.readFile(promptPath, "utf8");
  const env = {
    ...process.env,
    PATH: `${process.env.HOME}/.local/bin:${process.env.HOME}/.local/node/bin:${process.env.PATH ?? ""}`
  };
  const projectRoot = process.env.ORCHESTRATOR_PROJECT_ROOT || defaultProjectRoot;

  const lettaArgs = ["-p", prompt, "--output-format", "text"];
  if (explicitAgentId) {
    lettaArgs.push("--agent", explicitAgentId);
  }

  const { stdout } = await execFileAsync(
    "letta",
    lettaArgs,
    {
      cwd: projectRoot,
      env,
      timeout: Number(process.env.ORCHESTRATOR_AGENT_TIMEOUT_MS ?? "120000"),
      maxBuffer: 1024 * 1024
    }
  );

  const payload = normalizeAgentOutput(stdout);

  process.stdout.write(JSON.stringify(payload));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

function normalizeAgentOutput(stdout) {
  const trimmed = stdout.trim();
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const json = JSON.parse(unfenced);
    if (typeof json === "object" && json) {
      return {
        summary: String(json.summary ?? "Letta agent completed."),
        detail: String(json.detail ?? unfenced)
      };
    }
  } catch {}

  const [firstLine, ...rest] = unfenced.split("\n");
  return {
    summary: firstLine?.slice(0, 160) || "Letta agent completed.",
    detail: rest.length ? rest.join("\n") : unfenced
  };
}
