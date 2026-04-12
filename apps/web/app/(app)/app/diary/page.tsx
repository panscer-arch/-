import { diaryService } from "@lifecoding/domain-diary";
import { Pill, SectionHeader, Surface } from "@lifecoding/ui";

export default async function DiaryPage() {
  const entries = await diaryService.listByUser("user_1");

  return (
    <div className="lc-grid">
      <Surface>
        <SectionHeader title="Diary" description="Личный журнал наблюдений с будущими режимами list, calendar и timeline." />
        <div className="lc-card-actions">
          <button className="lc-button primary">Создать запись</button>
          <button className="lc-button">Переключить на timeline</button>
          <button className="lc-button">Открыть calendar</button>
        </div>
      </Surface>
      <Surface>
        <div className="lc-entry-list">
          {entries.map((entry) => (
            <article key={entry.id} className="lc-entry-card">
              <div className="lc-actions">
                <Pill>{entry.format}</Pill>
                <Pill>{entry.privacy}</Pill>
                {entry.isFavorite ? <Pill>favorite</Pill> : null}
              </div>
              <div>
                <h2>{entry.title}</h2>
                <p className="lc-muted">{entry.body}</p>
              </div>
              <div className="lc-card-actions">
                <button className="lc-button">Редактировать</button>
                <button className="lc-button">Удалить</button>
              </div>
            </article>
          ))}
        </div>
      </Surface>
    </div>
  );
}
