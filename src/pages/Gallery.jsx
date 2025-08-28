import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Download, Heart, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import Image from "next/image";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("all");

  // public/img/page/gallery 配下の画像を使用
  // ファイル名: gallery-0.JPG ~ gallery-27.JPG（連番）
  const ids = Array.from({ length: 28 }, (_, i) => i);
  const categoryByIndex = (i) => {
    const list = ["landscape", "autumn", "winter", "volcanic", "flora"];
    return list[i % list.length];
  };
  const photos = ids.map((i) => ({
    id: i + 1,
    src: `/img/page/gallery/gallery-${i}.JPG`,
    title: `GALLERY ${i + 1}`,
    location: "",
    category: categoryByIndex(i),
    description: "",
  }));

  const categories = [
    { key: "all", label: "すべて" },
    { key: "landscape", label: "風景" },
    { key: "autumn", label: "紅葉" },
    { key: "winter", label: "雪景色" },
    { key: "volcanic", label: "火山" },
    { key: "flora", label: "高山植物" },
  ];

  const filteredPhotos =
    filter === "all"
      ? photos
      : photos.filter((photo) => photo.category === filter);

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
            PHOTO GALLERY
          </motion.h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            未踏の世界で撮影した美しい山岳風景をお楽しみください
          </motion.p>
        </div>
      </section>

      {/* フィルターセクション */}
      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={filter === category.key ? "default" : "outline"}
                onClick={() => setFilter(category.key)}
                className="transition-all duration-300"
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* ギャラリーグリッド */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedImage(photo)}
              >
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-medium mb-1">
                      {photo.title}
                    </h3>
                    <p className="text-white/80 text-sm">{photo.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* モーダル */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            <motion.div
              className="relative w-[90vw] max-w-4xl h-[80vh]"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                fill
                sizes="90vw"
                className="object-contain rounded-lg"
                priority
                decoding="async"
                fetchPriority="high"
              />
            </motion.div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-xl font-medium mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-white/80 mb-4">{selectedImage.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-white/60">{selectedImage.location}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Gallery;
