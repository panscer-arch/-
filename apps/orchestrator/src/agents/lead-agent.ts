import crypto from "node:crypto";
import { pickSpecialists } from "./specialists.js";
import type {
  AgentResult,
  MessageContext,
  SpecialistAssignment,
  WorkerExecutionResult,
  WorkTask
} from "../types.js";

function now() {
  return new Date().toISOString();
}

function slugId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

function inferPriority(text: string): WorkTask["priority"] {
  const lower = text.toLowerCase();
  if (lower.includes("срочно") || lower.includes("urgent")) {
    return "critical";
  }
  if (lower.includes("важно") || lower.includes("high")) {
    return "high";
  }
  return "medium";
}

function inferEpic(text: string) {
  const lower = text.toLowerCase();
  if (includesAny(lower, ["auth", "login", "register", "supabase auth", "вход", "регистрац"])) {
    return "auth";
  }
  if (includesAny(lower, ["dashboard", "дашборд"])) {
    return "dashboard";
  }
  if (includesAny(lower, ["library", "rules", "правил", "библиотек"])) {
    return "library";
  }
  if (includesAny(lower, ["diary", "дневник"])) {
    return "diary";
  }
  if (includesAny(lower, ["feed", "лента", "community"])) {
    return "feed";
  }
  if (includesAny(lower, ["achievement", "gamification", "ачив", "достиж"])) {
    return "achievements";
  }
  if (includesAny(lower, ["settings", "настройк", "profile", "профил"])) {
    return "settings";
  }
  if (includesAny(lower, ["orchestrator", "telegram", "github bot", "бот", "agent", "оркестратор"])) {
    return "orchestrator";
  }
  return "core";
}

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function inferLabels(text: string, agentResults: AgentResult[]) {
  const labels = new Set<string>(["source:telegram", "lead:triaged"]);
  labels.add(`epic:${inferEpic(text)}`);
  for (const result of agentResults) {
    for (const label of result.labels) {
      labels.add(label);
    }
  }
  if (text.toLowerCase().includes("telegram")) {
    labels.add("integration:telegram");
  }
  if (text.toLowerCase().includes("github")) {
    labels.add("integration:github");
  }
  return [...labels];
}

function buildAssignments(results: AgentResult[]): SpecialistAssignment[] {
  return results.map((result) => ({
    id: slugId("assignment"),
    specialty: result.specialty,
    title: `${result.specialty} workstream`,
    brief: result.summary,
    ownedFiles: result.suggestedOwnedFiles,
    acceptanceCriteria: result.acceptanceCriteria,
    status: "queued"
  }));
}

function percent(done: number, total: number) {
  if (!total) {
    return 0;
  }
  return Math.round((done / total) * 100);
}

function epicFromTask(task: WorkTask) {
  return task.labels.find((label) => label.startsWith("epic:"))?.replace("epic:", "") ?? "core";
}

function latestTasks(tasks: WorkTask[], status: WorkTask["status"], limit = 3) {
  return tasks
    .filter((task) => task.status === status)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);
}

export class LeadAgent {
  triage(input: MessageContext): WorkTask {
    const results = pickSpecialists(input);
    const title = input.text.length > 72 ? `${input.text.slice(0, 69)}...` : input.text;

    return {
      id: slugId("task"),
      title,
      source: "telegram",
      status: "triaged",
      priority: inferPriority(input.text),
      createdAt: now(),
      updatedAt: now(),
      requester: {
        chatId: input.chatId,
        userId: input.userId,
        username: input.username
      },
      telegramUpdateId: input.updateId,
      telegramMessageId: input.messageId,
      description: input.text,
      labels: inferLabels(input.text, results),
      summary: this.makeLeadSummary(input.text, results),
      comments: [
        {
          id: slugId("comment"),
          author: "lead",
          body: "Lead accepted the Telegram request and split it into specialist tracks.",
          createdAt: now()
        }
      ],
      assignments: buildAssignments(results)
    };
  }

  private makeLeadSummary(text: string, results: AgentResult[]) {
    const specialties = results.map((item) => item.specialty).join(", ");
    return `Single point of contact: lead agent. Planned workstreams: ${specialties}. Incoming request: ${text}`;
  }

