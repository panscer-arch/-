import { LeadAgent } from "./agents/lead-agent.js";
import { WorkerEngine } from "./agents/workers.js";
import { config, hasGitHubConfig, hasTelegramConfig, isWebhookMode } from "./config.js";
import { GitHubClient } from "./github/client.js";
import { HttpServer } from "./http-server.js";
import { createMemoryStore } from "./memory/index.js";
import { TelegramClient } from "./telegram/client.js";
import type { AgentSpecialty, MessageContext, WorkTask } from "./types.js";

export class OrchestratorApp {
  private memory = createMemoryStore();
  private lead = new LeadAgent();
  private workers = new WorkerEngine();
  private github = new GitHubClient();
  private telegram = new TelegramClient();
  private httpServer = new HttpServer({
    onTelegramWebhook: async (body) => this.handleTelegramWebhook(body),
    onHealthcheck: () => ({ status: 200, body: JSON.stringify({ ok: true }) })
  });

  async start() {
    await this.memory.ensure();

    if (!hasTelegramConfig()) {
      console.log("Telegram config is missing. The orchestrator is ready but polling is disabled.");
      return;
    }

    if (isWebhookMode()) {
      await this.httpServer.start();
      console.log(
        `Orchestrator webhook server started on port ${config.webhookPort}${config.telegramWebhookPath}`
      );
    } else {
      console.log("Orchestrator polling started.");
    }

    await Promise.all([
      isWebhookMode() ? this.idleLoop() : this.pollLoop(),
      this.githubSyncLoop(),
      this.digestLoop()
    ]);
  }

  private async pollLoop() {
    while (true) {
      try {
        await this.consumeUpdates();
      } catch (error) {
        console.error("Polling cycle failed:", error);
      }
      await sleep(config.pollingIntervalMs);
    }
  }

  private async idleLoop() {
    while (true) {
      await sleep(config.pollingIntervalMs);
    }
  }

  private async githubSyncLoop() {
    if (!hasGitHubConfig()) {
      return;
    }

    while (true) {
      try {
        await this.syncGitHubIntoMemory();
      } catch (error) {
        console.error("GitHub sync failed:", error);
      }
      await sleep(config.githubSyncIntervalMs);
    }
  }

  private async digestLoop() {
    while (true) {
      await sleep(config.digestIntervalMs);
      try {
        await this.sendDailyDigests();
      } catch (error) {
        console.error("Digest loop failed:", error);
      }
    }
  }

  private async consumeUpdates() {
    const offset = (await this.memory.getLastTelegramUpdateId()) + 1;
    const updates = await this.telegram.getUpdates(offset);

    for (const update of updates) {
      const normalized = this.telegram.normalizeMessage(update);
      if (normalized) {
        await this.handleMessage(normalized);
      }
      await this.memory.setLastTelegramUpdateId(update.update_id);
    }
  }

  private async handleTelegramWebhook(rawBody: string) {
    const update = this.telegram.parseWebhookBody(rawBody);
    const normalized = this.telegram.normalizeMessage(update);
    if (normalized) {
      await this.handleMessage(normalized);
    }
    if (typeof update.update_id === "number") {
      await this.memory.setLastTelegramUpdateId(update.update_id);
    }

    return { status: 200, body: JSON.stringify({ ok: true }) };
  }

