import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "🎉 Feliz Cumpleaños Mi Niña 💕",
  description: "Una sorpresa especial llena de amor, fotos y recuerdos hermosos para celebrar tu día más importante. ¡Feliz cumpleaños!",
  keywords: ["cumpleaños", "feliz cumpleaños", "carta de amor", "sorpresa", "fotos", "recuerdos"],
  authors: [{ name: "Con amor" }],
  creator: "Hecho con amor especialmente para ti",
  openGraph: {
    title: "🎉 Feliz Cumpleaños Mi Niña 💕",
    description: "Una sorpresa especial llena de amor, fotos y recuerdos hermosos para celebrar tu día más importante. ¡Feliz cumpleaños!",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "🎉 Feliz Cumpleaños Mi Niña 💕",
    description: "Una sorpresa especial llena de amor, fotos y recuerdos hermosos para celebrar tu día más importante. ¡Feliz cumpleaños!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎂</text></svg>" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
