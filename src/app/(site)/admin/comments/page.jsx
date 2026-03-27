"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  Trash2,
  Send,
  Search,
  ExternalLink,
  Shield,
  Heart,
  Filter,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAvatarEmoji } from "@/lib/avatar-presets";
import { ADMIN_EMAILS, ADMIN_DISPLAY } from "@/lib/admin-config";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  updateDoc,
  increment,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default function AdminCommentsPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState({}); // postId -> { title }
  const [userProfiles, setUserProfiles] = useState({}); // uid -> profile
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "recent" | "deleted"
  const [replyingTo, setReplyingTo] = useState(null); // commentId
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState(new Set());

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const fetchAllComments = useCallback(async () => {
    try {
      setLoading(true);

      // 全投稿を取得（タイトル用）
      const postsSnap = await getDocs(collection(db, "posts"));
      const postsMap = {};
      postsSnap.docs.forEach((d) => {
        postsMap[d.id] = { title: d.data().title, slug: d.id };
      });
      setPosts(postsMap);

      // 各記事のコメントを取得
      const allComments = [];
      await Promise.all(
        postsSnap.docs.map(async (postDoc) => {
          try {
            const commentsRef = collection(db, "posts", postDoc.id, "comments");
            const q = query(commentsRef, orderBy("createdAt", "desc"));
            const commentsSnap = await getDocs(q);
            commentsSnap.docs.forEach((d) => {
              allComments.push({
                id: d.id,
                postId: postDoc.id,
                ...d.data(),
                createdAt: d.data().createdAt?.toDate(),
              });
            });
          } catch (error) {
            console.error(`記事 ${postDoc.id} のコメント取得エラー:`, error);
          }
        })
      );

      // 新しい順にソート
      allComments.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setComments(allComments);

      // ユーザープロフィールを一括取得
      const uids = [...new Set(allComments.map((c) => c.uid))];
      const profiles = {};
      await Promise.all(
        uids.map(async (uid) => {
          try {
            const snap = await getDoc(doc(db, "users", uid));
            if (snap.exists()) profiles[uid] = snap.data();
          } catch {}
        })
      );
      setUserProfiles(profiles);
    } catch (error) {
      console.error("コメント取得エラー:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllComments();
  }, [fetchAllComments]);

  const handleDelete = async (postId, commentId) => {
    if (!window.confirm("このコメントを削除しますか？")) return;
    try {
      await updateDoc(doc(db, "posts", postId, "comments", commentId), {
        isDeleted: true,
        deletedBy: "admin",
      });
      await updateDoc(doc(db, "posts", postId), { commentCount: increment(-1) });
      await fetchAllComments();
    } catch (error) {
      console.error("削除エラー:", error);
    }
  };

  const handleReply = async (postId, parentCommentId) => {
    if (!replyContent.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, "posts", postId, "comments"), {
        uid: user.uid,
        nickname: user.displayName || "Admin",
        avatar: ADMIN_DISPLAY.avatar,
        content: replyContent.trim(),
        createdAt: serverTimestamp(),
        isDeleted: false,
        deletedBy: null,
        parentId: parentCommentId,
        isAdminReply: true,
      });
      await updateDoc(doc(db, "posts", postId), { commentCount: increment(1) });
      setReplyContent("");
      setReplyingTo(null);
      await fetchAllComments();
    } catch (error) {
      console.error("返信エラー:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return "たった今";
    if (mins < 60) return `${mins}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;
    return date.toLocaleDateString("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDisplayName = (comment) => {
    if (comment.isAdminReply) {
      // 管理者: 現在ログイン中ならGoogle名、そうでなければFirestore名
      if (user && comment.uid === user.uid) {
        return user.displayName || "Admin";
      }
      const profile = userProfiles[comment.uid];
      return profile?.nickname || comment.nickname || "Admin";
    }
    const profile = userProfiles[comment.uid];
    return profile?.nickname || comment.nickname;
  };

  const getDisplayAvatar = (comment) => {
    if (comment.isAdminReply) return null; // 専用画像を使用
    const profile = userProfiles[comment.uid];
    return getAvatarEmoji(profile?.avatar || comment.avatar);
  };

  // フィルタリング
  const filteredComments = comments.filter((c) => {
    if (filter === "recent") {
      const dayAgo = new Date(Date.now() - 86400000);
      return c.createdAt > dayAgo && !c.isDeleted;
    }
    if (filter === "deleted") return c.isDeleted;
    if (filter === "all") return !c.isDeleted;
    return true;
  }).filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    const name = getDisplayName(c)?.toLowerCase() || "";
    const postTitle = posts[c.postId]?.title?.toLowerCase() || "";
    return (
      name.includes(s) ||
      c.content?.toLowerCase().includes(s) ||
      postTitle.includes(s)
    );
  });

  // 記事ごとにグループ化し、スレッド構造で並べる（トップレベル→返信の順）
  const commentsByPost = {};
  filteredComments.forEach((c) => {
    if (!commentsByPost[c.postId]) commentsByPost[c.postId] = [];
    commentsByPost[c.postId].push(c);
  });
  // 各記事のコメントをスレッド順にソート
  Object.keys(commentsByPost).forEach((postId) => {
    const postComments = commentsByPost[postId];
    const topLevel = postComments.filter((c) => !c.parentId).sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
    const replies = postComments.filter((c) => c.parentId);
    const threaded = [];
    topLevel.forEach((parent) => {
      threaded.push(parent);
      const childReplies = replies
        .filter((r) => r.parentId === parent.id)
        .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      childReplies.forEach((r) => threaded.push(r));
    });
    // parentIdがあるが親が見つからないコメント（孤立返信）も末尾に追加
    const orphans = replies.filter((r) => !topLevel.some((t) => t.id === r.parentId));
    orphans.forEach((r) => threaded.push(r));
    commentsByPost[postId] = threaded;
  });

  // 新着コメント数（24時間以内）
  const recentCount = comments.filter((c) => {
    if (c.isDeleted || c.isAdminReply) return false;
    const dayAgo = new Date(Date.now() - 86400000);
    return c.createdAt > dayAgo;
  }).length;

  const activeCount = comments.filter((c) => !c.isDeleted).length;

  const togglePostExpand = (postId) => {
    setExpandedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  // 初回は全て展開
  useEffect(() => {
    if (!loading && Object.keys(commentsByPost).length > 0) {
      setExpandedPosts(new Set(Object.keys(commentsByPost)));
    }
  }, [loading]);

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">コメント管理</h1>
        <p className="text-muted-foreground text-sm">
          すべての記事のコメントを確認・返信・削除できます
        </p>
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-xs text-muted-foreground">コメント</p>
            </div>
          </CardContent>
        </Card>
        <Card className={recentCount > 0 ? "border-accent/50" : ""}>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className={`h-8 w-8 ${recentCount > 0 ? "text-accent" : "text-muted-foreground"}`} />
            <div>
              <p className="text-2xl font-bold">{recentCount}</p>
              <p className="text-xs text-muted-foreground">新着（24h）</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hidden md:block">
          <CardContent className="p-4 flex items-center gap-3">
            <Trash2 className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-2xl font-bold">{comments.filter((c) => c.isDeleted).length}</p>
              <p className="text-xs text-muted-foreground">削除済み</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルター */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="コメント内容、ユーザー名、記事タイトルで検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {[
            { key: "all", label: "すべて" },
            { key: "recent", label: "新着" },
            { key: "deleted", label: "削除済み" },
          ].map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* コメント一覧（記事ごとにグループ化） */}
      {loading ? (
        <p className="text-muted-foreground text-sm text-center py-8">読み込み中...</p>
      ) : Object.keys(commentsByPost).length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">コメントが見つかりません</p>
      ) : (
        <div className="space-y-4">
          {Object.entries(commentsByPost).map(([postId, postComments]) => {
            const post = posts[postId];
            const isExpanded = expandedPosts.has(postId);

            return (
              <Card key={postId}>
                {/* 記事ヘッダー（YouTube Studio風） */}
                <button
                  onClick={() => togglePostExpand(postId)}
                  className="w-full text-left p-4 flex items-center justify-between hover:bg-muted/30 transition-colors rounded-t-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MessageCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {post?.title || "不明な記事"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {postComments.length}件のコメント
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/blog/${postId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* コメント一覧 */}
                {isExpanded && (
                  <div className="border-t border-border/50">
                    {postComments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-4 border-b border-border/30 last:border-b-0 ${
                          comment.isDeleted ? "opacity-50" : ""
                        } ${comment.parentId ? "pl-12" : ""}`}
                      >
                        <div className="flex gap-3">
                          {/* アバター */}
                          {comment.isAdminReply ? (
                            <Image
                              src={ADMIN_DISPLAY.avatarImage}
                              alt="Admin"
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center">
                              {getDisplayAvatar(comment)}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            {/* ヘッダー */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">
                                {getDisplayName(comment)}
                              </span>
                              {comment.isAdminReply && (
                                <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 gap-0.5">
                                  <Shield className="h-2.5 w-2.5" />
                                  管理者
                                </Badge>
                              )}
                              {comment.isDeleted && (
                                <Badge variant="destructive" className="text-[10px]">削除済み</Badge>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatDate(comment.createdAt)}
                              </span>
                            </div>

                            {/* コメント本文 */}
                            <p className="text-sm mt-1 whitespace-pre-wrap break-words">
                              {comment.content}
                            </p>

                            {/* アクションボタン */}
                            {!comment.isDeleted && (
                              <div className="flex items-center gap-3 mt-2">
                                {!comment.isAdminReply && (
                                  <button
                                    onClick={() => {
                                      setReplyingTo(replyingTo === comment.id ? null : comment.id);
                                      setReplyContent("");
                                    }}
                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                                  >
                                    <Send className="h-3 w-3" />
                                    返信
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDelete(comment.postId, comment.id)}
                                  className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  削除
                                </button>
                              </div>
                            )}

                            {/* インライン返信フォーム */}
                            {replyingTo === comment.id && (
                              <div className="mt-3 flex gap-2">
                                <Input
                                  value={replyContent}
                                  onChange={(e) => setReplyContent(e.target.value)}
                                  placeholder="返信を入力..."
                                  className="text-sm"
                                  maxLength={500}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                      e.preventDefault();
                                      handleReply(comment.postId, comment.parentId || comment.id);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  disabled={!replyContent.trim() || submitting}
                                  onClick={() => handleReply(comment.postId, comment.parentId || comment.id)}
                                >
                                  <Send className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => { setReplyingTo(null); setReplyContent(""); }}
                                >
                                  キャンセル
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
