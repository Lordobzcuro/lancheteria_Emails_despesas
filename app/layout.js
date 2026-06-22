import "./globals.css";
import SwRegister from "./sw-register";

export const metadata = {
  title: "Lancheteria Rondon — Financeiro",
  description: "Entradas e saídas (Mercado Pago).",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Lancheteria", statusBarStyle: "black-translucent" },
  icons: { icon: "/icon-192", apple: "/icon-512" },
};

export const viewport = { themeColor: "#0b0f14", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <SwRegister />
      </body>
    </html>
  );
}
