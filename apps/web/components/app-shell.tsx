"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigation } from "@lifecoding/config";
import { isFeatureEnabled } from "@lifecoding/feature-flags";

export function AppShell({
  children,
  heading,
  subheading
}: {
  children: React.ReactNode;
  heading: string;
  subheading: string;
}) {
  const pathname = usePathname();
  const primaryNav = navigation.primary
    .filter((item) => isFeatureEnabled(item.feature))
    .map((item) => {
      const labelMap: Record<string, string> = {
        Dashboard: "Обзор",
        Library: "Проекты",
        Diary: "Рабочий журнал",
        Feed: "Активность",
        Achievements: "Воронка",
        Notifications: "Сигналы",
        Profile: "Профиль"
      };

      return {
        ...item,
        label: labelMap[item.label] ?? item.label
      };
    });

  return (
    <>
      <div className="lc-shell">
        <aside className="lc-sidebar">
          <div className="lc-sidebar-brand">
            <p className="lc-kicker">Система портфеля</p>
            <div className="lc-logo">Serenko</div>
            <p className="lc-muted">
              Спокойный control room для живых проектов, задач и маркетинга.
            </p>
          </div>
          <nav className="lc-nav">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} data-active={pathname === item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="lc-sidebar-projects">
            <p className="lc-kicker">Проекты</p>
            <div className="lc-project-chip is-active">
              <strong>CopyBanner</strong>
              <span>Активен</span>
            </div>
            <div className="lc-project-chip">
              <strong>Unity Income</strong>
              <span>Черновик</span>
            </div>
            <div className="lc-project-chip">
              <strong>Будущий слот</strong>
              <span>Пусто</span>
            </div>
          </div>
          <div className="lc-nav">
            {navigation.settings.map((item) => (
              <Link key={item.href} href={item.href} data-active={pathname === item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
        <div className="lc-content">
          <div className="lc-topbar">
            <div>
              <p className="lc-kicker">Рабочая область</p>
              <h1>{heading}</h1>
              <p className="lc-muted">{subheading}</p>
            </div>
            <div className="lc-actions">
              <Link className="lc-button" href="/app/notifications">
                Сегодня
              </Link>
              <Link className="lc-button primary" href="/app/profile">
                Режим владельца
              </Link>
            </div>
          </div>
          {children}
        </div>
      </div>
      <nav className="lc-mobile-nav">
        {primaryNav.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
