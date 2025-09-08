"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Youtube, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// 画像のインポート部分を修正
import mountainImage1 from "../../assets/O3BPW6fJZvdO.jpg";

// ギャラリー画像のパスを文字列として定義
const galleryImages = [
  "/img/page/gallery/gallery-1.JPG",
  "/img/page/gallery/gallery-2.JPG",
  "/img/page/gallery/gallery-3.JPG",
  "/img/page/gallery/gallery-4.JPG",
];

const Home = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

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
        image: doc.data().thumbnail || mountainImage1, // サムネイルがない場合のフォールバック
      }));
      setAdventures(posts);
    } catch (error) {
      console.error("最新記事の取得に失敗しました:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* ヒーローセクション */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: y1 }}>
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url(/img/home/first.jpg)" }}
          />
        </motion.div>

        {/* オーバーレイを別の要素として配置 */}
        <div className="absolute inset-0 hero-gradient z-5" />

        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          style={{ opacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <img
              src="/img/logo/eng_png/whiteOnlyText.png"
              alt="SANSAI ONLINE"
              className="h-24 md:h-32 w-auto mx-auto mb-6"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <button
            onClick={() =>
              document
                .getElementById("mission")
                .scrollIntoView({ behavior: "smooth" })
            }
            className="text-white/60 hover:text-white transition-colors duration-300"
            aria-label="ミッションセクションにスクロール"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
        </motion.div>
      </section>

      {/* ミッションセクション */}
      <section id="mission" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.mission ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-thin mb-6 text-gradient">
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
                未だかつて誰も登ったことのない山があるのをご存じだろうか？
              </p>
              <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                また、誰もが登っているような山にも手付かずの場所が残されていることもある。
              </p>
              <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                この情報に溢れた現代においてもなお、国内外には未だ人間が足を踏み入れていない場所が眠っているのである。
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                そんな<strong className="text-accent">未踏の世界</strong>
                へ冒険するため、3人の若者が集まった。
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
            <h2 className="text-4xl md:text-5xl font-thin mb-6 text-gradient">
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
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={adventure.image}
                        alt={adventure.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
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
                      <Link href={`/blog/${adventure.id}`}>
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

          {/* ブログ一覧へのリンク */}
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
            <h2 className="text-4xl md:text-5xl font-thin mb-6 text-gradient">
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
                  <img
                    src={imagePath}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
                    loading="lazy"
                    decoding="async"
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
            <h2 className="text-4xl md:text-5xl font-thin mb-6 text-gradient">
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
    </div>
  );
};

export default Home;
