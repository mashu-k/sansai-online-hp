"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push("/admin");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (user) {
    router.push("/admin");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[350px] sm:w-[400px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">管理者ログイン</CardTitle>
            <CardDescription>
              Googleアカウントでログインしてください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={handleLogin}
              size="lg"
            >
              Googleでログイン
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