  private async syncGitHubIntoMemory() {
    const since = await this.memory.getLastGitHubIssueSyncAt();
    const issues = await this.github.listRecentIssues(since);

    for (const issue of issues) {
      const task = await this.memory.getTaskByIssueNumber(issue.number);
      if (!task) {
        continue;
      }

      const previousIssueState = task.githubIssueState;
      const previousPrState = task.githubPrState;
      const knownIds = new Set(task.comments.map((item) => item.id));

      const comments = await this.github.listIssueComments(issue.number);
      for (const comment of comments) {
        const commentId = `github_comment_${comment.id}`;
        if (knownIds.has(commentId)) {
          continue;
        }

        task.comments.push({
          id: commentId,
          author: "lead",
          body: `[GitHub:${comment.authorLogin ?? "unknown"}] ${comment.body}\n${comment.htmlUrl}`,
          createdAt: comment.createdAt,
          source: "github"
        });
        knownIds.add(commentId);
      }

      task.githubIssueUrl = issue.htmlUrl;
      task.githubIssueState = issue.state;

      if (task.githubPrNumber) {
        const pr = await this.github.getPullRequest(task.githubPrNumber);
        if (pr) {
          task.githubPrUrl = pr.htmlUrl;
          task.githubPrState = pr.state;

          const reviews = await this.github.listPullRequestReviews(task.githubPrNumber);
          for (const review of reviews) {
            const reviewId = `github_review_${review.id}`;
            if (knownIds.has(reviewId)) {
              continue;
            }

            task.comments.push({
              id: reviewId,
              author: "lead",
              body: `[GitHubReview:${review.authorLogin ?? "unknown"}:${review.state}] ${review.body}\n${review.htmlUrl}`,
              createdAt: review.submittedAt,
              source: "github"
            });
            knownIds.add(reviewId);

            await this.notifyRequester(
              task,
              `Новый review по ${task.id}: ${review.state} от ${review.authorLogin ?? "unknown"}`
            );
          }
        }
      }

      this.syncTaskStatusFromGitHub(task);
      task.githubLastCommentSyncAt = new Date().toISOString();
      task.updatedAt = new Date().toISOString();
      await this.memory.saveTask(task);

      if (previousIssueState && previousIssueState !== task.githubIssueState) {
        await this.notifyRequester(
          task,
          `GitHub issue для ${task.id} сменил статус: ${previousIssueState} -> ${task.githubIssueState}`
        );
      }

      if (previousPrState && previousPrState !== task.githubPrState) {
        await this.notifyRequester(
          task,
          `GitHub PR для ${task.id} сменил статус: ${previousPrState} -> ${task.githubPrState}`
        );
      }
    }

    await this.memory.setLastGitHubIssueSyncAt(new Date().toISOString());
  }

