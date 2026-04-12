export const appConfig = {
  name: "Лайфкодинг",
  description: "Рациональная платформа изучения жизненных правил",
  featureDefaults: {
    auth: true,
    onboarding: true,
    dashboard: true,
    library: true,
    diary: true,
    feed: true,
    achievements: true,
    notifications: true,
    recommendations: true,
    admin: true
  }
} as const;

export const navigation = {
  primary: [
    { href: "/app/dashboard", label: "Dashboard", feature: "dashboard" },
    { href: "/app/library", label: "Library", feature: "library" },
    { href: "/app/diary", label: "Diary", feature: "diary" },
    { href: "/app/feed", label: "Feed", feature: "feed" },
    { href: "/app/achievements", label: "Achievements", feature: "achievements" },
    { href: "/app/notifications", label: "Notifications", feature: "notifications" },
    { href: "/app/profile", label: "Profile", feature: "dashboard" }
  ],
  settings: [
    { href: "/app/settings/profile", label: "Profile" },
    { href: "/app/settings/security", label: "Security" },
    { href: "/app/settings/privacy", label: "Privacy" },
    { href: "/app/settings/notifications", label: "Notifications" },
    { href: "/app/settings/interface", label: "Interface" }
  ]
} as const;

export type FeatureKey = keyof typeof appConfig.featureDefaults;
