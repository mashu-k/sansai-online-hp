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
    "山菜採りオンライン SANSAI Delivery Vol.01。クライマー・テツのネパール・ヒマラヤ遠征から持ち帰る一枚の写真が、そのまま限定Tシャツになる。Tシャツ＋現地撮影ポストカードのセット。受注締切2026年8月下旬、価格12,500円（送料込み）。売上は遠征の撮影費に充てられます。",
  openGraph: {
    title: "SANSAI Delivery Vol.01 — 限界のその先で、見えた景色を。",
    description:
      "クライマー・テツのネパール・ヒマラヤ遠征から持ち帰る写真が、そのまま限定Tシャツに。完全限定・受注予約受付中。",
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
