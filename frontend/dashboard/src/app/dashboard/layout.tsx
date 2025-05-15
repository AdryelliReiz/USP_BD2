import type { Metadata } from "next";
import { SessionProvider } from "@/context/sessionContext";
import SideBar from "@/components/SideBar";

import "@/styles/globals.scss";
import "@/styles/pages/dashboard.scss";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Painel de controle do sistema",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
        <SessionProvider>
            <body>
                <SideBar />
                <main>
                  <header>
                    <h1>CINEACH</h1>
                  </header>

                  {children}
                </main>
            </body>
        </SessionProvider>
    </html>
  );
}
