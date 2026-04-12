import { profileService } from "@lifecoding/domain-profile";
import { SectionHeader, StatTile, Surface } from "@lifecoding/ui";

export default async function ProfilePage() {
  const profile = await profileService.getProfile("user_1");

  return (
    <div className="lc-grid">
      <Surface>
        <SectionHeader title={profile.displayName} description={profile.status} />
        <div className="lc-grid three">
          <StatTile label="Nickname" value={profile.nickname} />
          <StatTile label="Level" value={`L${profile.level}`} />
          <StatTile label="Published posts" value={profile.publishedPostsCount} />
        </div>
      </Surface>
      <div className="lc-grid two">
        <Surface>
          <h2>Profile settings</h2>
          <p className="lc-muted">Аватар, статус, имя, ник и публичное представление пользователя.</p>
        </Surface>
        <Surface>
          <h2>Privacy & notifications</h2>
          <p className="lc-muted">
            Privacy default: {profile.diaryPrivacyDefault}. Notifications: {profile.notificationsEnabled ? "on" : "off"}.
          </p>
        </Surface>
      </div>
    </div>
  );
}
