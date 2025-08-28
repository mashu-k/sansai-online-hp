import React from "react";
import "../app/globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata = {
  title: "SANSAI ONLINE",
  description: "未踏の世界への冒険",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <Navigation />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
