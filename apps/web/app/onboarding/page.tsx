import { Surface } from "@lifecoding/ui";

export default function OnboardingPage() {
  return (
    <main className="lc-auth-wrap">
      <Surface className="lc-auth-card">
        <p className="lc-kicker">Onboarding</p>
        <h1>Первичная настройка кабинета</h1>
        <form className="lc-form">
          <input type="text" placeholder="Ник" />
          <select defaultValue="private">
            <option value="private">Дневник: только я</option>
            <option value="friends">Дневник: друзья</option>
            <option value="public">Дневник: все</option>
          </select>
          <textarea rows={5} placeholder="Краткий статус или цель" />
          <button className="lc-button primary" type="submit">
            Сохранить и продолжить
          </button>
        </form>
      </Surface>
    </main>
  );
}
