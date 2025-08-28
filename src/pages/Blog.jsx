"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";

// 画像のインポート
import mountainImage1 from "../assets/O3BPW6fJZvdO.jpg";
import mountainImage2 from "../assets/Gug695rWIM25.jpg";
import mountainImage3 from "../assets/5ie679JxHPf1.jpeg";
import mountainImage4 from "../assets/7O7pjhDJ1SN1.jpg";
import mountainImage5 from "../assets/a6CgwvylfNmr.jpg";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const blogPosts = [
    {
      id: 1,
      title: "残雪の槍ヶ岳　飛騨沢での山スキー",
      date: "2024-06-09",
      readTime: "8分",
      excerpt:
        "おばけないんてないさ〜♪ おばけなんてうそさ〜 ねーぼけた人が見間違えたのさ！ だけどちょっと、だけどちょっと、僕だって怖いな…",
      content:
        "槍ヶ岳の残雪期における山スキーの記録です。飛騨沢ルートを使用し、厳しい条件下での挑戦となりました。",
      image: mountainImage1,
      category: "山スキー",
      tags: ["槍ヶ岳", "山スキー", "残雪期"],
    },
    {
      id: 2,
      title: "【日本100名山】2024/3 厳冬期　利尻山南稜→北稜下降",
      date: "2024-06-08",
      readTime: "12分",
      excerpt:
        "それはただひたすらに艶やかな白い肌を持ち、色気を含む魅力(尾根)をたくさん有する。それはまるで寒風吹き荒れる北の海に住まうセイレーン…",
      content:
        "北海道の利尻山での厳冬期登山記録。南稜から登り、北稜を下降するルートでの挑戦的な登山でした。",
      image: mountainImage2,
      category: "厳冬期登山",
      tags: ["利尻山", "厳冬期", "100名山"],
    },
    {
      id: 3,
      title: "富士山　お釜と頂上からのスキー滑降",
      date: "2024-05-17",
      readTime: "10分",
      excerpt:
        "5/11 6:00須走5合目→(須走ルート)→13:30浅間大社奥宮→14:00剣ヶ峰ドロップ→15:30浅間大社奥宮→1…",
      content:
        "富士山でのスキー滑降記録。お釜から頂上へのルートと、そこからの滑降の詳細な記録です。",
      image: mountainImage3,
      category: "スキー滑降",
      tags: ["富士山", "スキー", "滑降"],
    },
    {
      id: 4,
      title: "北アルプス縦走記録　表銀座コース",
      date: "2024-04-15",
      readTime: "15分",
      excerpt:
        "燕岳から槍ヶ岳まで続く表銀座コースの縦走記録。美しい稜線歩きと厳しい岩場の連続でした。",
      content:
        "北アルプスの代表的な縦走コースである表銀座コースの詳細な記録です。",
      image: mountainImage4,
      category: "縦走",
      tags: ["北アルプス", "縦走", "表銀座"],
    },
    {
      id: 5,
      title: "雲海に浮かぶ山々　早朝登山の魅力",
      date: "2024-03-20",
      readTime: "6分",
      excerpt:
        "早朝の山登りでしか見ることのできない絶景。雲海に浮かぶ山々の美しさについて語ります。",
      content: "早朝登山の魅力と、雲海の美しさについての考察記事です。",
      image: mountainImage5,
      category: "風景",
      tags: ["雲海", "早朝", "風景"],
    },
  ];

  const categories = [
    { id: "all", name: "すべて", count: 5 },
    { id: "山スキー", name: "山スキー", count: 1 },
    { id: "厳冬期登山", name: "厳冬期登山", count: 1 },
    { id: "スキー滑降", name: "スキー滑降", count: 1 },
    { id: "縦走", name: "縦走", count: 1 },
    { id: "風景", name: "風景", count: 1 },
  ];

  const popularTags = [
    { name: "槍ヶ岳", count: 8 },
    { name: "富士山", count: 12 },
    { name: "北アルプス", count: 15 },
    { name: "山スキー", count: 6 },
    { name: "厳冬期", count: 4 },
    { name: "縦走", count: 7 },
  ];

  const relatedPosts = [
    {
      id: 6,
      title: "初心者向け登山ガイド",
      date: "2024年2月15日",
      image: mountainImage1,
    },
    {
      id: 7,
      title: "山小屋泊まりのコツ",
      date: "2024年1月20日",
      image: mountainImage2,
    },
    {
      id: 8,
      title: "登山写真撮影テクニック",
      date: "2024年1月10日",
      image: mountainImage3,
    },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      {/* ヘッダーセクション */}
      <section className="py-20 px-4 bg-gradient-to-b from-card/20 to-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-thin mb-6 text-gradient"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            BLOG
          </motion.h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            未踏の世界への冒険記録と山岳体験を共有します
          </motion.p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* メインコンテンツエリア */}
            <div className="lg:w-2/3">
              <div className="grid md:grid-cols-2 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                            {post.category}
                          </span>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            {post.date}
                          </div>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Clock className="h-4 w-4 mr-1" />
                            {post.readTime}
                          </div>
                        </div>

                        <h2 className="text-xl font-medium mb-4 text-card-foreground hover:text-accent transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {post.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <Link href={`/blog/${post.id}`}>
                          <Button variant="outline" className="group w-full">
                            続きを読む
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* ページネーション */}
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    前へ
                  </Button>
                  <Button variant="default" size="sm">
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    次へ
                  </Button>
                </div>
              </div>
            </div>

            {/* サイドバー */}
            <div className="lg:w-1/3">
              <div className="space-y-8 sticky top-24">
                {/* 検索ボックス */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">検索</h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="記事を検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-muted text-foreground px-4 py-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                {/* 関連記事 */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">関連記事</h3>
                    <div className="space-y-4">
                      {relatedPosts.map((post) => (
                        <div key={post.id} className="flex gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={post.image}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1 hover:text-accent transition-colors">
                              <Link href={`/blog/${post.id}`}>{post.title}</Link>
                            </h4>
                            <p className="text-muted-foreground text-xs">
                              {post.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* カテゴリー */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">カテゴリー</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory === category.id
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{category.name}</span>
                            <span className="text-sm bg-muted px-2 py-1 rounded-full">
                              {category.count}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 人気タグ */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">人気タグ</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-accent/20 hover:bg-accent/30 text-accent px-3 py-1 rounded-full text-sm cursor-pointer transition-colors"
                        >
                          {tag.name}
                          <span className="ml-1 text-xs opacity-75">
                            ({tag.count})
                          </span>
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* ニュースレター購読 */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">
                      ニュースレター購読
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      最新の登山記録や情報をメールで受け取りませんか？
                    </p>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="お名前"
                        className="w-full bg-muted text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <input
                        type="email"
                        placeholder="メールアドレス"
                        className="w-full bg-muted text-foreground px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <Button className="w-full">購読する</Button>
                    </div>
                    <p className="text-muted-foreground text-xs mt-2">
                      スパムメールは送信しません。いつでも配信停止できます。
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
