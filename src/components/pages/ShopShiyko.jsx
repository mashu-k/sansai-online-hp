"use client";
import React, { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { ExternalLink, ShoppingCart, Sparkles, Mountain } from "lucide-react";

const ShopShiyko = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity1 = useTransform(scrollY, [0, 300], [1, 0]);
  const opacity2 = useTransform(scrollY, [200, 500], [0, 1]);

  const [isVisible, setIsVisible] = useState({});

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target.id) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: entry.isIntersecting,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const productImages = [
    "/img/shop-lp/shiyko/81B426BD-5EAF-408B-B779-869EA374B75C.png",
    "/img/shop-lp/shiyko/CD9DDC62-2F4E-4872-8969-F9833278F046.png",
  ];

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const features = [
    {
      title: "プレミアムクオリティ",
      description: "最高品質の素材を使用した、着心地抜群のTシャツ",
      icon: Sparkles,
    },
    {
      title: "オリジナルデザイン",
      description: "版画アーティスト井澤juneさんとのコラボデザイン",
      icon: Mountain,
    },
    {
      title: "限定生産",
      description: "数量限定の特別なコレクションアイテム",
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ヒーローセクション */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* 背景画像 */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: y1, opacity: opacity1 }}
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${productImages[0]})`,
            }}
          />
        </motion.div>

        {/* オーバーレイグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background z-5" />

        {/* コンテンツ */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          style={{ opacity: opacity1 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="inline-block mb-6 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full border border-accent/30">
              <span className="text-accent text-sm font-medium tracking-wider">
                SPECIAL COLLABORATION
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            井澤june
            <br />
            コラボTシャツ
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            版画アーティストとのコラボレーションによる
            <br />
            限定デザインTシャツ
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg h-auto"
              onClick={() =>
                window.open(
                  "https://sansai-online.booth.pm/items/7951384",
                  "_blank"
                )
              }
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              購入ページへ
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* スクロールインジケーター */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 bg-white rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* 商品画像ギャラリー */}
      <section id="gallery" className="py-20 px-4 bg-card/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.gallery ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-gradient">
              PRODUCT GALLERY
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {productImages.map((image, index) => (
              <motion.div
                key={index}
                className="aspect-square overflow-hidden rounded-2xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isVisible.gallery ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={image}
                  alt={`商品画像 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 商品詳細 */}
      <section id="details" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.details ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-gradient">
              PRODUCT DETAILS
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible.details ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-3xl font-bold mb-6 text-accent">
                井澤june × SANSAI ONLINE
              </h3>
              <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                版画アーティスト井澤juneさんとのスペシャルコラボレーション。山をテーマにした独創的なデザインが特徴のプレミアムTシャツです。
              </p>
              <p className="text-lg leading-relaxed mb-6 text-muted-foreground">
                着心地の良い高品質な素材を使用し、日常使いからアウトドアシーンまで幅広くお使いいただけます。
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                限定生産のため、この機会をお見逃しなく。
              </p>

              <div className="mt-8 p-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl">
                <h4 className="text-xl font-semibold mb-4">商品情報</h4>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center">
                    <span className="w-24 font-medium text-foreground">
                      価格:
                    </span>
                    <span className="text-2xl font-bold text-accent">
                      ¥5,000
                    </span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-24 font-medium text-foreground">
                      サイズ:
                    </span>
                    <span>S / M / L / XL / XXL</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-24 font-medium text-foreground">
                      素材:
                    </span>
                    <span>コットン100%</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-24 font-medium text-foreground">
                      カラー:
                    </span>
                    <span>ホワイト</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.details ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl mb-6">
                <img
                  src={productImages[1]}
                  alt="商品詳細画像"
                  className="w-full h-full object-cover"
                />
              </div>
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-8">
                  <Button
                    size="lg"
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg"
                    onClick={() =>
                      window.open(
                        "https://sansai-online.booth.pm/items/7951384",
                        "_blank"
                      )
                    }
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    今すぐ購入
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    ※サイズ選択は購入ページで行えます
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ライフスタイルセクション */}
      <section id="lifestyle" className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.lifestyle ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-gradient">
              LIFESTYLE
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              日常からアウトドアまで、あらゆるシーンに
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <motion.div
              className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl"
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible.lifestyle ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <img
                src={productImages[0]}
                alt="デイリーユース"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    デイリーユース
                  </h3>
                  <p className="text-white/80">
                    日常使いにぴったりな、着心地の良いデザイン
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.lifestyle ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src={productImages[1]}
                alt="アウトドアシーン"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    アウトドアシーン
                  </h3>
                  <p className="text-white/80">
                    山や自然の中でも映える、特別なデザイン
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section id="features" className="py-20 px-4 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-gradient">
              FEATURES
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-card-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* 商品詳細画像 */}
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="aspect-square overflow-hidden rounded-xl shadow-lg">
              <img
                src={productImages[0]}
                alt="デザイン詳細"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-xl shadow-lg">
              <img
                src={productImages[1]}
                alt="着用イメージ"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="aspect-square overflow-hidden rounded-xl shadow-lg">
              <img
                src={productImages[0]}
                alt="プリント詳細"
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTAセクション */}
      <section id="cta" className="py-20 px-4 bg-gradient-to-b from-background to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.cta ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-gradient">
              限定生産
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              数量限定の特別なコレクション。
              <br />
              なくなり次第終了となります。
            </p>

            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-8 text-xl h-auto"
              onClick={() =>
                window.open(
                  "https://sansai-online.booth.pm/items/7951384",
                  "_blank"
                )
              }
            >
              <ShoppingCart className="mr-3 h-6 w-6" />
              BOOTHで購入する
              <ExternalLink className="ml-3 h-5 w-5" />
            </Button>

            <p className="text-sm text-muted-foreground mt-8">
              ※購入ページ（BOOTH）が新しいタブで開きます
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ShopShiyko;
