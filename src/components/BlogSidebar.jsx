"use client";
import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Calendar, Tag, BookOpen } from "lucide-react";

// 画像のインポート
import mountainImage1 from "../assets/O3BPW6fJZvdO.jpg";
import mountainImage2 from "../assets/5ie679JxHPf1.jpeg";
import mountainImage3 from "../assets/Y9uxgQCqF1sY.jpg";

const BlogSidebar = ({ currentPostId }) => {
  // 関連記事データ
  const relatedPosts = [
    {
      id: 1,
      title: "残雪の槍ヶ岳　飛騨沢での山スキー",
      date: "2024-06-09",
      image: mountainImage1,
    },
    {
      id: 2,
      title: "【日本100名山】2024/3 厳冬期　利尻山南稜→北稜下降",
      date: "2024-06-08",
      image: mountainImage2,
    },
    {
      id: 3,
      title: "富士山　お釜と頂上からのスキー滑降",
      date: "2024-05-17",
      image: mountainImage3,
    },
  ].filter((post) => post.id !== currentPostId);

  // カテゴリーデータ
  const categories = [
    { name: "山スキー", count: 8 },
    { name: "厳冬期登山", count: 12 },
    { name: "スキー滑降", count: 6 },
    { name: "縦走", count: 15 },
    { name: "風景", count: 20 },
  ];

  // タグデータ
  const tags = [
    "槍ヶ岳",
    "利尻山",
    "富士山",
    "北アルプス",
    "雲海",
    "厳冬期",
    "山スキー",
    "縦走",
    "風景写真",
    "登山記録",
  ];

  return (
    <div className="space-y-6">
      {/* 検索ボックス */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Search className="w-5 h-5" />
            記事を検索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input placeholder="キーワードを入力..." className="flex-1" />
            <Button size="sm" variant="outline">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 関連記事 */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5" />
            関連記事
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {relatedPosts.slice(0, 3).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block group"
            >
              <div className="flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-accent-foreground transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {post.date}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* カテゴリー */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5" />
            カテゴリー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/blog?category=${encodeURIComponent(category.name)}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-colors group"
              >
                <span className="text-sm group-hover:text-accent-foreground transition-colors">
                  {category.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* タグ */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Tag className="w-5 h-5" />
            タグ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                <Badge
                  variant="outline"
                  className="text-xs hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ニュースレター購読 */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">最新記事を受け取る</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            SANSAI ONLINEの最新の冒険記録をメールで受け取りませんか？
          </p>
          <div className="space-y-3">
            <Input placeholder="お名前" />
            <Input placeholder="メールアドレス" type="email" />
            <Button className="w-full">購読する</Button>
          </div>
          <p className="text-xs text-muted-foreground">
            スパムメールは送信しません。いつでも購読解除できます。
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSidebar;