  makeTelegramConfirmation(task: WorkTask, issueUrl?: string) {
    const lines = [
      `Принял задачу как lead-agent.`,
      `Task: ${task.id}`,
      `Priority: ${task.priority}`,
      `Статус: ${task.status}`,
      `Потоки: ${task.assignments.map((item) => item.specialty).join(", ")}`
    ];

    if (issueUrl) {
      lines.push(`GitHub issue: ${issueUrl}`);
    }

    if (task.githubBranchName) {
      lines.push(`Branch: ${task.githubBranchName}`);
    }

    if (task.githubPrUrl) {
      lines.push(`PR: ${task.githubPrUrl}`);
    }

    return lines.join("\n");
  }

  makeStatusDigest(tasks: WorkTask[]) {
    if (!tasks.length) {
      return "Пока нет задач в памяти оркестратора.";
    }

    return tasks
      .slice(0, 10)
      .map(
        (task) =>
          `${task.id} • ${task.status} • ${task.priority}\n${task.title}\nПотоки: ${task.assignments
            .map((item) => `${item.specialty}:${item.status}`)
            .join(", ")}${task.githubPrUrl ? `\nPR: ${task.githubPrUrl}` : ""}`
      )
      .join("\n\n");
  }

  makeFilteredDigest(tasks: WorkTask[], status: WorkTask["status"]) {
    const filtered = tasks.filter((task) => task.status === status);
    if (!filtered.length) {
      return `Нет задач со статусом ${status}.`;
    }
    return this.makeStatusDigest(filtered);
  }

  makeTaskDetails(task: WorkTask) {
    return [
      `${task.id} • ${task.status} • ${task.priority}`,
      task.title,
      task.description,
      task.primaryOwner ? `Owner: ${task.primaryOwner}` : "Owner: not assigned",
      `Labels: ${task.labels.join(", ") || "none"}`,
      task.githubIssueUrl
        ? `Issue: ${task.githubIssueUrl} (${task.githubIssueState ?? "unknown"})`
        : "Issue: not linked",
      task.githubBranchName ? `Branch: ${task.githubBranchName}` : "Branch: not created",
      task.githubPrUrl
        ? `PR: ${task.githubPrUrl} (${task.githubPrState ?? "unknown"})`
        : "PR: not created",
      `Assignments: ${task.assignments.map((item) => `${item.specialty}:${item.status}`).join(", ")}`
    ].join("\n");
  }

  makeDigestForChat(tasks: WorkTask[]) {
    const openTasks = tasks.filter((task) => task.status !== "done").slice(0, 12);
    if (!openTasks.length) {
      return "Digest: открытых задач сейчас нет.";
    }

    return [
      "Daily digest:",
      ...openTasks.map(
        (task) =>
          `${task.id} • ${task.status} • ${task.priority}${task.primaryOwner ? ` • ${task.primaryOwner}` : ""}\n${task.title}`
      )
    ].join("\n\n");
  }

