import { diaryService } from "@lifecoding/domain-diary";
import { feedService } from "@lifecoding/domain-feed";
import { gamificationService } from "@lifecoding/domain-gamification";
import { identityService } from "@lifecoding/domain-identity";
import { notificationsService } from "@lifecoding/domain-notifications";
import { profileService } from "@lifecoding/domain-profile";
import { progressService } from "@lifecoding/domain-progress";
import { recommendationsService } from "@lifecoding/domain-recommendations";
import { rulesService } from "@lifecoding/domain-rules";
import type { DashboardSnapshot } from "@lifecoding/shared-types";

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const user = await identityService.getCurrentUser();

  if (!user) {
    throw new Error("No current user.");
  }

  const [profile, allRules, progress, diaryEntries, posts, achievements, notifications, recommendations] =
    await Promise.all([
      profileService.getProfile(user.id),
      rulesService.listRules(),
      progressService.listByUser(user.id),
      diaryService.listByUser(user.id),
      feedService.listFeed(),
      gamificationService.listAchievements(),
      notificationsService.listByUser(),
      recommendationsService.listForUser()
    ]);

  const progressPercent = Math.round(
    (progress.reduce((acc, item) => acc + item.progressPercent, 0) / (progress.length || 1))
  );

  const recentRules = allRules.slice(0, 2);

  return {
    profile,
    currentLevelTitle: "Исследователь систем",
    progressPercent,
    recentRules,
    recommendedRules: recommendations,
    recentDiaryEntries: diaryEntries,
    recentCommunityPosts: posts,
    freshAchievements: achievements,
    notifications
  };
}
