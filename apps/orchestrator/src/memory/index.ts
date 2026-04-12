import { isPostgresPersistence } from "../config.js";
import { FileMemoryStore } from "./file-store.js";
import { PostgresMemoryStore } from "./postgres-store.js";
import type { MemoryStore } from "./store.js";

export function createMemoryStore(): MemoryStore {
  if (isPostgresPersistence()) {
    return new PostgresMemoryStore();
  }

  return new FileMemoryStore();
}
