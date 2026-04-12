import { Pool } from "pg";
import { config } from "../config.js";
import type { RepositoryMemory, WorkTask } from "../types.js";
import type { MemoryStore } from "./store.js";

const defaultMemoryMeta: RepositoryMemory = {
  tasks: [],
  telegram: { lastUpdateId: 0 },
  github: { lastIssueSyncAt: undefined }
};

type MetaRow = {
  key: string;
  value: unknown;
};

export class PostgresMemoryStore implements MemoryStore {
  private pool: Pool;

  constructor() {
    if (!config.postgres.url) {
      throw new Error("DATABASE_URL is required for postgres persistence mode.");
    }

    this.pool = new Pool({
      connectionString: config.postgres.url
    });
  }

  async ensure() {
    await this.pool.query(`create schema if not exists ${config.postgres.schema}`);
    await this.pool.query(`
      create table if not exists ${config.postgres.schema}.tasks (
        id text primary key,
        payload jsonb not null,
        github_issue_number integer,
        created_at timestamptz not null default now(),
        updated_at timestamptz not null default now()
      );
    `);
    await this.pool.query(`
      create index if not exists idx_tasks_github_issue_number
      on ${config.postgres.schema}.tasks (github_issue_number);
    `);
    await this.pool.query(`
      create table if not exists ${config.postgres.schema}.meta (
        key text primary key,
        value jsonb not null,
        updated_at timestamptz not null default now()
      );
    `);

    await this.ensureMetaKey("telegram.last_update_id", defaultMemoryMeta.telegram.lastUpdateId);
    await this.ensureMetaKey(
      "github.last_issue_sync_at",
      defaultMemoryMeta.github.lastIssueSyncAt ?? null
    );
  }

  async saveTask(task: WorkTask) {
    await this.pool.query(
      `
      insert into ${config.postgres.schema}.tasks (id, payload, github_issue_number, updated_at)
      values ($1, $2::jsonb, $3, now())
      on conflict (id)
      do update set
        payload = excluded.payload,
        github_issue_number = excluded.github_issue_number,
        updated_at = now()
      `,
      [task.id, JSON.stringify(task), task.githubIssueNumber ?? null]
    );
  }

  async listTasks() {
    const result = await this.pool.query<{ payload: WorkTask }>(
      `
      select payload
      from ${config.postgres.schema}.tasks
      order by updated_at desc
      `
    );
    return result.rows.map((row) => row.payload);
  }

  async getTask(taskId: string) {
    const result = await this.pool.query(
      `select payload from ${config.postgres.schema}.tasks where id = $1 limit 1`,
      [taskId]
    );
    return (result.rows[0]?.payload as WorkTask | undefined) ?? null;
  }

  async getTaskByIssueNumber(issueNumber: number) {
    const result = await this.pool.query(
      `select payload from ${config.postgres.schema}.tasks where github_issue_number = $1 limit 1`,
      [issueNumber]
    );
    return (result.rows[0]?.payload as WorkTask | undefined) ?? null;
  }

  async setLastTelegramUpdateId(lastUpdateId: number) {
    await this.setMetaValue("telegram.last_update_id", lastUpdateId);
  }

  async getLastTelegramUpdateId() {
    const value = await this.getMetaValue<number>("telegram.last_update_id");
    return value ?? 0;
  }

  async setLastGitHubIssueSyncAt(timestamp: string) {
    await this.setMetaValue("github.last_issue_sync_at", timestamp);
  }

  async getLastGitHubIssueSyncAt() {
    const value = await this.getMetaValue<string | null>("github.last_issue_sync_at");
    return value ?? undefined;
  }

  private async ensureMetaKey(key: string, value: unknown) {
    await this.pool.query(
      `
      insert into ${config.postgres.schema}.meta (key, value)
      values ($1, $2::jsonb)
      on conflict (key) do nothing
      `,
      [key, JSON.stringify(value)]
    );
  }

  private async setMetaValue(key: string, value: unknown) {
    await this.pool.query(
      `
      insert into ${config.postgres.schema}.meta (key, value, updated_at)
      values ($1, $2::jsonb, now())
      on conflict (key)
      do update set value = excluded.value, updated_at = now()
      `,
      [key, JSON.stringify(value)]
    );
  }

  private async getMetaValue<T>(key: string): Promise<T | undefined> {
    const result = await this.pool.query(
      `select key, value from ${config.postgres.schema}.meta where key = $1 limit 1`,
      [key]
    );
    const row = result.rows[0] as MetaRow | undefined;
    return row?.value as T | undefined;
  }
}
