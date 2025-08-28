import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Download, Heart, Share2 } from 'lucide-react';
import { Button } from '../components/ui/button';

// 画像のインポート
import mountainImage1 from '../assets/O3BPW6fJZvdO.jpg';
import mountainImage2 from '../assets/Gug695rWIM25.jpg';
import mountainImage3 from '../assets/5ie679JxHPf1.jpeg';
import mountainImage4 from '../assets/7O7pjhDJ1SN1.jpg';
import mountainImage5 from '../assets/a6CgwvylfNmr.jpg';
import heroImage from '../assets/Y9uxgQCqF1sY.jpg';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('all');

  const photos = [
    {
      id: 1,
      src: heroImage,
      title: "雲海に浮かぶ山々",
      location: "北アルプス",
      category: "landscape",
      description: "早朝の雲海に浮かぶ美しい山々の風景"
    },
    {
      id: 2,
      src: mountainImage1,
      title: "紅葉の山岳風景",
      location: "立山連峰",
      category: "autumn",
      description: "秋の紅葉が美しい山岳地帯"
    },
    {
      id: 3,
      src: mountainImage2,
      title: "湖面に映る山々",
      location: "上高地",
      category: "landscape",
      description: "静寂な湖面に映る雄大な山々"
    },
    {
      id: 4,
      src: mountainImage3,
      title: "火山の荒々しい風景",
      location: "阿蘇山",
      category: "volcanic",
      description: "火山活動による荒々しい地形"
    },
    {
      id: 5,
      src: mountainImage4,
      title: "高山植物の楽園",
      location: "白馬岳",
      category: "flora",
      description: "高山に咲く美しい花々"
    },
    {
      id: 6,
      src: mountainImage5,
      title: "雪化粧の峰々",
      location: "穂高連峰",
      category: "winter",
      description: "雪に覆われた美しい山々"
    }
  ];

  const categories = [
    { key: 'all', label: 'すべて' },
    { key: 'landscape', label: '風景' },
    { key: 'autumn', label: '紅葉' },
    { key: 'winter', label: '雪景色' },
    { key: 'volcanic', label: '火山' },
    { key: 'flora', label: '高山植物' }
  ];

  const filteredPhotos = filter === 'all' 
    ? photos 
    : photos.filter(photo => photo.category === filter);

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
                <img 
                  src={photo.src} 
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-medium mb-1">{photo.title}</h3>
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
            
            <motion.img 
              src={selectedImage.src} 
              alt={selectedImage.title}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="text-white text-xl font-medium mb-2">{selectedImage.title}</h3>
              <p className="text-white/80 mb-4">{selectedImage.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-white/60">{selectedImage.location}</span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
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

