import type { Metadata } from "next";
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
      </body>
    </html>
  );
}