  makeProjectSummary(tasks: WorkTask[]) {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === "done").length;
    const inProgress = tasks.filter((task) => task.status === "in_progress").length;
    const blocked = tasks.filter((task) => task.status === "blocked").length;
    const triaged = tasks.filter((task) => task.status === "triaged" || task.status === "new").length;
    const remaining = total - done;
    const latestClosed = tasks
      .filter((task) => task.status === "done")
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 3);

    return [
      "Project status",
      `Готово: ${percent(done, total)}%`,
      `Всего задач: ${total}`,
      `Закрыто: ${done}`,
      `В работе: ${inProgress}`,
      `Заблокировано: ${blocked}`,
      `В очереди: ${triaged}`,
      `Осталось: ${remaining}`,
      "",
      latestClosed.length
        ? `Последние закрытые:\n${latestClosed.map((task) => `- ${task.id} • ${task.title}`).join("\n")}`
        : "Последние закрытые:\n- Пока нет закрытых задач"
    ].join("\n");
  }

  makeRoadmap(tasks: WorkTask[]) {
    const epics = [
      "auth",
      "dashboard",
      "library",
      "diary",
      "feed",
      "achievements",
      "settings",
      "orchestrator",
      "core"
    ];

    return [
      "Roadmap",
      ...epics.map((epic) => {
        const scoped = tasks.filter((task) => epicFromTask(task) === epic);
        const done = scoped.filter((task) => task.status === "done").length;
        const progress = percent(done, scoped.length);
        return `${epic}: ${progress}% (${done}/${scoped.length || 0})`;
      })
    ].join("\n");
  }

  makeBlockedDigest(tasks: WorkTask[]) {
    const blocked = tasks.filter((task) => task.status === "blocked");
    if (!blocked.length) {
      return "Сейчас нет заблокированных задач.";
    }

    return [
      "Blocked tasks",
      ...blocked.map(
        (task) =>
          `${task.id} • ${task.priority}${task.primaryOwner ? ` • ${task.primaryOwner}` : ""}\n${task.title}`
      )
    ].join("\n\n");
  }

  makeCompactDigest(tasks: WorkTask[]) {
    const total = tasks.length;
    const done = tasks.filter((task) => task.status === "done").length;
    const inProgress = tasks.filter((task) => task.status === "in_progress").length;
    const blocked = tasks.filter((task) => task.status === "blocked").length;

    return [
      "Digest",
      `Прогресс проекта: ${percent(done, total)}%`,
      `Всего: ${total} • Done: ${done} • In progress: ${inProgress} • Blocked: ${blocked}`,
      "",
      ...tasks
        .filter((task) => task.status !== "done")
        .slice(0, 5)
        .map((task) => `${task.id} • ${task.status} • ${epicFromTask(task)}\n${task.title}`)
    ].join("\n\n");
  }

  makeDailyProjectReport(tasks: WorkTask[]) {
    const latestClosed = latestTasks(tasks, "done", 3);
    const active = tasks
      .filter((task) => task.status === "in_progress")
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5);
    const blocked = tasks.filter((task) => task.status === "blocked").slice(0, 3);

    return [
      "Daily project report",
      "",
      this.makeProjectSummary(tasks),
      "",
      this.makeRoadmap(tasks),
      "",
      latestClosed.length
        ? `Закрыли недавно:\n${latestClosed.map((task) => `- ${task.id} • ${task.title}`).join("\n")}`
        : "Закрыли недавно:\n- Пока нет закрытых задач",
      "",
      active.length
        ? `Сейчас в работе:\n${active.map((task) => `- ${task.id} • ${epicFromTask(task)} • ${task.title}`).join("\n")}`
        : "Сейчас в работе:\n- Активных задач нет",
      "",
      blocked.length
        ? `Блокеры:\n${blocked.map((task) => `- ${task.id} • ${task.title}`).join("\n")}`
        : "Блокеры:\n- Явных блокеров нет"
    ].join("\n");
  }

  applyWorkerResults(task: WorkTask, results: WorkerExecutionResult[]) {
    task.status = "in_progress";
    task.updatedAt = now();

    for (const result of results) {
      const assignment = task.assignments.find((item) => item.id === result.assignmentId);
      if (!assignment) {
        continue;
      }

      assignment.status = result.status;
      assignment.result = result.detailedResult;
      assignment.resultSummary = result.resultSummary;
      assignment.lastUpdatedAt = now();
      assignment.runtime = result.runtime;
      assignment.externalRunId = result.externalRunId;
      assignment.lastError = result.lastError;
      task.comments.push({
        id: slugId("comment"),
        author: result.specialty,
        body: [
          result.runtime ? `Runtime: ${result.runtime}` : "",
          result.externalRunId ? `Run ID: ${result.externalRunId}` : "",
          result.lastError ? `Error: ${result.lastError}` : "",
          result.detailedResult
        ]
          .filter(Boolean)
          .join("\n"),
        createdAt: now(),
        source: "local"
      });
    }

    if (task.assignments.every((item) => item.status === "done")) {
      task.status = "done";
      task.comments.push({
        id: slugId("comment"),
        author: "lead",
        body: "Lead marked all specialist tracks as done and ready for review.",
        createdAt: now(),
        source: "local"
      });
    }

    return task;
  }
}
