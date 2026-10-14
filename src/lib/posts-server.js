import { cache } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { logger } from "@/lib/logger";

// サーバーコンポーネント用の記事取得。
// Server → Client Component に渡す値は JSON 化できる必要があるため、
// Firestore の Timestamp は ISO 文字列に変換し、表示用の date も付与する。

const JA_DATE = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "numeric",
  day: "numeric",
});

const toDateObj = (value) => {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

export function serializePost(id, data) {
  const createdAt = toDateObj(data.createdAt);
  const updatedAt = toDateObj(data.updatedAt);
  return {
    ...data,
    id,
    createdAt: createdAt ? createdAt.toISOString() : null,
    updatedAt: updatedAt ? updatedAt.toISOString() : null,
    date: createdAt ? JA_DATE.format(createdAt) : data.date || "",
  };
}

// 公開済み記事を新しい順に取得
export const getPublishedPosts = cache(async () => {
  try {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "published"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => serializePost(d.id, d.data()));
  } catch (error) {
    logger.error("posts-server: 記事一覧の取得に失敗", error);
    return null;
  }
});

// 公開済み記事を1件取得（未公開・存在しない場合は null）
export const getPublishedPost = cache(async (id) => {
  if (!id) return null;
  try {
    const snap = await getDoc(doc(db, "posts", id));
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data.status !== "published") return null;
    return serializePost(snap.id, data);
  } catch (error) {
    logger.error("posts-server: 記事の取得に失敗", error);
    return null;
  }
});
