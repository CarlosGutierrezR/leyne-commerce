import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leyne Boutique",
  description: "Boutique storefront con catalogo visible y carrito sincronizado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full font-sans text-foreground">{children}</body>
    </html>
  );
}
