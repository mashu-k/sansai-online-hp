"use client";
import React, { useEffect, useState, lazy, Suspense } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

// Below-fold セクションを遅延読み込み
const HomeContent = lazy(() => import("./HomeContent"));

const Home = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // TBT最適化: スクロールまたはアイドル時にbelow-foldコンテンツを読み込み
    const load = () => setShowContent(true);
    const onScroll = () => {
      load();
      cleanup();
    };
    const timer = setTimeout(() => {
      load();
      cleanup();
    }, 4000);
    window.addEventListener("scroll", onScroll, { once: true, passive: true });
    const cleanup = () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
    return cleanup;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* ヒーローセクション - 軽量、framer-motion不使用 */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/img/home/first.webp"
            alt="山岳風景"
            fill
            priority
            quality={75}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* オーバーレイ */}
        <div className="absolute inset-0 hero-gradient z-5" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto hero-fade-in">
          <div>
            <Image
              src="/img/logo/eng_png/whiteOnlyText.png"
              alt="SANSAI ONLINE"
              width={600}
              height={100}
              priority
              className="w-auto mx-auto mb-6"
            />
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hero-chevron">
          <button
            onClick={() =>
              document
                .getElementById("mission")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-white/60 hover:text-white transition-colors duration-300"
            aria-label="ミッションセクションにスクロール"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>
      </section>

      {/* Below-fold コンテンツ（遅延読み込み） */}
      {showContent && (
        <Suspense
          fallback={
            <div className="py-20 text-center text-muted-foreground">
              読み込み中...
            </div>
          }
        >
          <HomeContent />
        </Suspense>
      )}
    </div>
  );
};

export default Home;
