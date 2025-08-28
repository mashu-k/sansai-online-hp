"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Mountain,
  Users,
  Camera,
  Youtube,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";

// 画像のインポート
import mountainImage1 from "../assets/O3BPW6fJZvdO.jpg";
import mountainImage2 from "../assets/Gug695rWIM25.jpg";
import mountainImage3 from "../assets/5ie679JxHPf1.jpeg";
import mountainImage4 from "../assets/7O7pjhDJ1SN1.jpg";
import mountainImage5 from "../assets/a6CgwvylfNmr.jpg";

const Home = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
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

  const adventures = [
    {
      title: "残雪の槍ヶ岳　飛騨沢での山スキー",
      date: "2024-06-09",
      description:
        "おばけないんてないさ〜♪ おばけなんてうそさ〜 ねーぼけた人が見間違えたのさ！ だけどちょっと、だけどちょっと、僕だって怖いな…",
      image: mountainImage1,
    },
    {
      title: "【日本100名山】2024/3 厳冬期　利尻山南稜→北稜下降",
      date: "2024-06-08",
      description:
        "それはただひたすらに艶やかな白い肌を持ち、色気を含む魅力(尾根)をたくさん有する。それはまるで寒風吹き荒れる北の海に住まうセイレーン…",
      image: mountainImage2,
    },
    {
      title: "富士山　お釜と頂上からのスキー滑降",
      date: "2024-05-17",
      description:
        "5/11 6:00須走5合目→(須走ルート)→13:30浅間大社奥宮→14:00剣ヶ峰ドロップ→15:30浅間大社奥宮→1…",
      image: mountainImage3,
    },
  ];

  const galleryImages = [
    mountainImage4,
    mountainImage5,
    mountainImage1,
    mountainImage2,
  ];

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
          <motion.h1
            className="text-6xl md:text-8xl font-thin mb-6 text-gradient"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            SANSAI ONLINE
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl mb-8 text-muted-foreground font-light"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            未踏の世界への冒険
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/80 text-primary-foreground px-8 py-4 text-lg"
              onClick={() =>
                document
                  .getElementById("mission")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              冒険を始める
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-white/60" />
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
              className="grid grid-cols-3 gap-4"
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.mission ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <Mountain className="h-12 w-12 mx-auto mb-4 text-accent" />
                  <h4 className="font-medium text-card-foreground">未踏の山</h4>
                </CardContent>
              </Card>
              <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-accent" />
                  <h4 className="font-medium text-card-foreground">
                    3人のチーム
                  </h4>
                </CardContent>
              </Card>
              <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <Camera className="h-12 w-12 mx-auto mb-4 text-accent" />
                  <h4 className="font-medium text-card-foreground">
                    記録と共有
                  </h4>
                </CardContent>
              </Card>
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
              ADVENTURES
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground">最新の冒険記録</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {adventures.map((adventure, index) => (
              <motion.div
                key={index}
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
                    <p className="text-sm text-accent mb-2">{adventure.date}</p>
                    <h3 className="text-lg font-medium mb-2 text-card-foreground line-clamp-2">
                      {adventure.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">
                      {adventure.description}
                    </p>
                    <Link href={`/blog/${index + 1}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        詳細を見る
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

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
            <p className="text-xl text-muted-foreground">美しい山岳風景</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
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
                    src={image}
                    alt={`Mountain view ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
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
              JOIN OUR ADVENTURE
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
