import React from "react";
import "../app/globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export const metadata = {
  title: "SANSAI ONLINE",
  description: "未踏の世界への冒険",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
