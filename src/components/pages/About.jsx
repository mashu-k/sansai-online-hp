"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Mountain, Users, Camera, Target, Heart, Compass } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "川嵜摩周",
      nameEng: "Mashu Kawasaki",
      description: "明治大学出身",
      image: "/img/member/mashu.jpg",
    },
    {
      name: "橋本哲",
      nameEng: "Tetsu Hashimoto",
      description: "東京農大出身",
      image: "/img/member/tetsu.jpg",
    },
    {
      name: "河内皓亮",
      nameEng: "Kosuke Kawachi",
      description: "信州大学出身",
      image: "/img/member/kosuke.jpg",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "未踏への挑戦",
      description:
        "誰も足を踏み入れたことのない場所への探求心を大切にしています。",
    },
    {
      icon: Heart,
      title: "自然への敬意",
      description: "山と自然環境を尊重し、持続可能な登山を心がけています。",
    },
    {
      icon: Users,
      title: "チームワーク",
      description:
        "3人それぞれの専門性を活かし、安全で充実した冒険を実現します。",
    },
    {
      icon: Compass,
      title: "記録と共有",
      description:
        "体験を記録し、多くの人に山の魅力を伝えることを使命としています。",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      {/* ヒーローセクション */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/img/page/about/gallery-4.jpg)" }}
        />
        <div className="absolute inset-0 hero-gradient" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-thin mb-6 text-gradient"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            ABOUT US
          </motion.h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <motion.p
            className="text-xl text-white/90 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            未踏の世界への冒険を通じて、山の美しさと魅力を伝える3人のチーム
          </motion.p>
        </div>
      </section>

      {/* ミッションセクション */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-thin mb-6 text-gradient">
                Our Mission
              </h2>
              <div className="w-16 h-1 bg-accent mb-8"></div>

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
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="/img/page/about/bg.jpg"
                alt="Mountain landscape"
                className="w-full rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* チームメンバーセクション */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-thin mb-6 text-gradient">Members</h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground">
              {/* 大学山岳部出身 */}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="card-hover bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-6 text-center">
                    <div className="w-24 h-24 bg-accent/20 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-medium mb-2 text-card-foreground">
                      {member.name}
                    </h3>
                    <p className="text-accent mb-2">{member.nameEng}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
