"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Trash2, Send, Reply, Shield, Heart, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { getAvatarEmoji } from "@/lib/avatar-presets";
import { ADMIN_EMAILS, ADMIN_DISPLAY } from "@/lib/admin-config";
// LOGO_IMAGES is no longer needed for admin avatar
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  doc,
  updateDoc,
  increment,
  query,
  orderBy,
  serverTimestamp,
  getCountFromServer,
} from "firebase/firestore";

const COMMENT_MAX_LENGTH = 500;
const COOLDOWN_MS = 10000;

// コメントいいねボタン
const CommentLikeButton = ({ postId, commentId, user, onLoginRequired }) => {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchState = async () => {
      try {
        const likesCol = collection(db, "posts", postId, "comments", commentId, "likes");
        const snap = await getCountFromServer(likesCol);
        setCount(snap.data().count);
        if (user) {
          const myRef = doc(db, "posts", postId, "comments", commentId, "likes", user.uid);
          const mySnap = await getDoc(myRef);
          setLiked(mySnap.exists());
        }
      } catch {}
    };
    fetchState();
  }, [postId, commentId, user]);

  const handleToggle = async () => {
    if (!user) { onLoginRequired?.(); return; }
    if (processing) return;
    setProcessing(true);
    const myRef = doc(db, "posts", postId, "comments", commentId, "likes", user.uid);
    try {
      if (liked) {
        setLiked(false);
        setCount((c) => Math.max(0, c - 1));
        await deleteDoc(myRef);
      } else {
        setLiked(true);
        setCount((c) => c + 1);
        await setDoc(myRef, { createdAt: serverTimestamp() });
      }
    } catch {
      setLiked(!liked);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={processing}
      className={`text-xs flex items-center gap-1 transition-colors ${
        liked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
      }`}
    >
      <Heart className={`h-3 w-3 ${liked ? "fill-current" : ""}`} />
      {count > 0 && <span>{count}</span>}
    </button>
  );
};

