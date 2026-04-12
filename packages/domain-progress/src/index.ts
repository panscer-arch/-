import type { UserRuleProgress } from "@lifecoding/shared-types";

const progress: UserRuleProgress[] = [
  {
    userId: "user_1",
    ruleId: "rule_fear",
    status: "learned",
    isFavorite: true,
    progressPercent: 100
  },
  {
    userId: "user_1",
    ruleId: "rule_expectation",
    status: "in_progress",
    isFavorite: false,
    progressPercent: 45
  },
  {
    userId: "user_1",
    ruleId: "rule_choice",
    status: "applied",
    isFavorite: true,
    progressPercent: 100
  }
];

export const progressService = {
  async listByUser(userId: string) {
    return progress.filter((item) => item.userId === userId);
  }
};
