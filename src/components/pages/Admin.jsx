"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Plus, Edit, Trash2, Eye, Calendar, Clock } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";

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
      const postsRef = collection(db, "posts");
      let q;

      if (filter !== "all") {
        q = query(postsRef, where("status", "==", filter), orderBy("createdAt", "desc"));
      } else {
        q = query(postsRef, orderBy("createdAt", "desc"));
      }

      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date:
          doc.data().createdAt?.toDate().toLocaleDateString("ja-JP") ||
          doc.data().date,
      }));
      setPosts(postsData);
      console.log("取得した記事数:", postsData.length);
    } catch (error) {
      console.error("記事の取得に失敗しました:", error);
      console.error("エラーの詳細:", error.message);
      // エラーが発生しても空の配列を設定して、UIが表示されるようにする
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("この記事を削除しますか？")) return;

    try {
      await deleteDoc(doc(db, "posts", id));
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
    <div className="p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">ブログ記事管理</h1>
              <p className="text-muted-foreground text-sm">
                記事の作成、編集、削除を行えます
              </p>
            </div>
            <Link href="/admin/posts/new">
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
                <Link href="/admin/posts/new">
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
                        <Link href={`/admin/posts/edit/${post.id}`}>
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
  );
};

export default Admin;
