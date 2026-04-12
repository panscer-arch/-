import type { Achievement } from "@lifecoding/shared-types";

const achievements: Achievement[] = [
  {
    id: "achievement_1",
    code: "welcome",
    title: "Первый вход",
    description: "Завершить регистрацию и войти в кабинет.",
    xpReward: 50,
    earnedAt: "2026-04-11T12:05:00.000Z"
  },
  {
    id: "achievement_2",
    code: "first_rule",
    title: "Первое правило",
    description: "Изучить первое правило полностью.",
    xpReward: 100,
    earnedAt: "2026-04-11T13:10:00.000Z"
  }
];

export const gamificationService = {
  async listAchievements() {
    return achievements;
  }
};
