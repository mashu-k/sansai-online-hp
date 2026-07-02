"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ADMIN_EMAILS } from "@/lib/admin-config";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Users,
  MessageCircle,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";

const sidebarItems = [
  { name: "ダッシュボード", path: "/admin", icon: LayoutDashboard, exact: true },
  { name: "ブログ管理", path: "/admin/posts", icon: FileText },
  { name: "コメント", path: "/admin/comments", icon: MessageCircle },
  { name: "アクセス解析", path: "/admin/analytics", icon: BarChart3 },
  { name: "LP解析", path: "/admin/lp", icon: ShoppingBag },
  { name: "ユーザー管理", path: "/admin/users", icon: Users },
];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  if (!user) return null;

  if (!ADMIN_EMAILS.includes(user.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold mb-2 text-destructive">アクセス権限がありません</h2>
            <p className="text-muted-foreground mb-4">
              ログイン中のアカウント ({user.email}) は管理者として登録されていません。
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isActive = (item) => {
    if (item.exact) return pathname === item.path;
    return pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="flex">
        {/* サイドバー */}
        <aside className="w-60 border-r border-border/50 min-h-[calc(100vh-4rem)] bg-card/30 flex-shrink-0 hidden md:block">
          <div className="p-4">
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-accent/10 text-accent font-medium"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    {item.name}
                    {active && <ChevronRight className="h-3 w-3 ml-auto" />}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* モバイル用タブナビ */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border/50 px-2 py-1.5">
          <nav className="flex justify-around">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded text-[10px] transition-colors ${
                    active ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* メインコンテンツ */}
        <main className="flex-1 min-w-0 pb-20 md:pb-0">
          {children}
        </main>
      </div>
    </div>
  );
}
