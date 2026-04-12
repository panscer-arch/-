import { gamificationService } from "@lifecoding/domain-gamification";
import { Pill, SectionHeader, Surface } from "@lifecoding/ui";

export default async function AchievementsPage() {
  const achievements = await gamificationService.listAchievements();

  return (
    <div className="lc-grid">
      <Surface>
        <SectionHeader title="Achievements" description="Отдельный модуль прогресса, наград и условий получения." />
      </Surface>
      <Surface>
        <div className="lc-achievement-list">
          {achievements.map((achievement) => (
            <article key={achievement.id}>
              <div className="lc-actions">
                <Pill>{achievement.code}</Pill>
                <Pill>{`+${achievement.xpReward} XP`}</Pill>
              </div>
              <h2>{achievement.title}</h2>
              <p className="lc-muted">{achievement.description}</p>
            </article>
          ))}
        </div>
      </Surface>
    </div>
  );
}
