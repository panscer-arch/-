import { Pill, SectionHeader, Surface } from "@lifecoding/ui";
import type {
  CopyBannerFocusItem,
  CopyBannerKpi,
  CopyBannerMarketingNote,
  CopyBannerQueueItem
} from "../lib/dashboard-data";

export function HeroCard({
  projectName,
  stage,
  health,
  summary,
  lastUpdate,
  priority
}: {
  projectName: string;
  stage: string;
  health: string;
  summary: string;
  lastUpdate: string;
  priority: string;
}) {
  return (
    <Surface className="lc-control-hero">
      <div className="lc-control-hero-copy">
        <p className="lc-kicker">Центр управления</p>
        <h2>{projectName} - операционная панель</h2>
        <p className="lc-muted">{summary}</p>
        <div className="lc-actions">
          <Pill>{stage}</Pill>
          <Pill>{health}</Pill>
        </div>
      </div>
      <div className="lc-control-hero-meta">
        <div className="lc-overview-grid">
          <div>
            <p className="lc-kicker">Статус</p>
            <h3>Активен</h3>
            <p className="lc-muted">{health}</p>
          </div>
          <div>
            <p className="lc-kicker">Последний срез</p>
            <h3>{lastUpdate}</h3>
            <p className="lc-muted">Последний срез панели</p>
          </div>
        </div>
        <div className="lc-priority-note">
          <p className="lc-kicker">Текущий приоритет</p>
          <p>{priority}</p>
        </div>
      </div>
    </Surface>
  );
}

export function KpiRow({ items }: { items: CopyBannerKpi[] }) {
  return (
    <div className="lc-grid lc-kpi-grid">
      {items.map((item) => (
        <article key={item.label} className="lc-kpi-panel">
          <div className="lc-kpi-head">
            <p className="lc-kicker">{item.label}</p>
            <span className={`lc-signal is-${item.tone}`}>{item.delta}</span>
          </div>
          <h3>{item.value}</h3>
          <p className="lc-muted">{item.helper}</p>
        </article>
      ))}
    </div>
  );
}

export function IntakeSection({ items }: { items: CopyBannerQueueItem[] }) {
  return (
    <Surface>
      <SectionHeader
        title="Новые заявки и входящий поток"
        description="То, что нужно быстро посмотреть и не потерять."
      />
      <div className="lc-stack-list">
        {items.map((item) => (
          <article key={item.id} className="lc-stack-card">
            <div className="lc-row-meta">
              <span className="lc-row-lane">{item.lane}</span>
              <Pill>{item.status}</Pill>
            </div>
            <h3>{item.title}</h3>
            <p className="lc-muted">{item.detail}</p>
          </article>
        ))}
      </div>
    </Surface>
  );
}

export function FocusSection({ items }: { items: CopyBannerFocusItem[] }) {
  return (
    <Surface>
      <SectionHeader
        title="Ближайший фокус"
        description="Сюда будем потихоньку превращать твои реальные задачи и доработки."
      />
      <div className="lc-stack-list">
        {items.map((item) => (
          <article key={item.id} className="lc-focus-card">
            <div>
              <p className="lc-kicker">{item.lane}</p>
              <h3>{item.title}</h3>
              <p className="lc-muted">{item.owner}</p>
            </div>
            <Pill>{item.eta}</Pill>
          </article>
        ))}
      </div>
    </Surface>
  );
}

export function MarketingSection({ items }: { items: CopyBannerMarketingNote[] }) {
  return (
    <Surface>
      <SectionHeader
        title="Маркетинг"
        description="Пока оставляем как отдельный смысловой блок и потом вместе детализируем."
      />
      <div className="lc-stack-list">
        {items.map((item) => (
          <article key={item.id} className="lc-stack-card">
            <div className="lc-row-meta">
              <span className="lc-row-lane">{item.signal}</span>
            </div>
            <h3>{item.title}</h3>
            <p className="lc-muted">{item.detail}</p>
          </article>
        ))}
      </div>
    </Surface>
  );
}
