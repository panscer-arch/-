import { OrchestratorApp } from "./orchestrator.js";

async function main() {
  const app = new OrchestratorApp();
  await app.start();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
