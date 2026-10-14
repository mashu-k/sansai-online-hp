import React, { Suspense } from "react";
import Blog from "@/components/pages/Blog";
import { getPublishedPosts } from "@/lib/posts-server";

// 記事一覧をサーバー側で描画し、各記事へのリンクを HTML に含める（クロール対象にする）。
export const revalidate = 600;

export const metadata = {
  title: "ブログ - 登山・クライミング記録",
  description:
    "山菜採りオンラインの登山・クライミング記録ブログ。アルパインクライミング、冬山、海外遠征のレポートを掲載。",
  alternates: { canonical: "https://www.sansai-online.com/blog" },
};

export default async function BlogPage() {
  const initialPosts = await getPublishedPosts();

  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-foreground pt-20 flex items-center justify-center"><p className="text-muted-foreground">読み込み中...</p></div>}>
      <Blog initialPosts={initialPosts} />
    </Suspense>
  );
}
