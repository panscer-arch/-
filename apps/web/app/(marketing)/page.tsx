import Link from "next/link";
import { Surface } from "@lifecoding/ui";

export default function HomePage() {
  return (
    <main className="lc-hero">
      <div className="lc-hero-grid">
        <section>
          <p className="lc-kicker">Lifecoding MVP</p>
          <h1>Жизнь как система правил, состояний и векторов</h1>
          <p className="lc-muted">
            Строгий и современный кабинет для изучения жизненных правил, ведения дневника и роста через наблюдение и практику.
          </p>
          <div className="lc-actions">
            <Link className="lc-button primary" href="/register">
              Начать
            </Link>
            <Link className="lc-button" href="/login">
              Войти
            </Link>
          </div>
        </section>
        <Surface>
          <p className="lc-kicker">Microservice-ready</p>
          <h2>Конструктор из доменных модулей</h2>
          <p className="lc-muted">
            `identity`, `rules`, `diary`, `feed`, `gamification`, `notifications` и `recommendations` уже разделены контрактами.
          </p>
          <div className="lc-grid two">
            <Surface className="lc-stat-tile">
              <p className="lc-kicker">Apps</p>
              <h3>3</h3>
              <p className="lc-muted">web, api-gateway, admin</p>
            </Surface>
            <Surface className="lc-stat-tile">
              <p className="lc-kicker">Domains</p>
              <h3>9</h3>
              <p className="lc-muted">isolated, flaggable, exportable</p>
            </Surface>
          </div>
        </Surface>
      </div>
    </main>
  );
}
