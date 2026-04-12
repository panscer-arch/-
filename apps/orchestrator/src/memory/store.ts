import type { WorkTask } from "../types.js";

export interface MemoryStore {
  ensure(): Promise<void>;
  saveTask(task: WorkTask): Promise<void>;
  listTasks(): Promise<WorkTask[]>;
  getTask(taskId: string): Promise<WorkTask | null>;
  getTaskByIssueNumber(issueNumber: number): Promise<WorkTask | null>;
  setLastTelegramUpdateId(lastUpdateId: number): Promise<void>;
  getLastTelegramUpdateId(): Promise<number>;
  setLastGitHubIssueSyncAt(timestamp: string): Promise<void>;
  getLastGitHubIssueSyncAt(): Promise<string | undefined>;
}
