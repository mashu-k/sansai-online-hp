import React from "react";
import BlogPost from "@/components/pages/BlogPost";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const post = docSnap.data();
      return {
        title: post.title || "ブログ記事",
        description:
          post.excerpt ||
          `山菜採りオンラインのブログ記事「${post.title || ""}」`,
      };
    }
  } catch (error) {
    // Firestoreからの取得に失敗した場合はデフォルト値を返す
  }

  return {
    title: "ブログ記事",
    description: "山菜採りオンラインのブログ記事",
  };
}

export default function BlogPostPage() {
  return <BlogPost />;
}
