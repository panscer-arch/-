#!/usr/bin/env node

const { WorkerEngine } = await import("../dist/agents/workers.js");

const engine = new WorkerEngine();
const task = {
  id: "task_smoke",
  title: "Smoke test command worker",
  source: "manual",
  status: "triaged",
  priority: "medium",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  requester: {},
  description: "Verify that the configured external agent runtime works end-to-end.",
  labels: ["smoke-test"],
  comments: [],
  assignments: [
    {
      id: "assignment_smoke",
      specialty: "backend",
      title: "backend workstream",
      brief: "Return a short execution result for smoke testing.",
      ownedFiles: ["apps/orchestrator/src/agents/workers.ts"],
      acceptanceCriteria: ["Return a concise response"],
      status: "queued"
    }
  ]
};

const results = await engine.execute(task);
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
