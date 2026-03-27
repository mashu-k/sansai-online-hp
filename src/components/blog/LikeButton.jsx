"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
  serverTimestamp,
  collection,
  getCountFromServer,
} from "firebase/firestore";

const LikeButton = ({ postId, onLoginRequired }) => {
  const { user, isProfileComplete } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [processing, setProcessing] = useState(false);

  // いいね数と自分のいいね状態を取得
  const fetchLikeState = useCallback(async () => {
    try {
      // いいね数を取得
      const likesCol = collection(db, "posts", postId, "likes");
      const countSnap = await getCountFromServer(likesCol);
      setLikeCount(countSnap.data().count);

      // 自分のいいね状態を確認
      if (user) {
        const myLikeRef = doc(db, "posts", postId, "likes", user.uid);
        const myLikeSnap = await getDoc(myLikeRef);
        setLiked(myLikeSnap.exists());
      }
    } catch (error) {
      console.error("いいね状態の取得エラー:", error);
    }
  }, [postId, user]);

  useEffect(() => {
    fetchLikeState();
  }, [fetchLikeState]);

  const handleLike = async () => {
    if (!user || !isProfileComplete) {
      onLoginRequired?.();
      return;
    }

    if (processing) return;
    setProcessing(true);

    const myLikeRef = doc(db, "posts", postId, "likes", user.uid);
    const postRef = doc(db, "posts", postId);

    try {
      if (liked) {
        // 楽観的UI更新
        setLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));

        await deleteDoc(myLikeRef);
        await updateDoc(postRef, { likeCount: increment(-1) });
      } else {
        // 楽観的UI更新
        setLiked(true);
        setLikeCount((prev) => prev + 1);

        await setDoc(myLikeRef, { createdAt: serverTimestamp() });
        await updateDoc(postRef, { likeCount: increment(1) });
      }
    } catch (error) {
      console.error("いいね処理エラー:", error);
      // エラー時は状態を元に戻す
      await fetchLikeState();
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="lg"
      onClick={handleLike}
      disabled={processing}
      className={`gap-2 transition-all ${
        liked
          ? "text-red-500 border-red-500/30 hover:text-red-600 hover:border-red-500/50 bg-red-500/5"
          : "hover:text-red-500 hover:border-red-500/30"
      }`}
    >
      <Heart
        className={`h-5 w-5 transition-all ${liked ? "fill-current" : ""}`}
      />
      <span className="font-medium">{likeCount}</span>
    </Button>
  );
};

export default LikeButton;
