export type AgentSpecialty =
  | "lead"
  | "product"
  | "frontend"
  | "backend"
  | "data"
  | "qa"
  | "devops";

export type TaskStatus = "new" | "triaged" | "in_progress" | "blocked" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";

export interface MessageContext {
  updateId?: number;
  messageId?: number;
  chatId: number;
  userId: number;
  username?: string;
  text: string;
  receivedAt: string;
}

export interface TaskComment {
  id: string;
  author: AgentSpecialty;
  body: string;
  createdAt: string;
  source?: "local" | "github" | "telegram";
}

export interface SpecialistAssignment {
  id: string;
  specialty: Exclude<AgentSpecialty, "lead">;
  title: string;
  brief: string;
  ownedFiles: string[];
  acceptanceCriteria: string[];
  status: "queued" | "working" | "done";
  result?: string;
  resultSummary?: string;
  lastUpdatedAt?: string;
  runtime?: "template" | "command";
  externalRunId?: string;
  lastError?: string;
}

export interface WorkTask {
  id: string;
  title: string;
  source: "telegram" | "github" | "manual";
  status: TaskStatus;
  priority: TaskPriority;
  primaryOwner?: Exclude<AgentSpecialty, "lead">;
  createdAt: string;
  updatedAt: string;
  requester: {
    chatId?: number;
    userId?: number;
    username?: string;
  };
  telegramUpdateId?: number;
  telegramMessageId?: number;
  description: string;
  labels: string[];
  summary?: string;
  githubIssueNumber?: number;
  githubIssueUrl?: string;
  githubIssueState?: "open" | "closed";
  githubLastCommentSyncAt?: string;
  githubBranchName?: string;
  githubPrNumber?: number;
  githubPrUrl?: string;
  githubPrState?: "open" | "closed" | "merged" | "draft";
  comments: TaskComment[];
  assignments: SpecialistAssignment[];
}

export interface RepositoryMemory {
  tasks: WorkTask[];
  telegram: {
    lastUpdateId: number;
  };
  github: {
    lastIssueSyncAt?: string;
  };
}

export interface GitHubIssueSummary {
  number: number;
  title: string;
  body: string;
  htmlUrl: string;
  updatedAt?: string;
  state?: "open" | "closed";
}

export interface GitHubPullRequestSummary {
  number: number;
  htmlUrl: string;
  title: string;
  state?: "open" | "closed" | "merged" | "draft";
}

export interface AgentResult {
  specialty: Exclude<AgentSpecialty, "lead">;
  summary: string;
  labels: string[];
  suggestedOwnedFiles: string[];
  acceptanceCriteria: string[];
}

export interface WorkerExecutionResult {
  assignmentId: string;
  specialty: Exclude<AgentSpecialty, "lead">;
  status: SpecialistAssignment["status"];
  resultSummary: string;
  detailedResult: string;
  runtime?: "template" | "command";
  externalRunId?: string;
  lastError?: string;
}

export interface GitHubIssueComment {
  id: number;
  body: string;
  createdAt: string;
  htmlUrl: string;
  authorLogin?: string;
}

export interface GitHubPullRequestReview {
  id: number;
  body: string;
  submittedAt: string;
  htmlUrl: string;
  authorLogin?: string;
  state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED" | "PENDING";
}
