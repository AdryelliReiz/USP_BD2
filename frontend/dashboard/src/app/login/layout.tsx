import type { Metadata } from "next";
import "@/styles/globals.scss";


export const metadata: Metadata = {
  title: "Login | CINEACH Dashboard",
  description: "Faça login para acessar o painel de controle do CINEACH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        {children}
      </body>
    </html>
  );
}
