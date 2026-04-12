import { config, hasGitHubConfig } from "../config.js";
import type {
  GitHubIssueComment,
  GitHubIssueSummary,
  GitHubPullRequestSummary,
  GitHubPullRequestReview,
  WorkTask
} from "../types.js";

function issueBodyFromTask(task: WorkTask) {
  const assignmentBlock = task.assignments
    .map(
      (assignment) =>
        `### ${assignment.specialty}\n- Title: ${assignment.title}\n- Brief: ${assignment.brief}\n- Owned files: ${assignment.ownedFiles.join(", ") || "TBD"}\n- Acceptance:\n${assignment.acceptanceCriteria.map((line) => `  - ${line}`).join("\n")}`
    )
    .join("\n\n");

  return [
    `## Request`,
    task.description,
    ``,
    `## Lead summary`,
    task.summary ?? "Pending summary",
    ``,
    `## Assignments`,
    assignmentBlock || "No assignments yet"
  ].join("\n");
}

export class GitHubClient {
  private headers() {
    return {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.github.token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": config.appName
    };
  }

  async createIssueFromTask(task: WorkTask): Promise<GitHubIssueSummary | null> {
    if (!hasGitHubConfig()) {
      return null;
    }

    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/issues`,
      {
        method: "POST",
        headers: {
          ...this.headers(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: task.title,
          body: issueBodyFromTask(task),
          labels: task.labels
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub issue creation failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as {
      number: number;
      title: string;
      body: string;
      html_url: string;
    };

    return {
      number: json.number,
      title: json.title,
      body: json.body,
      htmlUrl: json.html_url,
      updatedAt: undefined,
      state: "open"
    };
  }

  async commentOnIssue(issueNumber: number, body: string) {
    if (!hasGitHubConfig()) {
      return;
    }

    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/issues/${issueNumber}/comments`,
      {
        method: "POST",
        headers: {
          ...this.headers(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ body })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub comment failed: ${response.status} ${text}`);
    }
  }

  async listRecentIssues(since?: string): Promise<GitHubIssueSummary[]> {
    if (!hasGitHubConfig()) {
      return [];
    }

    const url = new URL(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/issues`
    );
    url.searchParams.set("state", "all");
    url.searchParams.set("sort", "updated");
    url.searchParams.set("direction", "desc");
    url.searchParams.set("per_page", "20");
    if (since) {
      url.searchParams.set("since", since);
    }

    const response = await fetch(url, {
      headers: this.headers()
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub issue list failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as Array<{
      number: number;
      title: string;
      body: string;
      html_url: string;
      updated_at: string;
      state: "open" | "closed";
      pull_request?: unknown;
    }>;

    return json
      .filter((item) => !item.pull_request)
      .map((item) => ({
        number: item.number,
        title: item.title,
        body: item.body,
        htmlUrl: item.html_url,
        updatedAt: item.updated_at,
        state: item.state
      }));
  }

  async listIssueComments(issueNumber: number): Promise<GitHubIssueComment[]> {
    if (!hasGitHubConfig()) {
      return [];
    }

    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/issues/${issueNumber}/comments?per_page=100`,
      {
        headers: this.headers()
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub comments list failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as Array<{
      id: number;
      body: string;
      created_at: string;
      html_url: string;
      user?: { login?: string };
    }>;

    return json.map((item) => ({
      id: item.id,
      body: item.body,
      createdAt: item.created_at,
      htmlUrl: item.html_url,
      authorLogin: item.user?.login
    }));
  }

  async ensureTaskBranch(task: WorkTask): Promise<string | null> {
    if (!hasGitHubConfig()) {
      return null;
    }

    const branchName = task.githubBranchName ?? this.makeBranchName(task);
    const exists = await this.branchExists(branchName);
    if (exists) {
      return branchName;
    }

    const repo = await this.getRepository();
    const baseSha = await this.getBranchSha(repo.default_branch);

    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/git/refs`,
      {
        method: "POST",
        headers: {
          ...this.headers(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ref: `refs/heads/${branchName}`,
          sha: baseSha
        })
      }
    );

    if (!response.ok && response.status !== 422) {
      const text = await response.text();
      throw new Error(`GitHub branch creation failed: ${response.status} ${text}`);
    }

    return branchName;
  }

  async createDraftPullRequestIfReady(task: WorkTask): Promise<GitHubPullRequestSummary | null> {
    if (!hasGitHubConfig()) {
      return null;
    }

    if (!task.githubBranchName) {
      return null;
    }

    const repo = await this.getRepository();
    const compare = await this.compareBranch(repo.default_branch, task.githubBranchName);
    if (compare.aheadBy < 1) {
      return null;
    }

    const existing = await this.findOpenPullRequest(task.githubBranchName);
    if (existing) {
      return existing;
    }

    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/pulls`,
      {
        method: "POST",
        headers: {
          ...this.headers(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: `WIP: ${task.title}`,
          head: task.githubBranchName,
          base: repo.default_branch,
          body: this.pullRequestBody(task),
          draft: true
        })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub PR creation failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as {
      number: number;
      html_url: string;
      title: string;
    };

    return {
      number: json.number,
      htmlUrl: json.html_url,
      title: json.title,
      state: "draft"
    };
  }

  async updateIssueState(issueNumber: number, state: "open" | "closed") {
    if (!hasGitHubConfig()) {
      return;
    }

    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/issues/${issueNumber}`,
      {
        method: "PATCH",
        headers: {
          ...this.headers(),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ state })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub issue state update failed: ${response.status} ${text}`);
    }
  }

  async getIssue(issueNumber: number): Promise<GitHubIssueSummary | null> {
    if (!hasGitHubConfig()) {
      return null;
    }

    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/issues/${issueNumber}`,
      {
        headers: this.headers()
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub issue lookup failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as {
      number: number;
      title: string;
      body: string;
      html_url: string;
      updated_at: string;
      state: "open" | "closed";
    };

    return {
      number: json.number,
      title: json.title,
      body: json.body,
      htmlUrl: json.html_url,
      updatedAt: json.updated_at,
      state: json.state
    };
  }

  async getPullRequest(prNumber: number): Promise<GitHubPullRequestSummary | null> {
    if (!hasGitHubConfig()) {
      return null;
    }

    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/pulls/${prNumber}`,
      {
        headers: this.headers()
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub PR lookup failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as {
      number: number;
      html_url: string;
      title: string;
      state: "open" | "closed";
      merged: boolean;
      draft: boolean;
    };

    return {
      number: json.number,
      htmlUrl: json.html_url,
      title: json.title,
      state: json.merged ? "merged" : json.draft ? "draft" : json.state
    };
  }

  async listPullRequestReviews(prNumber: number): Promise<GitHubPullRequestReview[]> {
    if (!hasGitHubConfig()) {
      return [];
    }

    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/pulls/${prNumber}/reviews?per_page=100`,
      {
        headers: this.headers()
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub PR reviews failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as Array<{
      id: number;
      body: string;
      submitted_at: string | null;
      html_url: string;
      state: GitHubPullRequestReview["state"];
      user?: { login?: string };
    }>;

    return json.map((item) => ({
      id: item.id,
      body: item.body || "",
      submittedAt: item.submitted_at ?? new Date(0).toISOString(),
      htmlUrl: item.html_url,
      authorLogin: item.user?.login,
      state: item.state
    }));
  }

  private makeBranchName(task: WorkTask) {
    const slug = task.title
      .toLowerCase()
      .replace(/[^a-z0-9а-яё]+/gi, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 32);
    return `codex/${task.id}-${slug || "task"}`;
  }

  private async getRepository() {
    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}`,
      {
        headers: this.headers()
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub repo lookup failed: ${response.status} ${text}`);
    }

    return (await response.json()) as { default_branch: string };
  }

