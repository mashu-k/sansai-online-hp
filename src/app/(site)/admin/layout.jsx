"use client";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

// 管理者のメールアドレスリスト
// TODO: ここにご自身のメールアドレスを追加してください
const ADMIN_EMAILS = [
  "admin@example.com", // プレースホルダー
  "sansaitorionline@gmail.com"
];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // redirecting
  }

  if (!ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-2 text-destructive">アクセス権限がありません</h2>
            <p className="text-muted-foreground mb-4">
              ログイン中のアカウント ({user.email}) は管理者として登録されていません。
            </p>
            <div className="text-sm bg-muted p-3 rounded text-left overflow-auto">
              <p className="font-semibold mb-1">開発者の方へ:</p>
              <p>
                <code>src/app/(site)/admin/layout.jsx</code> の <code>ADMIN_EMAILS</code> 配列にこのメールアドレスを追加してください。
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