const CommentSection = ({ postId, onLoginRequired }) => {
  const { user, userProfile, isProfileComplete } = useAuth();
  const [comments, setComments] = useState([]);
  const [userProfiles, setUserProfiles] = useState({}); // uid -> { nickname, avatar }
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [error, setError] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const replyFormRef = useRef(null);

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // ユーザープロフィールをまとめて取得（参照方式）
  const fetchUserProfiles = useCallback(async (uids) => {
    const uniqueUids = [...new Set(uids)];
    const profiles = {};
    await Promise.all(
      uniqueUids.map(async (uid) => {
        try {
          const snap = await getDoc(doc(db, "users", uid));
          if (snap.exists()) {
            profiles[uid] = snap.data();
          }
        } catch {}
      })
    );
    setUserProfiles(profiles);
  }, []);

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const commentsRef = collection(db, "posts", postId, "comments");
      const q = query(commentsRef, orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        createdAt: d.data().createdAt?.toDate(),
      }));
      setComments(list);
      // 全コメントのユーザープロフィールを一括取得（管理者含む）
      const uids = list.map((c) => c.uid);
      if (uids.length > 0) {
        await fetchUserProfiles(uids);
      }
    } catch (error) {
      console.error("コメント取得エラー:", error);
    } finally {
      setLoading(false);
    }
  }, [postId, fetchUserProfiles]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // コメントの表示名・アイコンを解決（参照方式）
  const resolveDisplay = (comment) => {
    if (comment.isAdminReply) {
      const adminProfile = userProfiles[comment.uid];
      // 現在ログイン中の管理者ならリアルタイムのGoogle名
      const name = (user && comment.uid === user.uid)
        ? (user.displayName || adminProfile?.nickname || "Admin")
        : (adminProfile?.nickname || comment.nickname || "Admin");
      return { nickname: name, avatar: ADMIN_DISPLAY.avatar };
    }
    const profile = userProfiles[comment.uid];
    if (profile) {
      return { nickname: profile.nickname, avatar: profile.avatar };
    }
    // フォールバック: コメントに保存されたコピーを使用
    return { nickname: comment.nickname, avatar: comment.avatar };
  };

  const handleSubmit = async (e, parentId = null) => {
    e.preventDefault();
    const trimmed = content.trim();

    if (!user || !isProfileComplete) {
      onLoginRequired?.();
      return;
    }
    if (!trimmed) return;
    if (trimmed.length > COMMENT_MAX_LENGTH) {
      setError(`コメントは${COMMENT_MAX_LENGTH}文字以内で入力してください。`);
      return;
    }
    if (cooldown) return;

    setSubmitting(true);
    setError("");

    try {
      const postAsAdmin = isAdmin;
      const commentData = {
        uid: user.uid,
        nickname: postAsAdmin ? (user.displayName || userProfile.nickname) : userProfile.nickname,
        avatar: postAsAdmin ? ADMIN_DISPLAY.avatar : userProfile.avatar,
        content: trimmed,
        createdAt: serverTimestamp(),
        isDeleted: false,
        deletedBy: null,
        parentId: parentId || null,
        isAdminReply: postAsAdmin,
      };

      const commentsRef = collection(db, "posts", postId, "comments");
      await addDoc(commentsRef, commentData);

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { commentCount: increment(1) });

      setContent("");
      setReplyTo(null);
      setCooldown(true);
      setTimeout(() => setCooldown(false), COOLDOWN_MS);
      await fetchComments();
    } catch (error) {
      console.error("コメント投稿エラー:", error);
      setError("コメントの投稿に失敗しました。もう一度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!user) return;
    const canDelete = isAdmin || userProfile?.role === "admin";
    const comment = comments.find((c) => c.id === commentId);
    if (!comment) return;
    if (comment.uid !== user.uid && !canDelete) return;

    try {
      const commentRef = doc(db, "posts", postId, "comments", commentId);
      await updateDoc(commentRef, {
        isDeleted: true,
        deletedBy: comment.uid === user.uid ? "self" : "admin",
      });
      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, { commentCount: increment(-1) });
      await fetchComments();
    } catch (error) {
      console.error("コメント削除エラー:", error);
    }
  };


  const getTopLevelParentId = (comment) => {
    if (!comment.parentId) return comment.id;
    return comment.parentId;
  };

  const handleReply = (comment) => {
    if (!user || !isProfileComplete) {
      onLoginRequired?.();
      return;
    }
    const display = resolveDisplay(comment);
    const topLevelId = getTopLevelParentId(comment);
    setReplyTo({ id: topLevelId, nickname: display.nickname });
    setContent("");
    setError("");
    setTimeout(() => {
      replyFormRef.current?.querySelector("textarea")?.focus();
    }, 50);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const visibleComments = comments.filter((c) => !c.isDeleted);
  const topLevelComments = visibleComments.filter((c) => !c.parentId);
  const getReplies = (parentId) =>
    visibleComments.filter((c) => c.parentId === parentId);

  const renderAvatar = (display) => {
    if (display.avatar === "admin") {
      return (
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-0.5 bg-accent/10 flex items-center justify-center">
          <Image
            src={ADMIN_DISPLAY.avatarImage}
            alt="SANSAI ONLINE"
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
    return (
      <div className="text-2xl flex-shrink-0 mt-0.5">
        {getAvatarEmoji(display.avatar)}
      </div>
    );
  };

  const renderInlineReplyForm = (parentId) => {
    if (!replyTo || replyTo.id !== parentId) return null;
    return (
      <div ref={replyFormRef} className="ml-8 pl-4 border-l-2 border-accent/30 mt-2">
        <form onSubmit={(e) => handleSubmit(e, parentId)} className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>
              <span className="font-medium text-foreground">{replyTo.nickname}</span> に返信
            </span>
            <button
              type="button"
              onClick={() => { setReplyTo(null); setContent(""); }}
              className="hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-start gap-2">
            {isAdmin ? (
              <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1 bg-accent/10 flex items-center justify-center">
                <Image
                  src={ADMIN_DISPLAY.avatarImage}
                  alt="SANSAI ONLINE"
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="text-lg flex-shrink-0 mt-1">
                {getAvatarEmoji(userProfile?.avatar)}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`${replyTo.nickname} への返信を入力...`}
                maxLength={COMMENT_MAX_LENGTH}
                rows={2}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-xs text-muted-foreground">
                  {content.length}/{COMMENT_MAX_LENGTH}
                </span>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting || cooldown || !content.trim()}
                  className="h-7 text-xs"
                >
                  <Send className="h-3 w-3 mr-1" />
                  {submitting ? "送信中..." : "返信"}
                </Button>
              </div>
            </div>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </form>
      </div>
    );
  };

  const renderComment = (comment, isReply = false) => {
    const display = resolveDisplay(comment);
    return (
      <div
        key={comment.id}
        className={`flex gap-3 ${isReply ? "ml-8 pl-4 border-l-2 border-border/30" : ""}`}
      >
        {renderAvatar(display)}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{display.nickname}</span>
            {comment.isAdminReply && (
              <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 gap-0.5">
                <Shield className="h-2.5 w-2.5" />
                管理者
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm mt-1 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <CommentLikeButton
              postId={postId}
              commentId={comment.id}
              user={user}
              onLoginRequired={onLoginRequired}
            />
            <button
              onClick={() => handleReply(comment)}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <Reply className="h-3 w-3" />
              返信
            </button>
            {user &&
              (comment.uid === user.uid || isAdmin || userProfile?.role === "admin") && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  削除
                </button>
              )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        コメント ({visibleComments.length})
      </h3>

      {/* トップレベル投稿フォーム */}
      {user && isProfileComplete ? (
        !replyTo && (
          <form onSubmit={(e) => handleSubmit(e, null)} className="space-y-3">
            <div className="flex items-start gap-3">
              {isAdmin ? (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 mt-1 bg-accent/10 flex items-center justify-center">
                  <Image
                    src={ADMIN_DISPLAY.avatarImage}
                    alt="SANSAI ONLINE"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="text-2xl flex-shrink-0 mt-1">
                  {getAvatarEmoji(userProfile?.avatar)}
                </div>
              )}
              <div className="flex-1">
                {isAdmin && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-sm font-medium">{user.displayName || "Admin"}</span>
                    <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 gap-0.5">
                      <Shield className="h-2.5 w-2.5" />
                      管理者
                    </Badge>
                  </div>
                )}
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="コメントを入力..."
                  maxLength={COMMENT_MAX_LENGTH}
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {content.length}/{COMMENT_MAX_LENGTH}
                  </span>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={submitting || cooldown || !content.trim()}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    {submitting ? "送信中..." : cooldown ? "しばらくお待ちください" : "送信"}
                  </Button>
                </div>
              </div>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </form>
        )
      ) : (
        <Card className="bg-muted/30">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              コメントするにはログインが必要です
            </p>
            <Button variant="outline" size="sm" onClick={onLoginRequired}>
              ログインする
            </Button>
          </CardContent>
        </Card>
      )}

      {/* コメント一覧 */}
      {loading ? (
        <p className="text-muted-foreground text-sm">読み込み中...</p>
      ) : visibleComments.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-4">
          まだコメントはありません。最初のコメントを投稿しましょう！
        </p>
      ) : (
        <div className="space-y-5">
          {topLevelComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {renderComment(comment)}
              {getReplies(comment.id).map((reply) =>
                renderComment(reply, true)
              )}
              {renderInlineReplyForm(comment.id)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
