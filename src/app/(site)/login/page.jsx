import Login from "@/components/pages/Login";

export const metadata = {
  title: "ログイン",
  description: "山菜採りオンライン 管理者ログインページ。",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <Login />;
}