  private async handleMessage(message: MessageContext) {
    const duplicate = await this.findDuplicateTelegramTask(message);
    if (duplicate) {
      await this.memory.setLastTelegramUpdateId(message.updateId ?? (await this.memory.getLastTelegramUpdateId()));
      return;
    }

    if (message.text === "/start" || message.text === "/help") {
      await this.telegram.sendMessage(
        message.chatId,
        [
          "Я lead-agent для проекта.",
          "Просто напиши задачу обычным сообщением.",
          "Команды:",
          "/project - прогресс проекта в цифрах",
          "/roadmap - прогресс по эпикам",
          "/status - последние задачи",
          "/digest - короткая сводка",
          "/tasks <new|triaged|in_progress|blocked|done> - фильтр по статусу",
          "/blocked - список заблокированных задач",
          "/sync - краткий статус по памяти",
          "/task <id> - детали задачи",
          "/comment <id> <text> - комментарий lead-agent",
          "/done <id> - отметить задачу выполненной",
          "/blocked <id> - пометить задачу заблокированной",
          "/unblock <id> - снять блокировку",
          "/reopen <id> - вернуть задачу в работу",
          "/priority <id> <low|medium|high|critical> - сменить приоритет",
          "/label <id> <label> - добавить label",
          "/owner <id> <role> - назначить owner",
          "/assign <id> <role> - назначить основной поток",
          "/branch <id> - создать GitHub branch",
          "/pr <id> - открыть draft PR, если в ветке уже есть коммиты"
        ].join("\n")
      );
      return;
    }

    if (message.text === "/project") {
      const tasks = await this.memory.listTasks();
      await this.telegram.sendMessage(message.chatId, this.lead.makeProjectSummary(tasks));
      return;
    }

    if (message.text === "/roadmap") {
      const tasks = await this.memory.listTasks();
      await this.telegram.sendMessage(message.chatId, this.lead.makeRoadmap(tasks));
      return;
    }

    if (message.text === "/status" || message.text === "/sync") {
      const tasks = await this.memory.listTasks();
      await this.telegram.sendMessage(message.chatId, this.lead.makeStatusDigest(tasks));
      return;
    }

    if (message.text === "/digest") {
      const tasks = await this.memory.listTasks();
      await this.telegram.sendMessage(message.chatId, this.lead.makeCompactDigest(tasks));
      return;
    }

    if (message.text === "/blocked") {
      const tasks = await this.memory.listTasks();
      await this.telegram.sendMessage(message.chatId, this.lead.makeBlockedDigest(tasks));
      return;
    }

    if (message.text.startsWith("/tasks ")) {
      const filter = message.text.replace("/tasks ", "").trim() as WorkTask["status"];
      const allowed: WorkTask["status"][] = ["new", "triaged", "in_progress", "blocked", "done"];
      if (!allowed.includes(filter)) {
        await this.telegram.sendMessage(
          message.chatId,
          "Usage: /tasks <new|triaged|in_progress|blocked|done>"
        );
        return;
      }
      const tasks = await this.memory.listTasks();
      await this.telegram.sendMessage(message.chatId, this.lead.makeFilteredDigest(tasks, filter));
      return;
    }

    if (message.text.startsWith("/task ")) {
      const taskId = message.text.replace("/task ", "").trim();
      const task = await this.memory.getTask(taskId);
      await this.telegram.sendMessage(
        message.chatId,
        task ? this.lead.makeTaskDetails(task) : `Task not found: ${taskId}`
      );
      return;
    }

    if (message.text.startsWith("/comment ")) {
      const payload = message.text.replace("/comment ", "").trim();
      const [taskId, ...commentParts] = payload.split(" ");
      const commentBody = commentParts.join(" ").trim();
      const task = taskId ? await this.memory.getTask(taskId) : null;
      if (!task || !commentBody) {
        await this.telegram.sendMessage(message.chatId, "Usage: /comment <task_id> <text>");
        return;
      }

      task.comments.push({
        id: `comment_manual_${Date.now()}`,
        author: "lead",
        body: commentBody,
        createdAt: new Date().toISOString(),
        source: "telegram"
      });
      task.updatedAt = new Date().toISOString();
      await this.memory.saveTask(task);
      if (task.githubIssueNumber) {
        await this.github.commentOnIssue(task.githubIssueNumber, `## lead\n${commentBody}`);
      }
      await this.telegram.sendMessage(message.chatId, `Комментарий добавлен в ${task.id}.`);
      return;
    }

    if (message.text.startsWith("/done ")) {
      const taskId = message.text.replace("/done ", "").trim();
      const task = await this.memory.getTask(taskId);
      if (!task) {
        await this.telegram.sendMessage(message.chatId, `Task not found: ${taskId}`);
        return;
      }

      task.status = "done";
      task.updatedAt = new Date().toISOString();
      task.githubIssueState = "closed";
      task.comments.push({
        id: `comment_done_${Date.now()}`,
        author: "lead",
        body: "Task marked as done from Telegram.",
        createdAt: new Date().toISOString(),
        source: "telegram"
      });
      await this.memory.saveTask(task);
      if (task.githubIssueNumber) {
        await this.github.commentOnIssue(task.githubIssueNumber, "## lead\nTask marked as done from Telegram.");
        await this.github.updateIssueState(task.githubIssueNumber, "closed");
      }
      await this.telegram.sendMessage(message.chatId, `Задача ${task.id} отмечена как done.`);
      return;
    }

    if (message.text.startsWith("/blocked ")) {
      const taskId = message.text.replace("/blocked ", "").trim();
      const task = await this.memory.getTask(taskId);
      if (!task) {
        await this.telegram.sendMessage(message.chatId, `Task not found: ${taskId}`);
        return;
      }

      task.status = "blocked";
      task.updatedAt = new Date().toISOString();
      task.comments.push({
        id: `comment_blocked_${Date.now()}`,
        author: "lead",
        body: "Task marked as blocked from Telegram.",
        createdAt: new Date().toISOString(),
        source: "telegram"
      });
      await this.memory.saveTask(task);
      if (task.githubIssueNumber) {
        await this.github.commentOnIssue(task.githubIssueNumber, "## lead\nTask marked as blocked from Telegram.");
      }
      await this.telegram.sendMessage(message.chatId, `Задача ${task.id} переведена в blocked.`);
      return;
    }

    if (message.text.startsWith("/unblock ") || message.text.startsWith("/reopen ")) {
      const prefix = message.text.startsWith("/unblock ") ? "/unblock " : "/reopen ";
      const taskId = message.text.replace(prefix, "").trim();
      const task = await this.memory.getTask(taskId);
      if (!task) {
        await this.telegram.sendMessage(message.chatId, `Task not found: ${taskId}`);
        return;
      }

      task.status = "in_progress";
      task.updatedAt = new Date().toISOString();
      task.comments.push({
        id: `comment_reopen_${Date.now()}`,
        author: "lead",
        body: "Task returned to in_progress from Telegram.",
        createdAt: new Date().toISOString(),
        source: "telegram"
      });
      if (task.githubIssueNumber && task.githubIssueState === "closed") {
        await this.github.updateIssueState(task.githubIssueNumber, "open");
        task.githubIssueState = "open";
        await this.github.commentOnIssue(task.githubIssueNumber, "## lead\nTask reopened from Telegram.");
      } else if (task.githubIssueNumber) {
        await this.github.commentOnIssue(task.githubIssueNumber, "## lead\nTask moved back to in_progress from Telegram.");
      }
      await this.memory.saveTask(task);
      await this.telegram.sendMessage(message.chatId, `Задача ${task.id} снова в работе.`);
      return;
    }

    if (message.text.startsWith("/assign ")) {
      const payload = message.text.replace("/assign ", "").trim();
      const [taskId, role] = payload.split(/\s+/, 2);
      const task = taskId ? await this.memory.getTask(taskId) : null;
      const allowedRoles: AgentSpecialty[] = [
        "lead",
        "product",
        "frontend",
        "backend",
        "data",
        "qa",
        "devops"
      ];

      if (!task || !role || !allowedRoles.includes(role as AgentSpecialty) || role === "lead") {
        await this.telegram.sendMessage(
          message.chatId,
          "Usage: /assign <task_id> <product|frontend|backend|data|qa|devops>"
        );
        return;
      }

      const assignment = task.assignments.find((item) => item.specialty === role);
      if (!assignment) {
        await this.telegram.sendMessage(message.chatId, `Assignment track not found for role ${role}.`);
        return;
      }

      assignment.status = "working";
      assignment.lastUpdatedAt = new Date().toISOString();
      task.status = "in_progress";
      task.updatedAt = new Date().toISOString();
      task.comments.push({
        id: `comment_assign_${Date.now()}`,
        author: "lead",
        body: `Lead assigned active ownership to ${role}.`,
        createdAt: new Date().toISOString(),
        source: "telegram"
      });

      if (task.githubIssueNumber) {
        await this.github.commentOnIssue(task.githubIssueNumber, `## lead\nAssigned active ownership to ${role}.`);
        if (task.githubIssueState === "closed") {
          await this.github.updateIssueState(task.githubIssueNumber, "open");
          task.githubIssueState = "open";
        }
      }

      await this.memory.saveTask(task);
      await this.telegram.sendMessage(message.chatId, `Активный поток назначен: ${role} для ${task.id}.`);
      return;
    }

    if (message.text.startsWith("/owner ")) {
      const payload = message.text.replace("/owner ", "").trim();
      const [taskId, role] = payload.split(/\s+/, 2);
      const task = taskId ? await this.memory.getTask(taskId) : null;
      const allowedRoles: Exclude<AgentSpecialty, "lead">[] = [
        "product",
        "frontend",
        "backend",
        "data",
        "qa",
        "devops"
      ];

      if (!task || !role || !allowedRoles.includes(role as Exclude<AgentSpecialty, "lead">)) {
        await this.telegram.sendMessage(
          message.chatId,
          "Usage: /owner <task_id> <product|frontend|backend|data|qa|devops>"
        );
        return;
      }

      task.primaryOwner = role as Exclude<AgentSpecialty, "lead">;
      task.updatedAt = new Date().toISOString();
      task.comments.push({
        id: `comment_owner_${Date.now()}`,
        author: "lead",
        body: `Lead assigned primary owner: ${task.primaryOwner}.`,
        createdAt: new Date().toISOString(),
        source: "telegram"
      });
      await this.memory.saveTask(task);
      if (task.githubIssueNumber) {
        await this.github.commentOnIssue(task.githubIssueNumber, `## lead\nPrimary owner set to ${task.primaryOwner}.`);
      }
      await this.telegram.sendMessage(message.chatId, `Owner для ${task.id}: ${task.primaryOwner}.`);
      return;
    }

    if (message.text.startsWith("/priority ")) {
      const payload = message.text.replace("/priority ", "").trim();
      const [taskId, priority] = payload.split(/\s+/, 2);
      const task = taskId ? await this.memory.getTask(taskId) : null;
      const allowedPriorities: WorkTask["priority"][] = ["low", "medium", "high", "critical"];

      if (!task || !priority || !allowedPriorities.includes(priority as WorkTask["priority"])) {
        await this.telegram.sendMessage(
          message.chatId,
          "Usage: /priority <task_id> <low|medium|high|critical>"
        );
        return;
      }

      task.priority = priority as WorkTask["priority"];
      task.updatedAt = new Date().toISOString();
      task.comments.push({
        id: `comment_priority_${Date.now()}`,
        author: "lead",
        body: `Lead changed priority to ${task.priority}.`,
        createdAt: new Date().toISOString(),
        source: "telegram"
      });
      await this.memory.saveTask(task);
      if (task.githubIssueNumber) {
        await this.github.commentOnIssue(task.githubIssueNumber, `## lead\nPriority changed to ${task.priority}.`);
      }
      await this.telegram.sendMessage(message.chatId, `Приоритет ${task.id}: ${task.priority}.`);
      return;
    }

    if (message.text.startsWith("/label ")) {
      const payload = message.text.replace("/label ", "").trim();
      const [taskId, ...labelParts] = payload.split(/\s+/);
      const label = labelParts.join("-").trim().toLowerCase();
      const task = taskId ? await this.memory.getTask(taskId) : null;

      if (!task || !label) {
        await this.telegram.sendMessage(message.chatId, "Usage: /label <task_id> <label>");
        return;
      }

      if (!task.labels.includes(label)) {
        task.labels.push(label);
      }
      task.updatedAt = new Date().toISOString();
      task.comments.push({
        id: `comment_label_${Date.now()}`,
        author: "lead",
        body: `Lead added label: ${label}.`,
        createdAt: new Date().toISOString(),
        source: "telegram"
      });
      await this.memory.saveTask(task);
      if (task.githubIssueNumber) {
        await this.github.commentOnIssue(task.githubIssueNumber, `## lead\nAdded label ${label}.`);
      }
      await this.telegram.sendMessage(message.chatId, `Label добавлен в ${task.id}: ${label}.`);
      return;
    }

    if (message.text.startsWith("/branch ")) {
      const taskId = message.text.replace("/branch ", "").trim();
      const task = await this.memory.getTask(taskId);
      if (!task) {
        await this.telegram.sendMessage(message.chatId, `Task not found: ${taskId}`);
        return;
      }
      if (!hasGitHubConfig()) {
        await this.telegram.sendMessage(message.chatId, "GitHub config is missing.");
        return;
      }

      task.githubBranchName = (await this.github.ensureTaskBranch(task)) ?? undefined;
      task.updatedAt = new Date().toISOString();
      await this.memory.saveTask(task);
      await this.telegram.sendMessage(
        message.chatId,
        task.githubBranchName
          ? `Branch ready: ${task.githubBranchName}`
          : "Branch was not created."
      );
      return;
    }

    if (message.text.startsWith("/pr ")) {
      const taskId = message.text.replace("/pr ", "").trim();
      const task = await this.memory.getTask(taskId);
      if (!task) {
        await this.telegram.sendMessage(message.chatId, `Task not found: ${taskId}`);
        return;
      }
      if (!hasGitHubConfig()) {
        await this.telegram.sendMessage(message.chatId, "GitHub config is missing.");
        return;
      }

      if (!task.githubBranchName) {
        task.githubBranchName = (await this.github.ensureTaskBranch(task)) ?? undefined;
      }

      const pr = await this.github.createDraftPullRequestIfReady(task);
      if (pr) {
        task.githubPrNumber = pr.number;
        task.githubPrUrl = pr.htmlUrl;
        task.githubPrState = pr.state;
        task.updatedAt = new Date().toISOString();
        await this.memory.saveTask(task);
        await this.telegram.sendMessage(message.chatId, `Draft PR ready: ${pr.htmlUrl}`);
      } else {
        await this.memory.saveTask(task);
        await this.telegram.sendMessage(
          message.chatId,
          "Branch exists, but PR is not ready yet. Push commits to that branch first."
        );
      }
      return;
    }

    const task = this.lead.triage(message);
    if (hasGitHubConfig()) {
      const issue = await this.github.createIssueFromTask(task);
      if (issue) {
        task.githubIssueNumber = issue.number;
        task.githubIssueUrl = issue.htmlUrl;
        task.githubIssueState = issue.state;
        task.comments.push({
          id: `comment_issue_${issue.number}`,
          author: "lead",
          body: `Created GitHub issue ${issue.htmlUrl}`,
          createdAt: new Date().toISOString(),
          source: "github"
        });
      }
      task.githubBranchName = (await this.github.ensureTaskBranch(task)) ?? undefined;
    }

    task.status = "in_progress";
    task.updatedAt = new Date().toISOString();
    await this.memory.saveTask(task);
    await this.telegram.sendMessage(
      message.chatId,
      this.lead.makeTelegramConfirmation(task, task.githubIssueUrl)
    );

    const workerResults = await this.workers.execute(task);
    this.lead.applyWorkerResults(task, workerResults);

    if (task.githubIssueNumber) {
      for (const assignment of task.assignments) {
        if (assignment.result) {
          await this.github.commentOnIssue(
            task.githubIssueNumber,
            `## ${assignment.specialty}\n${assignment.result}`
          );
        }
      }
    }

    await this.memory.saveTask(task);
    await this.telegram.sendMessage(message.chatId, `Задача ${task.id} обработана. Статус: ${task.status}`);
  }

