import React from "react";
import { Anton, Space_Mono } from "next/font/google";
import SansaiDeliveryThanks from "@/components/pages/SansaiDeliveryThanks";

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
  title: "ご予約ありがとうございます — SANSAI Delivery Vol.01",
  robots: { index: false, follow: false },
};

const ThanksPage = () => {
  return (
    <div className={`${anton.variable} ${spaceMono.variable}`}>
      <SansaiDeliveryThanks />
    </div>
  );
};

export default ThanksPage;
