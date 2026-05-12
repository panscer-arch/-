const fs = require("node:fs");
const path = require("node:path");

function parseEnvLine(line) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  const separatorIndex = trimmed.indexOf("=");
  if (separatorIndex === -1) return null;

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const parsed = parseEnvLine(line);
    if (!parsed) return;
    if (process.env[parsed.key] == null || process.env[parsed.key] === "") {
      process.env[parsed.key] = parsed.value;
    }
  });
}

function loadLocalEnv() {
  const appRoot = process.cwd();
  const workspaceRoot = path.resolve(appRoot, "../..");

  [
    path.join(workspaceRoot, ".env.local"),
    path.join(workspaceRoot, ".env"),
    path.join(appRoot, ".env.local"),
    path.join(appRoot, ".env"),
  ].forEach(loadEnvFile);
}

module.exports = {
  loadLocalEnv,
};
