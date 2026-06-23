"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LOGO_IMAGES } from "../data/images.js";
import {
  Mail,
  Youtube,
  Instagram,
} from "lucide-react";

const currentYear = new Date().getFullYear();

// 共通フッターを出さず、LP専用フッターに差し替えるルート（離脱防止のため）
const HIDE_FOOTER_PREFIXES = ["/shop/print-harvest"];

const Footer = () => {
  const pathname = usePathname();
  if (pathname && HIDE_FOOTER_PREFIXES.some((p) => pathname.startsWith(p))) {
    return null;
  }
  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-border/50 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ブランド情報 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Image
                src={LOGO_IMAGES.longWhite}
                alt="SANSAI ONLINE"
                width={200}
                height={64}
                className="h-16 w-auto"
                loading="lazy"
              />
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              互いにロープを結び、森林限界を超えた先に未だ見ぬ山菜を収穫することができるのだろうか。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://youtube.com/@sansai_online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/sansai_online"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* ナビゲーション */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">ナビゲーション</h4>
            <nav className="space-y-2">
              <Link
                href="/"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                href="/blog"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                Blog
              </Link>
              <Link
                href="/gallery"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                Photo Gallery
              </Link>
              <Link
                href="/about"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* カテゴリー */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">カテゴリー</h4>
            <nav className="space-y-2">
              {[
                { slug: "overseas", name: "海外遠征" },
                { slug: "winter", name: "冬山" },
                { slug: "ski", name: "スキー" },
                { slug: "climbing", name: "フリークライミング" },
                { slug: "gear", name: "ギアレビュー" },
                { slug: "other", name: "その他" },
              ].map((cat) => (
                <a
                  key={cat.slug}
                  href={`/blog?category=${cat.slug}`}
                  className="block text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  {cat.name}
                </a>
              ))}
            </nav>
          </div>

          {/* お問い合わせ情報 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">お問い合わせ</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <div
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  sansaitorionline@gmail.com
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Youtube className="h-4 w-4 text-accent flex-shrink-0" />
                <a
                  href="https://youtube.com/@sansai_online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  YouTube チャンネル
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="border-t border-border/50 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © {currentYear} SANSAI ONLINE. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-muted-foreground text-sm">
              <Link href="/privacy" className="hover:text-accent transition-colors">
                プライバシーポリシー
              </Link>
              <Link href="/terms" className="hover:text-accent transition-colors">
                利用規約
              </Link>
              <Link href="/tokushoho" className="hover:text-accent transition-colors">
                特定商取引法に基づく表記
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 背景装飾 */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent pointer-events-none"></div>
    </footer>
  );
};

export default Footer;
