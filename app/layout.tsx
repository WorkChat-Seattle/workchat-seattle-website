import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";

// Заглушка: настоящие title / description — вкладка SEO таблицы (шаг 10).
export const metadata: Metadata = {
  title: "WorkChat Seattle",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
