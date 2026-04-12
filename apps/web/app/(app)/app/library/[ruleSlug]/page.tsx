import Link from "next/link";
import { rulesService } from "@lifecoding/domain-rules";
import { Pill, Surface } from "@lifecoding/ui";

export default async function RuleDetailsPage({
  params
}: {
  params: Promise<{ ruleSlug: string }>;
}) {
  const { ruleSlug } = await params;
  const rule = await rulesService.getRuleBySlug(ruleSlug);

  if (!rule) {
    return (
      <Surface>
        <h1>Правило не найдено</h1>
      </Surface>
    );
  }

  return (
    <div className="lc-grid">
      <Surface>
        <p className="lc-kicker">Rule details</p>
        <h1>{rule.title}</h1>
        <p className="lc-muted">{rule.summary}</p>
        <div className="lc-actions">
          <Pill>{rule.contentType}</Pill>
          <Pill>{`${rule.durationMinutes} min`}</Pill>
          <Pill>{rule.difficulty}</Pill>
          <Pill>{`${rule.learnedByUsers} learners`}</Pill>
        </div>
        <div className="lc-card-actions">
          <button className="lc-button primary">Отметить изученным</button>
          <button className="lc-button">Отметить применённым</button>
          <Link className="lc-button" href="/app/diary">
            Добавить заметку в дневник
          </Link>
        </div>
      </Surface>
      <div className="lc-grid two">
        <Surface>
          <p className="lc-kicker">Main content</p>
          <p>{rule.contentBody}</p>
        </Surface>
        <Surface>
          <p className="lc-kicker">Text version / theses</p>
          <ul>
            {rule.thesis.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Surface>
      </div>
      <div className="lc-grid two">
        <Surface>
          <p className="lc-kicker">Как это проявляется в жизни</p>
          <ul>
            {rule.lifeManifestations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Surface>
        <Surface>
          <p className="lc-kicker">Что можно проверить на себе</p>
          <ul>
            {rule.selfChecks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Surface>
      </div>
    </div>
  );
}
