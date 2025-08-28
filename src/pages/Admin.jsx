"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Plus, Edit, Trash2, Eye, Calendar, Clock } from "lucide-react";

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?status=${filter}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("記事の取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("この記事を削除しますか？")) return;

    try {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      fetchPosts();
    } catch (error) {
      console.error("記事の削除に失敗しました:", error);
    }
  };

  const getStatusBadge = (status) => {
    return status === "published" ? (
      <Badge variant="default">公開</Badge>
    ) : (
      <Badge variant="secondary">下書き</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">ブログ記事管理</h1>
              <p className="text-muted-foreground">
                記事の作成、編集、削除を行えます
              </p>
            </div>
            <Link href="/admin/new">
              <Button size="lg">
                <Plus className="w-5 h-5 mr-2" />
                新規記事作成
              </Button>
            </Link>
          </div>

          {/* フィルター */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              すべて
            </Button>
            <Button
              variant={filter === "published" ? "default" : "outline"}
              onClick={() => setFilter("published")}
            >
              公開済み
            </Button>
            <Button
              variant={filter === "draft" ? "default" : "outline"}
              onClick={() => setFilter("draft")}
            >
              下書き
            </Button>
          </div>

          {/* 記事一覧 */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          ) : posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">記事がありません</p>
                <Link href="/admin/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    最初の記事を作成
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="bg-card/50 backdrop-blur-sm border-border/50"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">
                            {post.title}
                          </h3>
                          {getStatusBadge(post.status)}
                          {post.category && (
                            <Badge variant="outline">{post.category}</Badge>
                          )}
                        </div>

                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {post.excerpt ||
                            post.content.substring(0, 150) + "..."}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {post.read_time}
                          </div>
                          {post.location && <span>{post.location}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {post.status === "published" && (
                          <Link href={`/blog/${post.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                        )}
                        <Link href={`/admin/edit/${post.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePost(post.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
