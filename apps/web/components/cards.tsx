import Link from "next/link";
import { Pill, SectionHeader, StatTile, Surface } from "@lifecoding/ui";
import type { Achievement, AppNotification, DiaryEntry, FeedPost, Rule } from "@lifecoding/shared-types";

export function HeroCard() {
  return (
    <Surface>
      <p className="lc-kicker">System State</p>
      <h2>Кабинет собран как конструктор</h2>
      <p className="lc-muted">
        Каждый блок изолирован контрактами и может быть включён, отключён или вынесен в отдельный сервис позже.
      </p>
      <div className="lc-actions">
        <Link className="lc-button primary" href="/app/library">
          Открыть библиотеку
        </Link>
        <Link className="lc-button" href="/app/diary">
          Перейти в дневник
        </Link>
      </div>
    </Surface>
  );
}

export function StatsRow({
  level,
  xp,
  rules,
  achievements
}: {
  level: number;
  xp: number;
  rules: number;
  achievements: number;
}) {
  return (
    <div className="lc-grid three">
      <StatTile label="Current level" value={`L${level}`} helper="Текущий уровень пользователя" />
      <StatTile label="XP" value={xp} helper="Опыт за изучение и применение" />
      <StatTile label="Completed" value={rules} helper={`${achievements} достижений уже получено`} />
    </div>
  );
}

export function RulesSection({ title, description, rules }: { title: string; description: string; rules: Rule[] }) {
  return (
    <Surface>
      <SectionHeader title={title} description={description} />
      <div className="lc-rule-list">
        {rules.map((rule) => (
          <article key={rule.id} className="lc-rule-card">
            <div className="lc-actions">
              <Pill>{rule.contentType}</Pill>
              <Pill>{rule.difficulty}</Pill>
            </div>
            <div>
              <h3>{rule.title}</h3>
              <p className="lc-muted">{rule.summary}</p>
            </div>
            <div className="lc-actions">
              {rule.tags.map((tag) => (
                <Pill key={tag}>{tag}</Pill>
              ))}
            </div>
            <div className="lc-card-actions">
              <Link className="lc-button primary" href={`/app/library/${rule.slug}`}>
                Open rule
              </Link>
              <button className="lc-button">Favorite</button>
            </div>
          </article>
        ))}
      </div>
    </Surface>
  );
}

export function DiarySection({ entries }: { entries: DiaryEntry[] }) {
  return (
    <Surface>
      <SectionHeader title="Recent diary entries" description="Наблюдения, выводы и результаты применения." />
      <div className="lc-entry-list">
        {entries.map((entry) => (
          <article key={entry.id} className="lc-entry-card">
            <div className="lc-actions">
              <Pill>{entry.format}</Pill>
              <Pill>{entry.privacy}</Pill>
            </div>
            <div>
              <h3>{entry.title}</h3>
              <p className="lc-muted">{entry.body}</p>
            </div>
            <p className="lc-muted">{new Date(entry.createdAt).toLocaleString("ru-RU")}</p>
          </article>
        ))}
      </div>
    </Surface>
  );
}

export function FeedSection({ posts }: { posts: FeedPost[] }) {
  return (
    <Surface>
      <SectionHeader title="Community activity" description="Общая лента подключена как отдельный модуль." />
      <div className="lc-feed-list">
        {posts.map((post) => (
          <article key={post.id} className="lc-feed-card">
            <div className="lc-actions">
              <Pill>{post.authorName}</Pill>
              <Pill>{`L${post.authorLevel}`}</Pill>
              <Pill>{`${post.authorAchievements} achievements`}</Pill>
            </div>
            <p>{post.body}</p>
            <p className="lc-muted">{post.likes} likes • {post.comments} comments</p>
          </article>
        ))}
      </div>
    </Surface>
  );
}

export function AchievementsSection({ items }: { items: Achievement[] }) {
  return (
    <Surface>
      <SectionHeader title="Fresh achievements" description="Геймификация подключена отдельным доменным пакетом." />
      <div className="lc-achievement-list">
        {items.map((item) => (
          <article key={item.id}>
            <h3>{item.title}</h3>
            <p className="lc-muted">{item.description}</p>
            <p className="lc-kicker">{`+${item.xpReward} XP`}</p>
          </article>
        ))}
      </div>
    </Surface>
  );
}

export function NotificationsSection({ items }: { items: AppNotification[] }) {
  return (
    <Surface>
      <SectionHeader title="Notification center" description="События читаются из отдельного notification domain." />
      <div className="lc-notification-list">
        {items.map((item) => (
          <article key={item.id} className="lc-notification-card">
            <div className="lc-actions">
              <Pill>{item.type}</Pill>
              <Pill>{item.isRead ? "read" : "new"}</Pill>
            </div>
            <h3>{item.title}</h3>
            <p className="lc-muted">{item.body}</p>
          </article>
        ))}
      </div>
    </Surface>
  );
}
