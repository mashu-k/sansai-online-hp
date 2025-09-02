"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Mail,
  Phone,
  MapPin,
  Youtube,
  Instagram,
  Send,
  MessageCircle,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // フォーム送信処理（実際の実装では適切なAPIエンドポイントに送信）
    console.log("Form submitted:", formData);
    alert("お問い合わせありがとうございます。後日ご連絡いたします。");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "メール",
      content: "sansaitorionline@gmail.com",
      description: "お気軽にメールでお問い合わせください",
    },
  ];

  const socialLinks = [
    {
      icon: Youtube,
      name: "YouTube",
      url: "https://www.youtube.com/@sansai_online",
      color: "text-red-500",
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: "https://www.instagram.com/sansai_online/",
      color: "text-pink-500",
    },
  ];

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
            CONTACT
          </motion.h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <motion.p
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            ご質問やご相談がございましたら、お気軽にお問い合わせください
          </motion.p>
        </div>
      </section>

      {/* メインコンテンツ */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* お問い合わせフォーム */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <MessageCircle className="h-6 w-6 text-accent mr-3" />
                    <h2 className="text-2xl font-medium text-card-foreground">
                      お問い合わせフォーム
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-card-foreground">
                          お名前 *
                        </label>
                        <Input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-background/50"
                          placeholder="山田 太郎"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-card-foreground">
                          メールアドレス *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-background/50"
                          placeholder="example@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-card-foreground">
                        件名 *
                      </label>
                      <Input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="bg-background/50"
                        placeholder="お問い合わせの件名"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-card-foreground">
                        メッセージ *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="bg-background/50"
                        placeholder="お問い合わせ内容をご記入ください"
                      />
                    </div>

                    <Button type="submit" className="w-full" size="lg">
                      <Send className="mr-2 h-4 w-4" />
                      送信する
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* 連絡先情報 */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-medium text-card-foreground mb-8">
                連絡先情報
              </h2>

              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="card-hover bg-card/50 backdrop-blur-sm border-border/50"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <info.icon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-medium text-card-foreground mb-1">
                          {info.title}
                        </h3>
                        <p className="text-accent mb-1">{info.content}</p>
                        <p className="text-muted-foreground text-sm">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* SNS */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-medium text-card-foreground mb-4">SNS</h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 bg-background/50 rounded-lg hover:bg-accent/20 transition-colors ${social.color}`}
                      >
                        <social.icon className="h-6 w-6" />
                      </a>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mt-4">
                    最新の冒険記録や美しい山岳写真をSNSで配信中
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
