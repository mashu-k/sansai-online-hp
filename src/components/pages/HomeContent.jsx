"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Youtube, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { app } from "@/lib/firebase-config";
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";

const db = getFirestore(app);

// ギャラリー画像（最適化済みサムネイル）
const galleryImages = [
  "/img/page/gallery/gallery-1-thumb.webp",
  "/img/page/gallery/gallery-2-thumb.webp",
  "/img/page/gallery/gallery-3-thumb.webp",
  "/img/page/gallery/gallery-4-thumb.webp",
];

const HomeContent = () => {
  const [isVisible, setIsVisible] = useState({});
  const [adventures, setAdventures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestPosts();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const fetchLatestPosts = async () => {
    try {
      setLoading(true);
      const postsRef = collection(db, "posts");
      const q = query(
        postsRef,
        where("status", "==", "published"),
        orderBy("createdAt", "desc"),
        limit(3)
      );
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        date:
          doc.data().createdAt?.toDate().toLocaleDateString("ja-JP") ||
          doc.data().date,
        image: doc.data().thumbnail || "/img/home/first.webp",
      }));
      setAdventures(posts);
    } catch (error) {
      console.error("最新記事の取得に失敗しました:", error);
      setAdventures([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ミッションセクション */}
      <section id="mission" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.mission ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-thin mb-6 dark:text-gradient">
              ABOUT US
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible.mission ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="text-2xl font-light mb-6 text-accent">
                ❝山菜採りオンライン❞
              </h3>
              <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                山菜を求めて3人の若者が集まった。
              </p>
              <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                大学山岳部で鍛えた登山技術を総動員して未踏の世界を冒険する。
              </p>
              <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                未だ収穫は無し。しかし、その日を夢見て今日も森林限界を超えていく。
              </p>
            </motion.div>

            <motion.div
              className="grid gap-4"
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.mission ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="w-full">
                <iframe
                  src="https://lumalabs.ai/embed/b7ca7404-1097-495e-a2a3-a23af5e3d7a2?mode=sparkles&background=%23ffffff&color=%23000000&showTitle=true&loadBg=true&logoPosition=bottom-left&infoPosition=bottom-right&cinematicVideo=undefined&showMenu=false"
                  height="300"
                  title="rahmanZom"
                  style={{ border: "none" }}
                  className="rounded-lg shadow-lg w-full"
                  loading="lazy"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 冒険記録セクション */}
      <section id="adventures" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.adventures ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-thin mb-6 dark:text-gradient">
              BLOG
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">読み込み中...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {adventures.map((adventure, index) => (
                <motion.div
                  key={adventure.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isVisible.adventures ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden h-full">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      {adventure.image.startsWith("http") ? (
                        <img
                          src={adventure.image}
                          alt={adventure.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <Image
                          src={adventure.image}
                          alt={adventure.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-300 hover:scale-110"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <CardContent className="p-4 flex flex-col h-full">
                      <p className="text-sm text-accent mb-2">
                        {adventure.date}
                      </p>
                      <h3 className="text-lg font-medium mb-2 text-card-foreground line-clamp-2">
                        {adventure.title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                        {adventure.excerpt || adventure.description}
                      </p>
                      <Link href={`/blog/${adventure.id}`} aria-label={`${adventure.title}の詳細を見る`}>
                        <Button variant="outline" size="sm" className="w-full">
                          詳細を見る
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/blog">
              <Button size="lg" variant="outline">
                すべての記事を見る
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ギャラリーセクション */}
      <section id="gallery" className="py-20 px-4 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.gallery ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-thin mb-6 dark:text-gradient">
              GALLERY
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((imagePath, index) => (
              <motion.div
                key={index}
                className="aspect-square overflow-hidden rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible.gallery ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link href="/gallery">
                  <Image
                    src={imagePath}
                    alt={`Gallery image ${index + 1}`}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
                    loading="lazy"
                  />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* コンタクトセクション */}
      <section id="contact" className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.contact ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-thin mb-6 dark:text-gradient">
              ADVENTURE
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground mb-12">
              私たちと未踏の世界への冒険に行きませんか？
            </p>

            <div className="flex justify-center space-x-6">
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4"
              >
                <Youtube className="mr-2 h-5 w-5" />
                YouTube チャンネル
              </Button>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="px-8 py-4">
                  お問い合わせ
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HomeContent;
