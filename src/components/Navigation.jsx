"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import UserMenu from "@/components/auth/UserMenu";
import { useTheme } from "next-themes";
import { LOGO_IMAGES } from "../data/images.js";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
  { name: "Photo Gallery", path: "/gallery" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Navigation = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // LP（離脱を避けたいページ）ではロゴのみ表示し、メニュー類を出さない
  const isLandingPage = pathname?.startsWith("/sansai-delivery-01");

  // ハイドレーション問題を防ぐ
  useEffect(() => {
    setMounted(true);
  }, []);

  // テーマに応じてロゴを選択
  const getLogoSource = () => {
    if (!mounted) return LOGO_IMAGES.primary; // 初期表示時はデフォルト
    return theme === "dark" ? LOGO_IMAGES.primaryWhite : LOGO_IMAGES.primary;
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={getLogoSource()}
              alt="SANSAI ONLINE"
              width={534}
              height={223}
              className="h-16 w-auto transition-opacity duration-300"
            />
          </Link>

          {/* デスクトップメニュー（LPでは非表示） */}
          {!isLandingPage && (
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-accent ${
                  pathname === item.path
                    ? "text-accent"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
            <UserMenu />
          </div>
          )}

          {/* モバイルメニューボタン（LPでは非表示） */}
          {!isLandingPage && (
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(prev => !prev)}
              className="inline-flex items-center justify-center h-8 rounded-md px-2.5 text-sm font-medium transition-all text-foreground hover:bg-accent hover:text-accent-foreground outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]"
              aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          )}
        </div>

        {/* モバイルメニュー */}
        {!isLandingPage && isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md border-t border-border/50">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-accent ${
                    pathname === item.path
                      ? "text-accent"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2 flex items-center gap-3">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
