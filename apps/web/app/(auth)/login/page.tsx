import Link from "next/link";
import { Surface } from "@lifecoding/ui";

export default function LoginPage() {
  return (
    <main className="lc-auth-wrap">
      <Surface className="lc-auth-card">
        <p className="lc-kicker">Auth</p>
        <h1>Вход</h1>
        <form className="lc-form">
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button className="lc-button primary" type="submit">
            Войти
          </button>
        </form>
        <div className="lc-actions">
          <Link href="/forgot-password">Восстановить пароль</Link>
          <Link href="/register">Создать аккаунт</Link>
        </div>
      </Surface>
    </main>
  );
}
