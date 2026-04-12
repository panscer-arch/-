import type { FeedPost } from "@lifecoding/shared-types";

const posts: FeedPost[] = [
  {
    id: "post_1",
    userId: "user_2",
    authorName: "Нина",
    authorLevel: 4,
    authorAchievements: 5,
    body: "После правила про ожидание стало легче разговаривать без предварительных сценариев.",
    likes: 18,
    comments: 3,
    createdAt: "2026-04-10T15:20:00.000Z"
  },
  {
    id: "post_2",
    userId: "user_3",
    authorName: "Илья",
    authorLevel: 9,
    authorAchievements: 12,
    body: "Собрал себе короткий ритуал проверки состояния перед важными встречами. Работает лучше, чем просто мотивация.",
    likes: 27,
    comments: 6,
    createdAt: "2026-04-10T11:10:00.000Z"
  }
];

export const feedService = {
  async listFeed() {
    return posts;
  }
};
