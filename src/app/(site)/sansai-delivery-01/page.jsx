import React from "react";
import { Anton, Space_Mono } from "next/font/google";
import PrintHarvest from "@/components/pages/PrintHarvest";

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata = {
  title: "SANSAI Delivery Vol.01 — ネパール・ヒマラヤ遠征 限定Tシャツ",
  description:
    "山菜採りオンライン SANSAI Delivery Vol.01。クライマー・テツのネパール・ヒマラヤ遠征から持ち帰る一枚の写真が、そのまま限定Tシャツになる。受注受付は2026年8月31日をもって終了しました。たくさんのご予約ありがとうございました。",
  openGraph: {
    title: "SANSAI Delivery Vol.01 — 限界のその先で、見えた景色を。",
    description:
      "クライマー・テツのネパール・ヒマラヤ遠征から持ち帰る写真が、そのまま限定Tシャツに。受注受付は終了しました。",
    images: ["/img/shop-lp/2026/IMG_6911.JPG"],
  },
};

const PrintHarvestPage = () => {
  return (
    <div className={`${anton.variable} ${spaceMono.variable}`}>
      <PrintHarvest />
    </div>
  );
};

export default PrintHarvestPage;
