"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Save, Eye, X } from "lucide-react";

const AdminEdit = () => {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const isNew = id === "new";

  const [post, setPost] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    location: "",
    author: "SANSAI ONLINE",
    image_url: "",
    status: "draft",
    read_time: "5分",
    tags: [],
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    }
  }, [id, isNew]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error("記事の取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePost = async (status = post.status) => {
    try {
      setSaving(true);
      const postData = { ...post, status };

      const response = await fetch(isNew ? "/api/posts" : `/api/posts/${id}`, {
        method: isNew ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        console.error("保存に失敗しました");
      }
    } catch (error) {
      console.error("保存エラー:", error);
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !post.tags.includes(tagInput.trim())) {
      setPost((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* ヘッダー */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  戻る
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">
                {isNew ? "新規記事作成" : "記事編集"}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPreviewMode(!previewMode)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {previewMode ? "エディタ" : "プレビュー"}
              </Button>
              <Button
                onClick={() => savePost("draft")}
                disabled={saving}
                variant="outline"
              >
                下書き保存
              </Button>
              <Button onClick={() => savePost("published")} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                公開
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* メインエディタ */}
            <div className="lg:col-span-2">
              {previewMode ? (
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>プレビュー</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                    <div className="prose prose-lg max-w-none prose-invert">
                      {post.content.split("\n").map((paragraph, index) => {
                        if (paragraph.startsWith("## ")) {
                          return (
                            <h2
                              key={index}
                              className="text-2xl font-bold mt-8 mb-4"
                            >
                              {paragraph.replace("## ", "")}
                            </h2>
                          );
                        } else if (paragraph.startsWith("### ")) {
                          return (
                            <h3
                              key={index}
                              className="text-xl font-semibold mt-6 mb-3"
                            >
                              {paragraph.replace("### ", "")}
                            </h3>
                          );
                        } else if (paragraph.trim()) {
                          return (
                            <p key={index} className="mb-4 leading-relaxed">
                              {paragraph}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                    <CardHeader>
                      <CardTitle>記事内容</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          タイトル
                        </label>
                        <Input
                          value={post.title}
                          onChange={(e) =>
                            setPost((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          placeholder="記事のタイトルを入力..."
                          className="text-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          概要
                        </label>
                        <Textarea
                          value={post.excerpt}
                          onChange={(e) =>
                            setPost((prev) => ({
                              ...prev,
                              excerpt: e.target.value,
                            }))
                          }
                          placeholder="記事の概要を入力..."
                          rows={3}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          本文
                        </label>
                        <Textarea
                          value={post.content}
                          onChange={(e) =>
                            setPost((prev) => ({
                              ...prev,
                              content: e.target.value,
                            }))
                          }
                          placeholder="記事の本文を入力... (Markdownが使用できます)"
                          rows={20}
                          className="font-mono"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Markdownが使用できます。見出しは ## や ###
                          を使用してください。
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* サイドバー */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* 基本情報 */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        カテゴリー
                      </label>
                      <Input
                        value={post.category}
                        onChange={(e) =>
                          setPost((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        placeholder="山スキー、厳冬期登山など"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        場所
                      </label>
                      <Input
                        value={post.location}
                        onChange={(e) =>
                          setPost((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="槍ヶ岳、富士山など"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        読了時間
                      </label>
                      <Input
                        value={post.read_time}
                        onChange={(e) =>
                          setPost((prev) => ({
                            ...prev,
                            read_time: e.target.value,
                          }))
                        }
                        placeholder="5分"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        画像URL
                      </label>
                      <Input
                        value={post.image_url}
                        onChange={(e) =>
                          setPost((prev) => ({
                            ...prev,
                            image_url: e.target.value,
                          }))
                        }
                        placeholder="https://..."
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* タグ */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>タグ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="タグを入力..."
                        className="flex-1"
                      />
                      <Button onClick={addTag} size="sm">
                        追加
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminEdit;
