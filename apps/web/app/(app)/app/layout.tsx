import { AppShell } from "../../../components/app-shell";

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      heading="Личный кабинет"
      subheading="Модульный MVP с разделением доменов, контрактов и feature flags."
    >
      {children}
    </AppShell>
  );
}
