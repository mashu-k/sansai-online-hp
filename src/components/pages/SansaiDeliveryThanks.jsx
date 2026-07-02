"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { getLp } from "@/lib/lp-config";
import { lpEvent } from "@/lib/lp-tracking";
import "@/app/(site)/sansai-delivery-01/sansai-delivery-01.css";

const LP = getLp("sansai-delivery-01");

const SansaiDeliveryThanks = () => {
  // 購入完了計測。ページビュー（pagePath）でも二重に取れるようにしている
  useEffect(() => {
    lpEvent(`${LP.eventPrefix}_purchase`);
  }, []);

  return (
    <div className="ph-root" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <div className="ph-wrap ph-block" style={{ textAlign: "center", width: "100%" }}>
        <span className="ph-eyebrow">SANSAI Delivery — Vol.01</span>
        <h1 className="ph-display" style={{ marginTop: "20px" }}>
          THANK YOU
        </h1>
        <p className="ph-jp-lead" style={{ marginTop: "16px" }}>
          ご予約ありがとうございます。
        </p>
        <p className="ph-lede" style={{ margin: "16px auto 0", maxWidth: "560px" }}>
          ご注文を受け付けました。確認メールをお送りしていますのでご確認ください。
          テツが遠征から持ち帰る一枚を、どうぞ楽しみにお待ちください。
          お届けは2026年冬ごろを予定しています。
        </p>
        <div style={{ marginTop: "40px", display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/sansai-delivery-01" className="ph-cta" style={{ textDecoration: "none" }}>
            LPに戻る
          </Link>
          <Link href="/" className="ph-cta" style={{ textDecoration: "none" }}>
            SANSAI ONLINE トップへ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SansaiDeliveryThanks;
