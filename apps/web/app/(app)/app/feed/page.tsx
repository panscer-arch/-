import { feedService } from "@lifecoding/domain-feed";
import { Pill, SectionHeader, Surface } from "@lifecoding/ui";

export default async function FeedPage() {
  const posts = await feedService.listFeed();

  return (
    <div className="lc-grid">
      <Surface>
        <SectionHeader title="Community feed" description="Лента отделена как social layer и может быть выключена feature flag." />
        <div className="lc-actions">
          {["all", "following", "popular", "recent"].map((filter) => (
            <Pill key={filter}>{filter}</Pill>
          ))}
        </div>
      </Surface>
      <Surface>
        <div className="lc-feed-list">
          {posts.map((post) => (
            <article key={post.id} className="lc-feed-card">
              <div className="lc-actions">
                <Pill>{post.authorName}</Pill>
                <Pill>{`Level ${post.authorLevel}`}</Pill>
                <Pill>{`${post.authorAchievements} achievements`}</Pill>
              </div>
              <p>{post.body}</p>
              <div className="lc-card-actions">
                <button className="lc-button">Like</button>
                <button className="lc-button">Comment</button>
                <button className="lc-button">Save</button>
                <button className="lc-button">Report</button>
              </div>
            </article>
          ))}
        </div>
      </Surface>
    </div>
  );
}
