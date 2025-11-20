import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Öğrencim - Öğrenci Takip Sistemi",
  description: "Öğretmenler arası bilgi paylaşımı ve öğrenci yetenek takip sistemi",
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
