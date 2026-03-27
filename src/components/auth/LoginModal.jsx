"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { logger } from "@/lib/logger";
import { avatarPresets } from "@/lib/avatar-presets";
import { Mail, ArrowLeft } from "lucide-react";

// ログイン → プロフィール設定を1つのモーダル内でシームレスに行う
const LoginModal = ({ open, onOpenChange }) => {
  const { user, isProfileComplete, signInWithGoogle, sendEmailLink, createProfile } = useAuth();
  const [step, setStep] = useState("login"); // "login" | "emailSent" | "profile"
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // プロフィール設定用
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("warabi");
  const [saving, setSaving] = useState(false);

  // ログイン成功後の遷移
  useEffect(() => {
    if (!open || !user) return;

    // 管理者はプロフィール設定不要 → 即閉じる
    if (isProfileComplete) {
      if (step === "login" || step === "profile") {
        onOpenChange(false);
      }
      return;
    }

    // 一般ユーザー: プロフィール未設定ならプロフィール設定ステップへ
    if (!isProfileComplete && step === "login") {
      setStep("profile");
    }
  }, [open, user, isProfileComplete, step, onOpenChange]);

  const handleGoogleLogin = async () => {
    try {
      setError("");
      await signInWithGoogle();
      // モーダルを閉じずに、useEffectでプロフィール設定ステップに遷移する
    } catch (err) {
      setError("ログインに失敗しました。もう一度お試しください。");
    }
  };

  const handleEmailLink = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      setError("");
      setSending(true);
      await sendEmailLink(email.trim());
      setStep("emailSent");
    } catch (err) {
      setError("メール送信に失敗しました。メールアドレスを確認してください。");
    } finally {
      setSending(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const trimmed = nickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setError("ニックネームは2〜20文字で入力してください。");
      return;
    }
    try {
      setError("");
      setSaving(true);
      await createProfile(trimmed, selectedAvatar);
      // useEffectでモーダルが閉じる
    } catch (err) {
      logger.error("プロフィール作成エラー:", err.code, err.message);
      setError(`プロフィールの作成に失敗しました: ${err.code || err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = (isOpen) => {
    if (!isOpen) {
      // リセット
      setStep("login");
      setEmail("");
      setError("");
      setNickname("");
      setSelectedAvatar("warabi");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {/* ステップ1: ログイン */}
        {step === "login" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">SANSAI ONLINE にログイン</DialogTitle>
              <DialogDescription>
                コメントやいいねをするにはログインが必要です
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Button className="w-full" size="lg" onClick={handleGoogleLogin}>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Googleでログイン
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">または</span>
                </div>
              </div>

              <form onSubmit={handleEmailLink} className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full"
                  disabled={sending || !email.trim()}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {sending ? "送信中..." : "ログインリンクを送信"}
                </Button>
              </form>

              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}

              <p className="text-xs text-muted-foreground text-center">
                ログインすることで、
                <a href="/terms" className="underline hover:text-foreground">利用規約</a>
                と
                <a href="/privacy" className="underline hover:text-foreground">プライバシーポリシー</a>
                に同意したものとみなされます。
              </p>
            </div>
          </>
        )}

        {/* ステップ1.5: メール送信完了 */}
        {step === "emailSent" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">メールを確認してください</DialogTitle>
            </DialogHeader>
            <div className="text-center py-4 space-y-3">
              <div className="text-4xl">{"\u{1F4E7}"}</div>
              <p className="font-medium">ログインリンクを送信しました</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{email}</span> に送信されたリンクをクリックしてログインしてください。
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setStep("login"); setEmail(""); }}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                別のメールアドレスで試す
              </Button>
            </div>
          </>
        )}

        {/* ステップ2: プロフィール設定 */}
        {step === "profile" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">プロフィール設定</DialogTitle>
              <DialogDescription>
                コメント時に表示されるニックネームとアイコンを設定してください。実名やメールアドレスは公開されません。
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nickname">ニックネーム</Label>
                <Input
                  id="nickname"
                  type="text"
                  placeholder="例: さんさい太郎"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  maxLength={20}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  2〜20文字。他のユーザーに公開されます。
                </p>
              </div>

              <div className="space-y-2">
                <Label>アイコン</Label>
                <div className="grid grid-cols-6 gap-2">
                  {avatarPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setSelectedAvatar(preset.id)}
                      className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedAvatar === preset.id
                          ? "border-accent bg-accent/10"
                          : "border-transparent hover:border-border"
                      }`}
                      title={preset.label}
                    >
                      <span className="text-2xl">{preset.emoji}</span>
                      <span className="text-[10px] text-muted-foreground mt-1 leading-tight">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={saving}>
                {saving ? "作成中..." : "プロフィールを作成"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
