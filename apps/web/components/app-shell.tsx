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
  const primaryNav = navigation.primary.filter((item) => isFeatureEnabled(item.feature));

  return (
    <>
      <div className="lc-shell">
        <aside className="lc-sidebar">
          <div className="lc-logo">Лайфкодинг</div>
          <p className="lc-muted">
            Модульный кабинет для изучения правил, фиксации опыта и роста через действия.
          </p>
          <nav className="lc-nav">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} data-active={pathname === item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
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
              <p className="lc-kicker">Cabinet</p>
              <h1>{heading}</h1>
              <p className="lc-muted">{subheading}</p>
            </div>
            <div className="lc-actions">
              <Link className="lc-button" href="/app/notifications">
                Notifications
              </Link>
              <Link className="lc-button primary" href="/app/profile">
                Алексей • L6
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
