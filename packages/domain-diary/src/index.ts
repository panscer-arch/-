import type { DiaryEntry } from "@lifecoding/shared-types";

const diaryEntries: DiaryEntry[] = [
  {
    id: "entry_1",
    userId: "user_1",
    ruleId: "rule_fear",
    title: "Замечаю страх до дедлайна",
    body: "Сегодня увидел, что тревога появилась раньше фактов. Разложил задачу на 3 шага, и напряжение упало.",
    format: "observation",
    privacy: "private",
    status: "published",
    tags: ["страх", "работа"],
    isFavorite: true,
    createdAt: "2026-04-10T09:00:00.000Z"
  },
  {
    id: "entry_2",
    userId: "user_1",
    ruleId: "rule_choice",
    title: "Сработал маленький выбор",
    body: "Не пытался решить весь проект, выбрал один следующий блок. Это сразу вернуло ощущение управления.",
    format: "application_result",
    privacy: "friends",
    status: "published",
    tags: ["выбор", "вектор"],
    isFavorite: false,
    createdAt: "2026-04-09T18:30:00.000Z"
  }
];

export const diaryService = {
  async listByUser(userId: string) {
    return diaryEntries.filter((item) => item.userId === userId);
  }
};
