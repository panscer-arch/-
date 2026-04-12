import type { AgentResult, MessageContext } from "../types.js";

type Specialist = Exclude<AgentResult["specialty"], "lead">;

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word));
}

function fileHints(specialty: Specialist) {
  switch (specialty) {
    case "frontend":
      return ["apps/web/app", "apps/web/components", "packages/ui"];
    case "backend":
      return ["apps/api-gateway", "packages/domain-*", "supabase"];
    case "data":
      return ["supabase/migrations", "packages/shared-types"];
    case "qa":
      return ["docs", "apps/web", "apps/api-gateway"];
    case "devops":
      return [".github", "package.json", "turbo.json", "apps/orchestrator"];
    case "product":
      return ["docs", "apps/web/app", "README.md"];
  }
}

function baseAcceptance(specialty: Specialist) {
  switch (specialty) {
    case "frontend":
      return ["UI integrated into the existing app shell", "Responsive states covered"];
    case "backend":
      return ["Public contract defined", "No direct UI coupling"];
    case "data":
      return ["Schema is reversible", "Core indexes and constraints are explicit"];
    case "qa":
      return ["Acceptance cases documented", "Regression risks identified"];
    case "devops":
      return ["Run path documented", "Secrets and env vars listed"];
    case "product":
      return ["User flow is explicit", "Copy and UX states are defined"];
  }
}

export function pickSpecialists(input: MessageContext): AgentResult[] {
  const text = input.text.toLowerCase();
  const results: AgentResult[] = [];

  const requested = new Set<Specialist>();
  requested.add("product");

  if (includesAny(text, ["ui", "интерф", "экран", "верст", "frontend", "страниц", "дизайн"])) {
    requested.add("frontend");
  }
  if (includesAny(text, ["api", "backend", "бэкенд", "сервер", "auth", "endpoint", "telegram", "github"])) {
    requested.add("backend");
  }
  if (includesAny(text, ["бд", "database", "schema", "postgres", "supabase", "миграц", "data"])) {
    requested.add("data");
  }
  if (includesAny(text, ["деплой", "ci", "docker", "infra", "devops", "github actions"])) {
    requested.add("devops");
  }
  if (includesAny(text, ["проверь", "тест", "qa", "review"])) {
    requested.add("qa");
  }

  if (requested.size === 1) {
    requested.add("frontend");
    requested.add("backend");
    requested.add("qa");
  }

  for (const specialty of requested) {
    results.push({
      specialty,
      summary: specialistSummary(specialty, input.text),
      labels: specialistLabels(specialty),
      suggestedOwnedFiles: fileHints(specialty),
      acceptanceCriteria: baseAcceptance(specialty)
    });
  }

  return results;
}

function specialistSummary(specialty: Specialist, prompt: string) {
  switch (specialty) {
    case "product":
      return `Clarify scope, user-facing behavior, and acceptance language for: ${prompt}`;
    case "frontend":
      return `Implement or refine the web experience required by: ${prompt}`;
    case "backend":
      return `Add orchestration/API/backend logic for: ${prompt}`;
    case "data":
      return `Design or update storage contracts and schema for: ${prompt}`;
    case "qa":
      return `Verify edge cases, regressions, and rollout checks for: ${prompt}`;
    case "devops":
      return `Prepare operational setup, env vars, and delivery flow for: ${prompt}`;
  }
}

function specialistLabels(specialty: Specialist) {
  return [`agent:${specialty}`];
}
