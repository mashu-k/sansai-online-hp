import React, { Suspense } from "react";
import Blog from "@/components/pages/Blog";

export const metadata = {
  title: "ブログ - 登山・クライミング記録",
  description:
    "山菜採りオンラインの登山・クライミング記録ブログ。アルパインクライミング、冬山、海外遠征のレポートを掲載。",
};

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-foreground pt-20 flex items-center justify-center"><p className="text-muted-foreground">読み込み中...</p></div>}>
      <Blog />
    </Suspense>
  );
}
