"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Calendar, ArrowRight, Search, Flame, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

// 画像のインポート
import mountainImage1 from "../../assets/O3BPW6fJZvdO.jpg";
import mountainImage2 from "../../assets/Gug695rWIM25.jpg";
import mountainImage3 from "../../assets/5ie679JxHPf1.jpeg";

const Blog = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortMode, setSortMode] = useState("newest");
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  // URLパラメータからタグを読み取る（複数対応: ?tag=a&tag=b）
  useEffect(() => {
    const tagParams = searchParams.getAll("tag");
    if (tagParams.length > 0) {
      setSelectedTags(tagParams);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const postsRef = collection(db, "posts");
      const q = query(
        postsRef,
        where("status", "==", "published"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date:
          doc.data().createdAt?.toDate().toLocaleDateString("ja-JP") ||
          doc.data().date,
      }));
      setBlogPosts(posts);
      console.log("公開記事を取得:", posts.length);

      // カテゴリーとタグの統計を計算
      calculateStats(posts);
    } catch (error) {
      console.error("記事の取得に失敗しました:", error);
      console.error("エラーの詳細:", error.message);
      console.error("エラーコード:", error.code);
      // エラーが発生しても空の配列を設定
      setBlogPosts([]);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (posts) => {
    // カテゴリーの統計
    const categoryCounts = {};
    const tagCounts = {};

    posts.forEach((post) => {
      if (post.category) {
        categoryCounts[post.category] =
          (categoryCounts[post.category] || 0) + 1;
      }

      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
      }
    });

    // カテゴリー配列を作成
    const categoryArray = [
      { id: "all", name: "すべて", count: posts.length },
      ...Object.entries(categoryCounts).map(([id, count]) => ({
        id,
        name: id,
        count,
      })),
    ];
    setCategories(categoryArray);

    // 人気タグ配列を作成（上位6件）
    const sortedTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
    setPopularTags(sortedTags);
  };

  // selectedTags が変わったらURLを同期（レンダリング外で実行）
  const isInitialMount = React.useRef(true);
  useEffect(() => {
    // 初回マウント時（URLパラメータから読み取った場合）はスキップ
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (selectedTags.length === 0) {
      router.replace("/blog", { scroll: false });
    } else {
      const params = selectedTags.map((t) => `tag=${encodeURIComponent(t)}`).join("&");
      router.replace(`/blog?${params}`, { scroll: false });
    }
  }, [selectedTags]);

  const handleTagSelect = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  const removeTag = (tagName) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tagName));
  };

  const clearAllTags = () => {
    setSelectedTags([]);
  };

  // Firebase から取得した記事がない場合は空配列を使用
  const displayPosts = blogPosts.length > 0 ? blogPosts : [];

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // 検索やカテゴリー、ソート変更時にページを1に戻す
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortMode, selectedTags]);

  const filteredPosts = displayPosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || post.category === selectedCategory;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => post.tags && post.tags.includes(tag));
      return matchesSearch && matchesCategory && matchesTags;
    })
    .sort((a, b) => {
      if (sortMode === "popular") {
        return (b.analytics?.totalUsers || 0) - (a.analytics?.totalUsers || 0);
      }
      return 0; // createdAt descは既にFirestoreクエリで適用済み
    });

  // ページネーション用の計算
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // 関連記事を実際の記事から取得
  const getRelatedPosts = () => {
    if (blogPosts.length === 0) return relatedPosts;

    // 最新の3件を関連記事として表示
    return blogPosts.slice(0, 3).map((post) => ({
      id: post.id,
      title: post.title,
      date: post.date,
      thumbnail: post.thumbnail || mountainImage1,
    }));
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
      {/* ヘッダーセクション */}
      <section className="py-20 px-4 bg-gradient-to-b from-card/20 to-transparent">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-thin mb-6 text-gradient"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            BLOG
          </motion.h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            山行の参考に。なんちって。
          </motion.p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* メインコンテンツエリア */}
            <div className="lg:w-2/3">
              {/* 選択中タグの表示 */}
              {selectedTags.length > 0 && (
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">タグで絞り込み中:</span>
                  {selectedTags.map((tag) => (
                    <Badge key={tag} className="bg-accent text-accent-foreground px-3 py-1 text-sm">
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:opacity-70"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                  <span className="text-sm text-muted-foreground">
                    ({filteredPosts.length}件)
                  </span>
                  {selectedTags.length > 1 && (
                    <button
                      onClick={clearAllTags}
                      className="text-xs text-muted-foreground hover:text-accent transition-colors underline"
                    >
                      すべて解除
                    </button>
                  )}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-8">
                {currentPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  >
                    <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                      <div className="aspect-video overflow-hidden relative">
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full">
                            {post.category}
                          </span>
                          <div className="flex items-center text-muted-foreground text-sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            {post.date}
                          </div>
                          {post.analytics?.totalUsers > 10 && (
                            <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">
                              <Flame className="w-3 h-3 mr-1" />
                              人気
                            </Badge>
                          )}
                        </div>

                        <h2 className="text-xl font-medium mb-4 text-card-foreground hover:text-accent transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-muted-foreground mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {post.tags.map((tag, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.preventDefault();
                                handleTagSelect(tag);
                              }}
                              className={`px-2 py-1 rounded text-xs transition-colors ${
                                selectedTags.includes(tag)
                                  ? "bg-accent text-accent-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-accent/20 hover:text-accent"
                              }`}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>

                        <Link href={`/blog/${post.id}`}>
                          <Button variant="outline" className="group w-full">
                            続きを読む
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* ページネーション */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      前へ
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => paginate(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      次へ
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* サイドバー */}
            <div className="lg:w-1/3">
              <div className="space-y-8 sticky top-24">
                {/* 並び替え */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">並び替え</h3>
                    <div className="flex gap-2">
                      <Button
                        variant={sortMode === "newest" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortMode("newest")}
                        className="flex-1"
                      >
                        新着順
                      </Button>
                      <Button
                        variant={sortMode === "popular" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortMode("popular")}
                        className="flex-1"
                      >
                        <Flame className="w-4 h-4 mr-1" />
                        人気順
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* 検索ボックス */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">検索</h3>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="記事を検索..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-muted text-foreground px-4 py-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                      <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                {/* カテゴリー */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">カテゴリー</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === category.id
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-muted"
                            }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{category.name}</span>
                            <span className="text-sm bg-muted px-2 py-1 rounded-full">
                              {category.count}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* 人気タグ */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-4">人気タグ</h3>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag, index) => (
                        <button
                          key={index}
                          onClick={() => handleTagSelect(tag.name)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedTags.includes(tag.name)
                              ? "bg-accent text-accent-foreground"
                              : "bg-accent/20 hover:bg-accent/30 text-accent"
                          }`}
                        >
                          {tag.name}
                          <span className="ml-1 text-xs opacity-75">
                            ({tag.count})
                          </span>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
