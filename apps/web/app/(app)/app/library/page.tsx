import { rulesService } from "@lifecoding/domain-rules";
import { Pill, SectionHeader, Surface } from "@lifecoding/ui";
import Link from "next/link";

export default async function LibraryPage() {
  const rules = await rulesService.listRules();

  return (
    <div className="lc-grid">
      <Surface>
        <SectionHeader title="Library of rules" description="Поиск, фильтры и категории подключаются поверх доменного пакета rules." />
        <div className="lc-form">
          <input type="search" placeholder="Поиск правил" />
          <div className="lc-actions">
            {["страх", "ожидание", "выбор", "состояние", "вектор жизни"].map((category) => (
              <Pill key={category}>{category}</Pill>
            ))}
          </div>
        </div>
      </Surface>
      <Surface>
        <div className="lc-rule-list">
          {rules.map((rule) => (
            <article key={rule.id} className="lc-rule-card">
              <div className="lc-actions">
                <Pill>{rule.contentType}</Pill>
                <Pill>{`${rule.durationMinutes} min`}</Pill>
                <Pill>{rule.difficulty}</Pill>
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
          ))}
        </div>
      </Surface>
    </div>
  );
}