  private async findDuplicateTelegramTask(message: MessageContext) {
    if (!message.updateId && !message.messageId) {
      return null;
    }

    const tasks = await this.memory.listTasks();
    return (
      tasks.find(
        (task) =>
          task.source === "telegram" &&
          ((message.updateId && task.telegramUpdateId === message.updateId) ||
            (message.messageId &&
              task.requester.chatId === message.chatId &&
              task.telegramMessageId === message.messageId))
      ) ?? null
    );
  }

  private syncTaskStatusFromGitHub(task: WorkTask) {
    if (task.githubPrState === "merged") {
      task.status = "done";
      return;
    }

    if (task.githubPrState === "open" || task.githubPrState === "draft") {
      task.status = "in_progress";
      return;
    }

    if (task.githubIssueState === "closed") {
      task.status = "done";
      return;
    }

    if (task.githubIssueState === "open" && (task.status === "done" || task.status === "blocked")) {
      task.status = "in_progress";
    }
  }

  private async notifyRequester(task: WorkTask, text: string) {
    if (!task.requester.chatId) {
      return;
    }

    try {
      await this.telegram.sendMessage(task.requester.chatId, text);
    } catch (error) {
      console.error("Telegram notify failed:", error);
    }
  }

  private async sendDailyDigests() {
    const tasks = await this.memory.listTasks();
    const chatIds = new Set(
      tasks.map((task) => task.requester.chatId).filter((value): value is number => Boolean(value))
    );

    for (const chatId of chatIds) {
      const chatTasks = tasks.filter((task) => task.requester.chatId === chatId);
      await this.telegram.sendMessage(chatId, this.lead.makeDailyProjectReport(chatTasks));
    }
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
