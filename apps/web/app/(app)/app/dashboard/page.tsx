import {
  AchievementsSection,
  DiarySection,
  FeedSection,
  HeroCard,
  NotificationsSection,
  RulesSection,
  StatsRow
} from "../../../../components/cards";
import { getDashboardSnapshot } from "../../../../lib/dashboard-data";

export default async function DashboardPage() {
  const snapshot = await getDashboardSnapshot();

  return (
    <div className="lc-grid">
      <HeroCard />
      <StatsRow
        level={snapshot.profile.level}
        xp={snapshot.profile.xp}
        rules={snapshot.profile.learnedRulesCount}
        achievements={snapshot.profile.achievementsCount}
      />
      <div className="lc-grid two">
        <RulesSection
          title="Recent study"
          description={`Прогресс по библиотеке: ${snapshot.progressPercent}%`}
          rules={snapshot.recentRules}
        />
        <RulesSection
          title="Recommended next"
          description="Rule-based recommendations, готовые к замене на ML."
          rules={snapshot.recommendedRules}
        />
      </div>
      <div className="lc-grid two">
        <DiarySection entries={snapshot.recentDiaryEntries} />
        <AchievementsSection items={snapshot.freshAchievements} />
      </div>
      <div className="lc-grid two">
        <FeedSection posts={snapshot.recentCommunityPosts} />
        <NotificationsSection items={snapshot.notifications} />
      </div>
    </div>
  );
}
