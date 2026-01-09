"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Calendar, Clock, MapPin, User, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase";
import BlogSidebar from "../BlogSidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

const BlogPost = () => {
  const params = useParams();
  const id = params?.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setPost({
          id: docSnap.id,
          ...data,
          date:
            data.createdAt?.toDate().toLocaleDateString("ja-JP") || data.date,
        });
        console.log("記事を取得しました:", docSnap.id);

        // 関連記事を取得（タグまたはカテゴリ）
        fetchRelatedPosts(data.category, docSnap.id, data.tags);
      } else {
        console.log("記事が見つかりません。ID:", id);
      }
    } catch (error) {
      console.error("記事の取得に失敗しました:", error);
      console.error("エラーの詳細:", error.message);
      console.error("エラーコード:", error.code);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (category, currentPostId, tags = []) => {
    try {
      const postsRef = collection(db, "posts");
      let q;

      // タグがある場合はタグで検索
      if (tags && tags.length > 0) {
        q = query(
          postsRef,
          where("status", "==", "published"),
          where("tags", "array-contains-any", tags),
          orderBy("createdAt", "desc") // 作成日順でソート（必要に応じて）
        );
      } else {
        // タグがない場合はカテゴリーで検索
        q = query(
          postsRef,
          where("status", "==", "published"),
          where("category", "==", category),
          orderBy("createdAt", "desc")
        );
      }

      const snapshot = await getDocs(q);
      let posts = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date:
            doc.data().createdAt?.toDate().toLocaleDateString("ja-JP") ||
            doc.data().date,
        }))
        .filter((p) => p.id !== currentPostId);

      // タグ検索の場合、カテゴリー検索の結果も混ぜる（件数が少ない場合）
      // または、タグ検索でヒットしなかった場合にカテゴリー検索を行うなどの調整が可能
      // ここではシンプルに、タグ検索で不足する場合のフォールバックは複雑になるため
      // まずはタグ検索の結果を表示し、0件ならカテゴリー検索を行うロジックにする

      if (posts.length === 0) {
        // タグでもカテゴリーでもヒットしなかった場合、最新記事を表示
        const recentQ = query(
          postsRef,
          where("status", "==", "published"),
          orderBy("createdAt", "desc"),
          limit(4) // 自分自身が含まれる可能性があるので多めに取得
        );
        const recentSnapshot = await getDocs(recentQ);
        posts = recentSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            date:
              doc.data().createdAt?.toDate().toLocaleDateString("ja-JP") ||
              doc.data().date,
          }))
          .filter((p) => p.id !== currentPostId);
      }

      setRelatedPosts(posts.slice(0, 3)); // 表示数を3件に変更（デザインに合わせて調整）
      console.log("関連記事を取得:", posts.length);
    } catch (error) {
      console.error("関連記事の取得に失敗しました:", error);
      console.error("エラーの詳細:", error.message);
      console.error("エラーコード:", error.code);
      setRelatedPosts([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-20 flex items-center justify-center">
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">記事が見つかりません</h1>
          <Link href="/blog">
            <Button variant="outline">ブログ一覧に戻る</Button>
          </Link>
        </div>
      </div>
    );
  }

  // 関連記事は state で管理

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      {/* ヒーロー画像 */}
      <section className="relative h-96 overflow-hidden">
        <Image
          src={post.thumbnail}
          alt={post.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 pb-12 w-full">
            <Link href="/blog" className="block mb-6">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent text-white border-white hover:bg-white hover:text-black"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                ブログ一覧に戻る
              </Button>
            </Link>

            <Badge variant="secondary" className="mb-4">
              {post.category}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>

            <div className="flex items-center space-x-6 text-white/80">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {post.date}
              </div>

              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {post.location}
              </div>
            </div>

            {/* タグ */}
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-white border-white/50"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 記事本文 */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {post.excerpt}
                </div>
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({ children }) => (
                        <h2 className="text-3xl font-bold mt-12 mb-6 border-b-2 border-accent/20 pb-2">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-2xl font-semibold mt-10 mb-4 border-l-4 border-accent pl-4">
                          {children}
                        </h3>
                      ),
                      h4: ({ children }) => (
                        <h4 className="text-xl font-medium mt-8 mb-3 text-accent/80 bg-accent/5 px-3 py-2 rounded-lg">
                          {children}
                        </h4>
                      ),
                      p: ({ children, ...props }) => {
                        // 画像が含まれている場合は、pタグをdivに変更
                        if (
                          React.Children.toArray(children).some(
                            (child) =>
                              React.isValidElement(child) &&
                              child.type === "img"
                          )
                        ) {
                          return (
                            <div
                              className="mb-6 leading-relaxed text-foreground/90 text-base"
                              {...props}
                            >
                              {children}
                            </div>
                          );
                        }
                        return (
                          <p
                            className="mb-6 leading-relaxed text-foreground/90 text-base"
                            {...props}
                          >
                            {children}
                          </p>
                        );
                      },
                      strong: ({ children }) => (
                        <strong className="text-accent font-semibold">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-foreground/80">
                          {children}
                        </em>
                      ),
                      code: ({ children }) => (
                        <code className="px-2 py-1 bg-muted rounded text-sm font-mono text-accent border border-border/30">
                          {children}
                        </code>
                      ),
                      li: ({ children }) => (
                        <li className="ml-6 mb-3 text-foreground/90 leading-relaxed">
                          {children}
                        </li>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-6 list-disc">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-6 list-decimal list-inside">
                          {children}
                        </ol>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-accent/40 pl-6 py-4 my-6 bg-accent/5 rounded-r-lg italic text-foreground/80">
                          {children}
                        </blockquote>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-accent hover:text-accent/80 hover:underline transition-colors duration-200 underline-offset-2"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      img: ({ src, alt }) => (
                        <div className="my-8">
                          <img
                            src={src}
                            alt={alt}
                            className="w-full rounded-lg shadow-lg border border-border/30"
                          />
                          {alt && (
                            <div className="text-center text-sm text-muted-foreground mt-3 italic">
                              {alt}
                            </div>
                          )}
                        </div>
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>

                {/* 記事下の関連記事 */}
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">関連記事</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.id}`}
                      >
                        <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden h-full">
                          <div className="aspect-video overflow-hidden relative">
                            <Image
                              src={relatedPost.thumbnail}
                              alt={relatedPost.title}
                              fill
                              sizes="(min-width: 768px) 50vw, 100vw"
                              className="object-cover transition-transform duration-300 hover:scale-110"
                            />
                          </div>
                          <CardContent className="p-4">
                            <p className="text-sm text-accent mb-2">
                              {relatedPost.date}
                            </p>
                            <h3 className="text-lg font-medium mb-2 text-card-foreground line-clamp-2">
                              {relatedPost.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {relatedPost.category}
                            </Badge>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* サイドバー */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <BlogSidebar currentPostId={parseInt(id)} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
