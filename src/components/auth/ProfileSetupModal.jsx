"use client";
import React, { useState } from "react";
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
import { avatarPresets } from "@/lib/avatar-presets";

const ProfileSetupModal = ({ open, onOpenChange }) => {
  const { createProfile } = useAuth();
  const [nickname, setNickname] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("warabi");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
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
      onOpenChange(false);
    } catch (err) {
      console.error("プロフィール作成エラー:", err);
      setError("プロフィールの作成に失敗しました。もう一度お試しください。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">プロフィール設定</DialogTitle>
          <DialogDescription>
            コメント時に表示されるニックネームとアイコンを設定してください。
            実名やメールアドレスは公開されません。
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ニックネーム */}
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

          {/* アイコン選択 */}
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
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSetupModal;
