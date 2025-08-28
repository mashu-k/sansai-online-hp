"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mountain,
  Mail,
  MapPin,
  Phone,
  Youtube,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-border/50 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ブランド情報 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mountain className="h-8 w-8 text-accent" />
              <h3 className="text-2xl font-bold text-gradient">
                SANSAI ONLINE
              </h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              未踏の世界への冒険を通じて、登山の美しさと魅力を伝える3人のチームです。
              私たちの記録と体験をお楽しみください。
            </p>
            <div className="flex space-x-4">
              <a
                href="https://youtube.com/@sansaionline"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/sansaionline"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/sansaionline"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <Twitter className="h-5 w-5" />
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
                ホーム
              </Link>
              <Link
                href="/blog"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                ブログ
              </Link>
              <Link
                href="/gallery"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                フォトギャラリー
              </Link>
              <Link
                href="/about"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                私たちについて
              </Link>
              <Link
                href="/contact"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                お問い合わせ
              </Link>
            </nav>
          </div>

          {/* カテゴリー */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">カテゴリー</h4>
            <nav className="space-y-2">
              <a
                href="/blog?category=山スキー"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                山スキー
              </a>
              <a
                href="/blog?category=厳冬期登山"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                厳冬期登山
              </a>
              <a
                href="/blog?category=スキー滑降"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                スキー滑降
              </a>
              <a
                href="/blog?category=縦走"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                縦走
              </a>
              <a
                href="/blog?category=風景"
                className="block text-muted-foreground hover:text-accent transition-colors text-sm"
              >
                風景
              </a>
            </nav>
          </div>

          {/* お問い合わせ情報 */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">お問い合わせ</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                <a
                  href="mailto:info@sansai.online"
                  className="text-muted-foreground hover:text-accent transition-colors text-sm"
                >
                  info@sansai.online
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                <span className="text-muted-foreground text-sm">
                  日本全国の山々
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Youtube className="h-4 w-4 text-accent flex-shrink-0" />
                <a
                  href="https://youtube.com/@sansaionline"
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
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                プライバシーポリシー
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                利用規約
              </Link>
              <Link
                href="/sitemap"
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                サイトマップ
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
