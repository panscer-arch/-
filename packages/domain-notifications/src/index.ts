import type { AppNotification } from "@lifecoding/shared-types";

const notifications: AppNotification[] = [
  {
    id: "notification_1",
    type: "achievement",
    title: "Новая ачивка",
    body: "Ты получил достижение «Первое правило».",
    isRead: false,
    createdAt: "2026-04-11T13:10:00.000Z"
  },
  {
    id: "notification_2",
    type: "reminder",
    title: "Вернись к изучению",
    body: "У тебя осталось одно правило в статусе in progress.",
    isRead: true,
    createdAt: "2026-04-11T08:00:00.000Z"
  }
];

export const notificationsService = {
  async listByUser() {
    return notifications;
  }
};
