import React from "react";
import Script from "next/script";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "../app/globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

export const metadata = {
  title: {
    default: "SANSAI ONLINE | アルパインクライミングチーム 山菜採りオンライン",
    template: "%s | SANSAI ONLINE",
  },
  description:
    "アルパインクライミングチーム『山菜採りオンライン』公式サイト。登山・クライミングの記録、メンバー紹介、ギアレビューなど。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" suppressHydrationWarning className={`${notoSansJP.variable} ${notoSerifJP.variable}`}>
      <head />
      <body className={notoSansJP.className} suppressHydrationWarning>
        {/* Google Analytics - lazyOnloadでパフォーマンス向上 */}
        <Script
          strategy="lazyOnload"
          src="https://www.googletagmanager.com/gtag/js?id=G-TD5DFH0H0Q"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-TD5DFH0H0Q');
            `,
          }}
        />
        <AuthProvider>
          <ThemeProvider>
            <Navigation />
            {children}
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
