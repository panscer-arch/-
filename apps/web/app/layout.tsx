import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serenko System",
  description: "Founder operating system for live projects"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
