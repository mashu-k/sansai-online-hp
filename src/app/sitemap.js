import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { logger } from "@/lib/logger";

const SITE_URL = "https://www.sansai-online.com";

// Googleが参照するサイトマップ。1時間ごとに再生成し、公開済み記事を自動で含める。
export const revalidate = 3600;

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "daily", priority: 0.9 },
  { path: "/gallery", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.4 },
  { path: "/mashu", changeFrequency: "monthly", priority: 0.6 },
  { path: "/kosuke", changeFrequency: "monthly", priority: 0.6 },
  { path: "/tetsu", changeFrequency: "monthly", priority: 0.6 },
  { path: "/shop/shiyko-tshirt", changeFrequency: "monthly", priority: 0.5 },
  { path: "/sansai-delivery-01", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
  { path: "/tokushoho", changeFrequency: "yearly", priority: 0.2 },
];

const toDate = (value) => {
  if (!value) return undefined;
  if (typeof value.toDate === "function") return value.toDate();
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

async function fetchPublishedPosts() {
  try {
    const q = query(collection(db, "posts"), where("status", "==", "published"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        url: `${SITE_URL}/blog/${d.id}`,
        lastModified: toDate(data.updatedAt) || toDate(data.createdAt),
        changeFrequency: "monthly",
        priority: 0.7,
      };
    });
  } catch (error) {
    logger.error("sitemap: 記事一覧の取得に失敗", error);
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();
  const staticEntries = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
  const posts = await fetchPublishedPosts();
  return [...staticEntries, ...posts];
}
