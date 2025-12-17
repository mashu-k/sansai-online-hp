"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Calendar, Tag, BookOpen, Clock } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

const BlogSidebar = ({ currentPostId }) => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(
          postsRef,
          where("status", "==", "published"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate().toLocaleDateString("ja-JP") || doc.data().date,
        }));

        // 最新記事（現在の記事を除く）
        const recent = posts
          .filter((post) => post.id !== String(currentPostId))
          .slice(0, 3);
        setRecentPosts(recent);

        // カテゴリー集計
        const categoryCounts = {
          "海外遠征": 0,
          "冬山": 0,
          "スキー": 0,
          "フリークライミング": 0,
          "その他": 0
        };

        posts.forEach(post => {
          if (post.category && categoryCounts.hasOwnProperty(post.category)) {
            categoryCounts[post.category]++;
          } else if (post.category) {
            // 定義されていないカテゴリーも一応カウント（移行期間用）
            categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
          }
        });

        const categoryArray = Object.entries(categoryCounts).map(([name, count]) => ({
          name,
          count
        }));
        setCategories(categoryArray);

        // タグ集計
        const tagCounts = {};
        posts.forEach(post => {
          if (post.tags && Array.isArray(post.tags)) {
            post.tags.forEach(tag => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });

        const tagArray = Object.entries(tagCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10) // 上位10件
          .map(([name]) => name);
        setTags(tagArray);

      } catch (error) {
        console.error("サイドバーデータの取得に失敗:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPostId]);

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-muted rounded-lg"></div>
      <div className="h-64 bg-muted rounded-lg"></div>
    </div>;
  }

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

      {/* 最新記事 */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5" />
            最新記事
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block group"
              >
                <div className="flex gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted relative">
                    {post.thumbnail ? (
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        sizes="64px"
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <BookOpen className="w-6 h-6" />
                      </div>
                    )}
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
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">記事がありません</p>
          )}
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
            人気タグ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {tags.length > 0 ? (
              tags.map((tag) => (
                <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                  <Badge
                    variant="outline"
                    className="text-xs hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">タグがありません</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSidebar;