  private async getBranchSha(branch: string) {
    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/git/ref/heads/${branch}`,
      {
        headers: this.headers()
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub branch SHA lookup failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as { object: { sha: string } };
    return json.object.sha;
  }

  private async branchExists(branch: string) {
    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/git/ref/heads/${branch}`,
      {
        headers: this.headers()
      }
    );

    if (response.status === 404) {
      return false;
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub branch existence check failed: ${response.status} ${text}`);
    }

    return true;
  }

  private async compareBranch(base: string, head: string) {
    const response = await fetch(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/compare/${base}...${head}`,
      {
        headers: this.headers()
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub compare failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as { ahead_by: number };
    return { aheadBy: json.ahead_by };
  }

  private async findOpenPullRequest(branch: string): Promise<GitHubPullRequestSummary | null> {
    const url = new URL(
      `${config.github.baseUrl}/repos/${config.github.owner}/${config.github.repo}/pulls`
    );
    url.searchParams.set("state", "open");
    url.searchParams.set("head", `${config.github.owner}:${branch}`);

    const response = await fetch(url, {
      headers: this.headers()
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`GitHub PR lookup failed: ${response.status} ${text}`);
    }

    const json = (await response.json()) as Array<{
      number: number;
      html_url: string;
      title: string;
    }>;

    const pr = json[0];
    if (!pr) {
      return null;
    }

    return {
      number: pr.number,
      htmlUrl: pr.html_url,
      title: pr.title,
      state: "open"
    };
  }

  private pullRequestBody(task: WorkTask) {
    return [
      `## Linked task`,
      `- Task ID: ${task.id}`,
      task.githubIssueUrl ? `- Issue: ${task.githubIssueUrl}` : "- Issue: not linked",
      ``,
      `## Lead summary`,
      task.summary ?? "Pending summary",
      ``,
      `## Assignment tracks`,
      ...task.assignments.map(
        (assignment) =>
          `- ${assignment.specialty}: ${assignment.resultSummary ?? assignment.brief}`
      )
    ].join("\n");
  }
}
