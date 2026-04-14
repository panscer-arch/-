import { progressService } from "@lifecoding/domain-progress";
import { recommendationsService } from "@lifecoding/domain-recommendations";
import { rulesService } from "@lifecoding/domain-rules";
import { Pill, SectionHeader, Surface } from "@lifecoding/ui";
import Link from "next/link";

const STATUS_LABELS = {
  not_started: "Не начато",
  in_progress: "В процессе",
  learned: "Изучено",
  applied: "Применено"
} as const;

function buildLibraryHref(query: string, category: string) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (category && category !== "all") {
    params.set("category", category);
  }

  const queryString = params.toString();
  return queryString ? `/app/library?${queryString}` : "/app/library";
}

export default async function LibraryPage({
  searchParams
}: {
  searchParams?: Promise<{ q?: string; category?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const query = resolvedSearchParams.q?.trim() ?? "";
  const activeCategory = resolvedSearchParams.category?.trim().toLowerCase() ?? "all";

  const [rules, categories, progress, recommendedRules] = await Promise.all([
    rulesService.listRules(),
    rulesService.listCategories(),
    progressService.listByUser("user_1"),
    recommendationsService.listForUser()
  ]);

  const progressByRuleId = new Map(progress.map((item) => [item.ruleId, item]));

  const filteredRules = rules.filter((rule) => {
    const matchesQuery =
      query.length === 0 ||
      rule.title.toLowerCase().includes(query.toLowerCase()) ||
      rule.summary.toLowerCase().includes(query.toLowerCase()) ||
      rule.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory =
      activeCategory === "all" ||
      rule.categories.some((category) => category.toLowerCase() === activeCategory);

    return matchesQuery && matchesCategory;
  });

  const featuredRule =
    recommendedRules.find((rule) => filteredRules.some((item) => item.id === rule.id)) ??
    filteredRules[0] ??
    null;

  const learnedCount = progress.filter((item) => item.status === "learned" || item.status === "applied").length;

  return (
    <div className="lc-grid">
      <Surface>
        <SectionHeader
          title="Library of rules"
          description="Рабочий каталог правил: выбрать следующее, открыть и пойти дальше без перегруза."
        />
        <div className="lc-form">
          <form className="lc-library-search" action="/app/library">
            <input name="q" type="search" defaultValue={query} placeholder="Поиск правил" />
            <button className="lc-button primary" type="submit">
              Найти
            </button>
            {(query || activeCategory !== "all") ? (
              <Link className="lc-button" href="/app/library">
                Сбросить
              </Link>
            ) : null}
          </form>
          <div className="lc-actions">
            <Link className={`lc-pill ${activeCategory === "all" ? "is-active" : ""}`} href={buildLibraryHref(query, "all")}>
              Все правила · {rules.length}
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                className={`lc-pill ${activeCategory === category.slug ? "is-active" : ""}`}
                href={buildLibraryHref(query, category.slug)}
              >
                {`${category.label} · ${category.count}`}
              </Link>
            ))}
          </div>
        </div>
      </Surface>
      <div className="lc-grid three">
        <Surface className="lc-stat-tile">
          <p className="lc-kicker">Rules</p>
          <h3>{rules.length}</h3>
          <p className="lc-muted">Всего правил уже собрано в библиотеке.</p>
        </Surface>
        <Surface className="lc-stat-tile">
          <p className="lc-kicker">Progress</p>
          <h3>{learnedCount}</h3>
          <p className="lc-muted">Изучено или применено пользователем.</p>
        </Surface>
        <Surface className="lc-stat-tile">
          <p className="lc-kicker">Filtered</p>
          <h3>{filteredRules.length}</h3>
          <p className="lc-muted">Подходит под текущий поиск и выбранную тему.</p>
        </Surface>
      </div>
      {featuredRule ? (
        <Surface className="lc-featured-rule">
          <div className="lc-section-header">
            <div>
              <p className="lc-kicker">Featured rule</p>
              <h2>{featuredRule.title}</h2>
            </div>
            <p className="lc-muted">Логичный следующий шаг для продолжения пути.</p>
          </div>
          <p className="lc-muted">{featuredRule.summary}</p>
          <div className="lc-actions">
            <Pill>{featuredRule.contentType}</Pill>
            <Pill>{`${featuredRule.durationMinutes} min`}</Pill>
            <Pill>{featuredRule.difficulty}</Pill>
          </div>
          <div className="lc-card-actions">
            <Link className="lc-button primary" href={`/app/library/${featuredRule.slug}`}>
              Открыть правило
            </Link>
            <span className="lc-muted">
              {progressByRuleId.get(featuredRule.id)
                ? `Статус: ${STATUS_LABELS[progressByRuleId.get(featuredRule.id)!.status]}`
                : "Статус: Не начато"}
            </span>
          </div>
        </Surface>
      ) : null}
      <Surface>
        <SectionHeader
          title="Rules list"
          description={
            filteredRules.length > 0
              ? "Основной рабочий слой: открой правило и переходи к действию."
              : "По текущему запросу ничего не найдено."
          }
        />
        <div className="lc-rule-list">
          {filteredRules.length === 0 ? (
            <article className="lc-rule-card">
              <div>
                <h2>Ничего не найдено</h2>
                <p className="lc-muted">Попробуй убрать фильтр или изменить поисковый запрос.</p>
              </div>
              <div className="lc-card-actions">
                <Link className="lc-button primary" href="/app/library">
                  Показать все правила
                </Link>
              </div>
            </article>
          ) : (
            filteredRules.map((rule) => {
              const ruleProgress = progressByRuleId.get(rule.id);
              const statusLabel = ruleProgress ? STATUS_LABELS[ruleProgress.status] : STATUS_LABELS.not_started;

              return (
                <article key={rule.id} className="lc-rule-card">
                  <div className="lc-actions">
                    <Pill>{rule.contentType}</Pill>
                    <Pill>{`${rule.durationMinutes} min`}</Pill>
                    <Pill>{rule.difficulty}</Pill>
                    <Pill>{statusLabel}</Pill>
                  </div>
                  <div>
                    <h2>{rule.title}</h2>
                    <p className="lc-muted">{rule.summary}</p>
                  </div>
                  <div className="lc-actions">
                    {rule.tags.map((tag) => (
                      <Pill key={tag}>{tag}</Pill>
                    ))}
                  </div>
                  <div className="lc-card-actions">
                    <Link className="lc-button primary" href={`/app/library/${rule.slug}`}>
                      Открыть
                    </Link>
                    <button className="lc-button">В избранное</button>
                    <button className="lc-button">Отметить применённым</button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </Surface>
    </div>
  );
}
