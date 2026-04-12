export type UserRole = "user" | "moderator" | "admin";

export type RuleContentType = "video" | "audio" | "text" | "schema";
export type RuleProgressStatus = "not_started" | "in_progress" | "learned" | "applied";
export type DiaryEntryFormat =
  | "text"
  | "note"
  | "observation"
  | "conclusion"
  | "application_result";
export type PrivacyLevel = "private" | "friends" | "public";
export type NotificationType =
  | "comment"
  | "like"
  | "achievement"
  | "new_rule"
  | "reply"
  | "reminder"
  | "system";
export type FeedFilter = "all" | "following" | "popular" | "recent";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Profile {
  userId: string;
  nickname: string;
  displayName: string;
  avatarUrl?: string;
  status: string;
  level: number;
  xp: number;
  achievementsCount: number;
  learnedRulesCount: number;
  publishedPostsCount: number;
  diaryPrivacyDefault: PrivacyLevel;
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
}

export interface Rule {
  id: string;
  slug: string;
  title: string;
  summary: string;
  contentType: RuleContentType;
  durationMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  categories: string[];
  contentBody: string;
  thesis: string[];
  lifeManifestations: string[];
  selfChecks: string[];
  learnedByUsers: number;
}

export interface UserRuleProgress {
  userId: string;
  ruleId: string;
  status: RuleProgressStatus;
  isFavorite: boolean;
  progressPercent: number;
}

export interface DiaryEntry {
  id: string;
  userId: string;
  ruleId?: string;
  title: string;
  body: string;
  format: DiaryEntryFormat;
  privacy: PrivacyLevel;
  status: "draft" | "published" | "archived";
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  userId: string;
  authorName: string;
  authorLevel: number;
  authorAchievements: number;
  body: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  xpReward: number;
  earnedAt?: string;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardSnapshot {
  profile: Profile;
  currentLevelTitle: string;
  progressPercent: number;
  recentRules: Rule[];
  recommendedRules: Rule[];
  recentDiaryEntries: DiaryEntry[];
  recentCommunityPosts: FeedPost[];
  freshAchievements: Achievement[];
  notifications: AppNotification[];
}

export interface DomainEvent<TPayload = Record<string, unknown>> {
  name: string;
  payload: TPayload;
  occurredAt: string;
}
