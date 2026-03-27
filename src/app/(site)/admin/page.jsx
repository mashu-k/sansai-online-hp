"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, BarChart3, Users, MessageCircle, ArrowRight } from "lucide-react";
import { ADMIN_EMAILS } from "@/lib/admin-config";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer, query, where } from "firebase/firestore";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ posts: 0, published: 0, users: 0, comments: 0 });

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
    fetchStats();
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
    </div>
  );
}
