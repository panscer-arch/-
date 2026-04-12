import fs from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";
import type { RepositoryMemory, WorkTask } from "../types.js";
import type { MemoryStore } from "./store.js";

const memoryFile = path.join(config.runtimeDir, "memory.json");

const defaultMemory: RepositoryMemory = {
  tasks: [],
  telegram: {
    lastUpdateId: 0
  },
  github: {
    lastIssueSyncAt: undefined
  }
};

function normalizeMemory(memory: Partial<RepositoryMemory> | null | undefined): RepositoryMemory {
  return {
    tasks: Array.isArray(memory?.tasks) ? memory.tasks : [],
    telegram: {
      lastUpdateId:
        typeof memory?.telegram?.lastUpdateId === "number" ? memory.telegram.lastUpdateId : 0
    },
    github: {
      lastIssueSyncAt:
        typeof memory?.github?.lastIssueSyncAt === "string"
          ? memory.github.lastIssueSyncAt
          : undefined
    }
  };
}

export class FileMemoryStore implements MemoryStore {
  async ensure() {
    await fs.mkdir(config.runtimeDir, { recursive: true });
    try {
      await fs.access(memoryFile);
    } catch {
      await fs.writeFile(memoryFile, JSON.stringify(defaultMemory, null, 2), "utf8");
    }
  }

  async read(): Promise<RepositoryMemory> {
    await this.ensure();
    const raw = await fs.readFile(memoryFile, "utf8");
    return normalizeMemory(JSON.parse(raw) as Partial<RepositoryMemory>);
  }

  async write(memory: RepositoryMemory) {
    await this.ensure();
    await fs.writeFile(memoryFile, JSON.stringify(normalizeMemory(memory), null, 2), "utf8");
  }

  async saveTask(task: WorkTask) {
    const memory = await this.read();
    const index = memory.tasks.findIndex((item) => item.id === task.id);
    if (index === -1) {
      memory.tasks.unshift(task);
    } else {
      memory.tasks[index] = task;
    }
    await this.write(memory);
  }

  async listTasks() {
    const memory = await this.read();
    return memory.tasks;
  }

  async getTask(taskId: string) {
    const memory = await this.read();
    return memory.tasks.find((item) => item.id === taskId) ?? null;
  }

  async getTaskByIssueNumber(issueNumber: number) {
    const memory = await this.read();
    return memory.tasks.find((item) => item.githubIssueNumber === issueNumber) ?? null;
  }

  async setLastTelegramUpdateId(lastUpdateId: number) {
    const memory = await this.read();
    memory.telegram.lastUpdateId = lastUpdateId;
    await this.write(memory);
  }

  async getLastTelegramUpdateId() {
    const memory = await this.read();
    return memory.telegram.lastUpdateId;
  }

  async setLastGitHubIssueSyncAt(timestamp: string) {
    const memory = await this.read();
    memory.github.lastIssueSyncAt = timestamp;
    await this.write(memory);
  }

  async getLastGitHubIssueSyncAt() {
    const memory = await this.read();
    return memory.github.lastIssueSyncAt;
  }
}
