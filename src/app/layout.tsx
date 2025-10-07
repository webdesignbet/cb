import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roleta da CBEsportes",
  description: "Roleta com prêmios para nossos clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="flex justify-center align-center h-[100vh] body-bg">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
