"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// ダーク基調のLPでは共通ヘッダーを白ロゴ＋ダーク帯で表示させたいので、
// 該当ルートだけテーマをダーク固定にする（離脱すると元のテーマに戻る）。
const FORCE_DARK_PREFIXES = ["/shop/print-harvest"];

export default function ThemeProvider({ children }) {
  const pathname = usePathname();
  const forcedTheme =
    pathname && FORCE_DARK_PREFIXES.some((p) => pathname.startsWith(p))
      ? "dark"
      : undefined;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      forcedTheme={forcedTheme}
    >
      {children}
    </NextThemesProvider>
  );
}
