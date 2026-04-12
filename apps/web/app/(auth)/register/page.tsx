import Link from "next/link";
import { Surface } from "@lifecoding/ui";

export default function RegisterPage() {
  return (
    <main className="lc-auth-wrap">
      <Surface className="lc-auth-card">
        <p className="lc-kicker">Auth</p>
        <h1>Регистрация</h1>
        <form className="lc-form">
          <input type="text" placeholder="Имя" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button className="lc-button primary" type="submit">
            Создать аккаунт
          </button>
        </form>
        <div className="lc-actions">
          <Link href="/login">Уже есть аккаунт</Link>
        </div>
      </Surface>
    </main>
  );
}
