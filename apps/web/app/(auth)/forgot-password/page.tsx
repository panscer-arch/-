import { Surface } from "@lifecoding/ui";

export default function ForgotPasswordPage() {
  return (
    <main className="lc-auth-wrap">
      <Surface className="lc-auth-card">
        <p className="lc-kicker">Auth</p>
        <h1>Восстановление пароля</h1>
        <form className="lc-form">
          <input type="email" placeholder="Email" />
          <button className="lc-button primary" type="submit">
            Отправить ссылку
          </button>
        </form>
      </Surface>
    </main>
  );
}
