"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, MapPin, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const MemberProfile = ({ member }) => {
  return (
    <div className="min-h-screen bg-background text-foreground pt-20">
      {/* ヒーローセクション */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-accent/5" />
        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/about" className="inline-block mb-8">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              About Us
            </Button>
          </Link>

          <div className="grid md:grid-cols-3 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="md:col-span-1"
            >
              <div className="aspect-square relative rounded-2xl overflow-hidden shadow-xl border-4 border-background">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-2"
            >
              <h1 className="text-4xl font-bold mb-2">{member.name}</h1>
              <p className="text-xl text-accent mb-6">{member.nameEng}</p>

              <div className="space-y-4 mb-8">
                {/*
                <div className="flex items-center text-muted-foreground">
                  <GraduationCap className="w-5 h-5 mr-3 text-accent" />
                  <span>出身地を入れる</span>
                </div>
                 */}
              </div>

              <div className="prose prose-lg dark:prose-invert">
                <h3 className="text-2xl font-semibold mb-4 border-b pb-2">略歴</h3>
                <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-wrap">
                  {member.history || "略歴はまだありません。"}
                </p>
                <h3 className="text-2xl font-semibold mb-4 border-b pb-2">山行歴</h3>
                <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-wrap">
                  {member.log || "山行歴はまだありません。"}
                </p>

                {/* 追加のセクションがあればここに追加 */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MemberProfile;
