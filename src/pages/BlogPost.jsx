"use client";
import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import BlogSidebar from "../components/BlogSidebar";
import { ArrowLeft, Calendar, Clock, MapPin, User, Tag } from "lucide-react";

// 画像のインポート
import mountainImage1 from "../assets/O3BPW6fJZvdO.jpg";
import mountainImage2 from "../assets/Gug695rWIM25.jpg";
import mountainImage3 from "../assets/5ie679JxHPf1.jpeg";

const BlogPost = () => {
  const params = useParams();
  const id = params?.id;

  const blogPosts = {
    1: {
      id: 1,
      title: "残雪の槍ヶ岳　飛騨沢での山スキー",
      date: "2024-06-09",
      readTime: "8分",
      location: "槍ヶ岳・飛騨沢",
      category: "山スキー",
      tags: ["槍ヶ岳", "山スキー", "残雪"],
      author: "SANSAI ONLINE",
      excerpt:
        "おばけないんてないさ〜♪ おばけなんてうそさ〜 ねーぼけた人が見間違えたのさ！ だけどちょっと、だけどちょっと、僕だって怖いな…",
      content: `
槍ヶ岳の残雪期における山スキーの記録です。飛騨沢ルートを使用し、厳しい条件下での挑戦となりました。

## 登山概要

**日程**: 2024年6月9日
**ルート**: 飛騨沢ルート
**天候**: 晴れ時々曇り
**メンバー**: 3名

## 行程

### 1日目
- 05:00 上高地出発
- 08:30 横尾到着
- 12:00 槍沢ロッヂ到着
- 15:00 槍ヶ岳山荘到着

### 2日目
- 04:00 槍ヶ岳山荘出発
- 06:30 槍ヶ岳山頂到着
- 08:00 スキー滑降開始
- 12:00 槍沢ロッヂ到着

## 装備

- 山スキー板
- シール
- ヘルメット
- アバランチビーコン
- プローブ
- ショベル

## 感想

残雪期の槍ヶ岳は格別の美しさでした。特に山頂からの360度のパノラマは圧巻で、北アルプスの雄大さを改めて感じることができました。

スキー滑降では新雪のパウダーを楽しむことができ、技術的にも非常に充実した山行となりました。
      `,
      image: mountainImage1,
    },
    2: {
      id: 2,
      title: "【日本100名山】2024/3 厳冬期　利尻山南稜→北稜下降",
      date: "2024-06-08",
      readTime: "12分",
      location: "利尻山",
      category: "厳冬期登山",
      tags: ["利尻山", "厳冬期", "日本100名山"],
      author: "SANSAI ONLINE",
      excerpt:
        "それはただひたすらに艶やかな白い肌を持ち、色気を含む魅力(尾根)をたくさん有する。それはまるで寒風吹き荒れる北の海に住まうセイレーン…",
      content: `
北海道の利尻山での厳冬期登山記録。南稜から登り、北稜を下降するルートでの挑戦的な登山でした。

## 登山概要

**日程**: 2024年3月15日-16日
**ルート**: 南稜→北稜下降
**天候**: 吹雪のち晴れ
**気温**: -15℃〜-25℃

## 厳冬期の利尻山

利尻山は北海道の最北端に位置する独立峰で、厳冬期の登山は極めて困難とされています。今回は南稜ルートからアプローチし、北稜を下降するという技術的に高度なルートを選択しました。

### 装備

- 冬山用テント
- -30℃対応シュラフ
- アイゼン（12本爪）
- ピッケル
- 雪洞掘削用具

## 山行記録

### 1日目
強風と吹雪の中でのスタート。視界は10m程度で、GPSとコンパスに頼った慎重な登行となりました。

### 2日目
天候が回復し、山頂からは360度の絶景を楽しむことができました。オホーツク海と日本海を同時に見渡せる贅沢な景色でした。

## まとめ

厳冬期の利尻山は想像以上に厳しい条件でしたが、その分達成感も格別でした。北海道の大自然の厳しさと美しさを同時に体験できる、忘れられない山行となりました。
      `,
      image: mountainImage2,
    },
    3: {
      id: 3,
      title: "富士山　お釜と頂上からのスキー滑降",
      date: "2024-05-17",
      readTime: "10分",
      location: "富士山",
      category: "スキー滑降",
      tags: ["富士山", "スキー滑降", "お釜"],
      author: "SANSAI ONLINE",
      excerpt:
        "5/11 6:00須走5合目→(須走ルート)→13:30浅間大社奥宮→14:00剣ヶ峰ドロップ→15:30浅間大社奥宮→1…",
      content: `
富士山でのスキー滑降記録。お釜から頂上へのルートと、そこからの滑降の詳細な記録です。

## 登山概要

**日程**: 2024年5月17日
**ルート**: 須走ルート
**天候**: 快晴
**積雪**: 山頂付近1.5m

## 詳細行程

### 登り
- 06:00 須走5合目出発
- 09:30 7合目到着
- 11:00 8合目到着
- 13:30 浅間大社奥宮到着
- 14:00 剣ヶ峰到達

### 滑降
- 14:00 剣ヶ峰からドロップイン
- 14:30 お釜周辺滑降
- 15:30 浅間大社奥宮帰着
- 17:00 須走5合目到着

## スキー滑降の魅力

富士山でのスキー滑降は、日本最高峰からの滑降という特別な体験です。特にお釜周辺の斜面は適度な傾斜があり、スキーヤーにとって非常に魅力的なフィールドです。

### 注意点

- 風の影響を受けやすい
- 雪質の変化が激しい
- 滑降ルートの事前確認が重要

## 装備

- 山スキー板（バックカントリー用）
- シール
- ヘルメット
- ゴーグル
- 防風ジャケット

## 感想

富士山からのスキー滑降は、技術的な挑戦と絶景を同時に楽しめる素晴らしい体験でした。日本最高峰からの滑降という特別感は、他では味わえない貴重な経験となりました。
      `,
      image: mountainImage3,
    },
  };

  const post = blogPosts[id];

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">記事が見つかりません</h1>
          <Link href="/blog">
            <Button>ブログ一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 関連記事（現在の記事以外）
  const relatedPosts = Object.values(blogPosts)
    .filter((p) => p.id !== parseInt(id))
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      {/* ヒーロー画像 */}
      <section className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${post.image})` }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-12 w-full">
            <Link href="/blog" className="inline-block mb-6">
              <Button
                variant="outline"
                size="sm"
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                ブログ一覧に戻る
              </Button>
            </Link>

            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>

            <div className="flex items-center space-x-6 text-white/80">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {post.date}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.readTime}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {post.location}
              </div>
            </div>

            {/* タグ */}
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-white border-white/50"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 記事本文 */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="prose prose-lg prose-invert max-w-none"
              >
                <div className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {post.excerpt}
                </div>

                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-8">
                    <div
                      className="text-foreground leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: post.content
                          .replace(/\n/g, "<br>")
                          .replace(
                            /## /g,
                            '<h2 class="text-2xl font-bold mt-8 mb-4 text-accent">'
                          )
                          .replace(
                            /### /g,
                            '<h3 class="text-xl font-semibold mt-6 mb-3 text-accent">'
                          )
                          .replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong class="text-accent">$1</strong>'
                          ),
                      }}
                    />
                  </CardContent>
                </Card>

                {/* 記事下の関連記事 */}
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">関連記事</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`}>
                        <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden h-full">
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={relatedPost.image}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                          <CardContent className="p-4">
                            <p className="text-sm text-accent mb-2">
                              {relatedPost.date}
                            </p>
                            <h3 className="text-lg font-medium mb-2 text-card-foreground line-clamp-2">
                              {relatedPost.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {relatedPost.category}
                            </Badge>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* サイドバー */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BlogSidebar currentPostId={parseInt(id)} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
