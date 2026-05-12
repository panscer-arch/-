import { AppShell } from "../../../components/app-shell";

export default function CabinetLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      heading="Atlas System"
      subheading="Симулятор финансово-реферальной модели: cash flow, тарифы, партнерка, реинвест и риск-перегрузка."
    >
      {children}
    </AppShell>
  );
}
