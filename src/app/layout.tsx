import type { Metadata } from "next";
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
      <body className="flex justify-center items-center h-screen w-screen relative">
        <div className="absolute inset-0 z-0 bg-[url('/images/background3.png')] bg-cover lg:bg-contain bg-center bg-no-repeat"></div>
        <main className="z-10 flex flex-col justify-center items-center h-full w-full">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
