import type { Profile } from "@lifecoding/shared-types";

export interface ProfileContract {
  getProfile(userId: string): Promise<Profile>;
}

const profile: Profile = {
  userId: "user_1",
  nickname: "vector_runner",
  displayName: "Алексей",
  status: "Собираю систему правил для спокойной жизни",
  level: 6,
  xp: 1240,
  achievementsCount: 8,
  learnedRulesCount: 17,
  publishedPostsCount: 6,
  diaryPrivacyDefault: "private",
  notificationsEnabled: true,
  onboardingCompleted: true
};

export const profileService: ProfileContract = {
  async getProfile() {
    return profile;
  }
};
