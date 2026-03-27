"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, BarChart3, Users, MessageCircle, ArrowRight, Heart } from "lucide-react";
import { ADMIN_EMAILS } from "@/lib/admin-config";
import { db } from "@/lib/firebase";
import {
  collection,
  getCountFromServer,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, published: 0, users: 0 });
  const [likeRanking, setLikeRanking] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsSnap, publishedSnap, usersSnap] = await Promise.all([
          getCountFromServer(collection(db, "posts")),
          getCountFromServer(query(collection(db, "posts"), where("status", "==", "published"))),
          getCountFromServer(collection(db, "users")),
        ]);
        setStats({
          posts: postsSnap.data().count,
          published: publishedSnap.data().count,
          users: usersSnap.data().count,
        });
      } catch (error) {
        console.error("統計取得エラー:", error);
      }
    };

    const fetchLikeRanking = async () => {
      try {
        const postsSnap = await getDocs(
          query(collection(db, "posts"), where("status", "==", "published"))
        );
        const results = await Promise.all(
          postsSnap.docs.map(async (postDoc) => {
            const likesSnap = await getCountFromServer(
              collection(db, "posts", postDoc.id, "likes")
            );
            return {
              id: postDoc.id,
              title: postDoc.data().title,
              likes: likesSnap.data().count,
            };
          })
        );
        const sorted = results.sort((a, b) => b.likes - a.likes);
        setTotalLikes(sorted.reduce((sum, r) => sum + r.likes, 0));
        setLikeRanking(sorted.slice(0, 5));
      } catch (error) {
        console.error("いいねランキング取得エラー:", error);
      }
    };

    fetchStats();
    fetchLikeRanking();
  }, []);

  const cards = [
    {
      title: "ブログ管理",
      description: `${stats.posts}件の記事（${stats.published}件公開中）`,
      icon: FileText,
      href: "/admin/posts",
      color: "text-blue-500",
    },
    {
      title: "コメント",
      description: "コメントの確認・返信・管理",
      icon: MessageCircle,
      href: "/admin/comments",
      color: "text-purple-500",
    },
    {
      title: "アクセス解析",
      description: "GA4のアクセスデータを確認",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "text-green-500",
    },
    {
      title: "ユーザー管理",
      description: `${stats.users}人の登録ユーザー`,
      icon: Users,
      href: "/admin/users",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>
        <p className="text-muted-foreground text-sm mt-1">SANSAI ONLINE 管理パネル</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href}>
              <Card className="hover:border-accent/30 transition-colors cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <Icon className={`h-8 w-8 ${card.color} mb-3`} />
                      <h3 className="font-semibold">{card.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{card.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* いいねサマリー */}
      <div className="mt-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-5 w-5 text-red-500" />
              <h3 className="font-semibold">いいねランキング</h3>
              <Badge variant="secondary" className="ml-auto">合計 {totalLikes} いいね</Badge>
            </div>
            {likeRanking.length === 0 ? (
              <p className="text-sm text-muted-foreground">データなし</p>
            ) : (
              <div className="space-y-2">
                {likeRanking.map((item, i) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-bold text-muted-foreground w-5 text-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <Link
                        href={`/blog/${item.id}`}
                        className="text-sm truncate hover:text-accent transition-colors"
                      >
                        {item.title}
                      </Link>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-3">
                      <Heart className="h-3.5 w-3.5 text-red-500" />
                      <span className="text-sm font-medium">{item.likes}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
