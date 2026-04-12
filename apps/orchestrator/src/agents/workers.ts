import crypto from "node:crypto";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { config, getAgentCommandArgs, isCommandAgentMode } from "../config.js";
import type { SpecialistAssignment, WorkTask, WorkerExecutionResult } from "../types.js";

const execFileAsync = promisify(execFile);
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

function formatOwnedFiles(assignment: SpecialistAssignment) {
  return assignment.ownedFiles.length ? assignment.ownedFiles.join(", ") : "TBD";
}

function workerTemplate(task: WorkTask, assignment: SpecialistAssignment) {
  switch (assignment.specialty) {
    case "product":
      return {
        summary: "Defined user-facing behavior and acceptance framing.",
        detail: [
          `Product agent reviewed task "${task.title}".`,
          `User outcome: turn the request into a shippable user-visible change.`,
          `Primary focus: scope, UX wording, edge states, and handoff clarity.`
        ].join("\n")
      };
    case "frontend":
      return {
        summary: "Outlined UI implementation slice and owned files.",
        detail: [
          `Frontend agent prepared implementation direction for "${task.title}".`,
          `Owned files: ${formatOwnedFiles(assignment)}.`,
          `Focus: responsive states, app-shell integration, and feature-flag-safe rendering.`
        ].join("\n")
      };
    case "backend":
      return {
        summary: "Outlined API/orchestration work and integration boundaries.",
        detail: [
          `Backend agent mapped contracts for "${task.title}".`,
          `Owned files: ${formatOwnedFiles(assignment)}.`,
          `Focus: service boundaries, public contracts, and decoupled side effects.`
        ].join("\n")
      };
    case "data":
      return {
        summary: "Outlined schema and persistence implications.",
        detail: [
          `Data agent reviewed storage impact for "${task.title}".`,
          `Owned files: ${formatOwnedFiles(assignment)}.`,
          `Focus: migrations, indexes, reversible schema changes, and event payload compatibility.`
        ].join("\n")
      };
    case "qa":
      return {
        summary: "Prepared acceptance and regression checklist.",
        detail: [
          `QA agent drafted validation coverage for "${task.title}".`,
          `Focus: acceptance checks, regression hotspots, and operational verification after rollout.`
        ].join("\n")
      };
    case "devops":
      return {
        summary: "Prepared environment and delivery checklist.",
        detail: [
          `DevOps agent reviewed runtime and delivery needs for "${task.title}".`,
          `Focus: env vars, service startup, secrets, webhook reachability, and CI/CD hooks.`
        ].join("\n")
      };
  }
}

function fallbackTemplateResult(task: WorkTask, assignment: SpecialistAssignment): WorkerExecutionResult {
  const template = workerTemplate(task, assignment);
  return {
    assignmentId: assignment.id,
    specialty: assignment.specialty,
    status: "done",
    resultSummary: template.summary,
    detailedResult: template.detail,
    runtime: "template"
  };
}

function commandPrompt(task: WorkTask, assignment: SpecialistAssignment) {
  return [
    `You are the ${assignment.specialty} specialist for task ${task.id}.`,
    `Title: ${task.title}`,
    `Description: ${task.description}`,
    `Brief: ${assignment.brief}`,
    `Owned files: ${assignment.ownedFiles.join(", ") || "TBD"}`,
    `Acceptance criteria:`,
    ...assignment.acceptanceCriteria.map((line) => `- ${line}`),
    ``,
    `Return a concise execution summary and detailed result. JSON is preferred: {"summary":"...","detail":"..."}`
  ].join("\n");
}

export class WorkerEngine {
  async execute(task: WorkTask): Promise<WorkerExecutionResult[]> {
    return Promise.all(
      task.assignments.map((assignment) => {
        if (isCommandAgentMode() && config.agentCommand) {
          return this.executeCommandWorker(task, assignment);
        }

        return Promise.resolve(fallbackTemplateResult(task, assignment));
      })
    );
  }

  private async executeCommandWorker(
    task: WorkTask,
    assignment: SpecialistAssignment
  ): Promise<WorkerExecutionResult> {
    const runId = `run_${crypto.randomUUID().slice(0, 8)}`;
    const promptPath = path.join(os.tmpdir(), `${runId}.txt`);
    await fs.writeFile(promptPath, commandPrompt(task, assignment), "utf8");

    try {
      const args = [...normalizeCommandArgs(getAgentCommandArgs()), promptPath];
      const { stdout, stderr } = await execFileAsync(config.agentCommand!, args, {
        timeout: config.agentTimeoutMs,
        maxBuffer: 1024 * 1024
      });

      const parsed = tryParseWorkerOutput(stdout);
      return {
        assignmentId: assignment.id,
        specialty: assignment.specialty,
        status: "done",
        resultSummary: parsed.summary,
        detailedResult: parsed.detail || stdout.trim() || stderr.trim(),
        runtime: "command",
        externalRunId: runId
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        assignmentId: assignment.id,
        specialty: assignment.specialty,
        status: "working",
        resultSummary: `External ${assignment.specialty} agent failed, fallback needed.`,
        detailedResult: `External agent run failed for ${assignment.specialty}: ${message}`,
        runtime: "command",
        externalRunId: runId,
        lastError: message
      };
    } finally {
      await fs.rm(promptPath, { force: true });
    }
  }
}

function tryParseWorkerOutput(stdout: string) {
  const trimmed = stdout.trim();
  if (!trimmed) {
    return {
      summary: "External agent completed with empty output.",
      detail: "No output returned by external agent."
    };
  }

  try {
    const json = JSON.parse(trimmed) as { summary?: string; detail?: string };
    return {
      summary: json.summary ?? "External agent completed.",
      detail: json.detail ?? trimmed
    };
  } catch {
    const [firstLine, ...rest] = trimmed.split("\n");
    return {
      summary: firstLine.slice(0, 160),
      detail: rest.length ? rest.join("\n") : trimmed
    };
  }
}

function normalizeCommandArgs(args: string[]) {
  return args.map((arg) => {
    if (path.isAbsolute(arg) || !arg.match(/\.(mjs|cjs|js|ts)$/)) {
      return arg;
    }

    if (existsSync(arg)) {
      return arg;
    }

    const fromPackageRoot = path.resolve(packageRoot, arg);
    if (existsSync(fromPackageRoot)) {
      return fromPackageRoot;
    }

    const basenameFallback = path.resolve(packageRoot, "scripts", path.basename(arg));
    if (existsSync(basenameFallback)) {
      return basenameFallback;
    }

    return arg;
  });
}
