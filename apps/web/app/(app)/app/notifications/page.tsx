import { notificationsService } from "@lifecoding/domain-notifications";
import { Pill, SectionHeader, Surface } from "@lifecoding/ui";

export default async function NotificationsPage() {
  const notifications = await notificationsService.listByUser();

  return (
    <div className="lc-grid">
      <Surface>
        <SectionHeader title="Notifications" description="Центр событий пользователя: комментарии, лайки, напоминания и системные сообщения." />
      </Surface>
      <Surface>
        <div className="lc-notification-list">
          {notifications.map((notification) => (
            <article key={notification.id} className="lc-notification-card">
              <div className="lc-actions">
                <Pill>{notification.type}</Pill>
                <Pill>{notification.isRead ? "read" : "new"}</Pill>
              </div>
              <h2>{notification.title}</h2>
              <p className="lc-muted">{notification.body}</p>
            </article>
          ))}
        </div>
      </Surface>
    </div>
  );
}
