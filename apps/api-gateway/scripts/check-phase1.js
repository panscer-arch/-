const fs = require("node:fs");
const path = require("node:path");
const { loadLocalEnv } = require("../src/load-env");

loadLocalEnv();

function exists(targetPath) {
  return fs.existsSync(targetPath);
}

function checkEnv() {
  return {
    databaseUrl: Boolean(process.env.DATABASE_URL),
    analyticsDataMode: process.env.ANALYTICS_DATA_MODE || "stub",
  };
}

function checkFiles() {
  const root = process.cwd();
  return {
    prismaSchema: exists(path.join(root, "prisma", "schema.prisma")),
    prismaClient: exists(path.join(root, "..", "..", "node_modules", "@prisma", "client", "package.json")),
    seedScript: exists(path.join(root, "scripts", "seed-phase1.js")),
    envExample: exists(path.join(root, ".env.example")),
  };
}

function printRow(label, ok, detail = "") {
  const status = ok ? "OK " : "NO ";
  console.log(`${status} ${label}${detail ? ` — ${detail}` : ""}`);
}

function main() {
  const env = checkEnv();
  const files = checkFiles();

  console.log("Phase 1 readiness check\n");

  printRow("DATABASE_URL", env.databaseUrl, env.databaseUrl ? "configured" : "missing");
  printRow("ANALYTICS_DATA_MODE", true, env.analyticsDataMode);
  printRow("prisma/schema.prisma", files.prismaSchema);
  printRow("@prisma/client", files.prismaClient);
  printRow("seed-phase1.js", files.seedScript);
  printRow(".env.example", files.envExample);

  console.log("\nRecommended order:");
  console.log("1. Set DATABASE_URL");
  console.log("2. Set ANALYTICS_DATA_MODE=database");
  console.log("3. npm run prisma:push --workspace @lifecoding/api-gateway");
  console.log("4. npm run seed:phase1 --workspace @lifecoding/api-gateway");
  console.log("5. Restart api-gateway");
  console.log("6. Open /health and verify analyticsDataMode=database");

  const readyForDbMode =
    env.databaseUrl &&
    files.prismaSchema &&
    files.prismaClient &&
    files.seedScript;

  console.log(
    `\nResult: ${readyForDbMode ? "ready to attempt database mode" : "still missing prerequisites for database mode"}`,
  );

  if (!readyForDbMode) {
    process.exitCode = 1;
  }
}

main();
