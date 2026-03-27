"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getAvatarEmoji } from "@/lib/avatar-presets";
import { avatarPresets } from "@/lib/avatar-presets";
import { ADMIN_EMAILS } from "@/lib/admin-config";
import LoginModal from "./LoginModal";

const UserMenu = () => {
  const { user, loading, userProfile, isProfileComplete, logout, updateProfile } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // プロフィール編集用
  const [editNickname, setEditNickname] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  // アカウント削除用
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <>
        <Button variant="ghost" size="sm" onClick={() => setLoginOpen(true)}>
          <User className="h-4 w-4 mr-1" />
          ログイン
        </Button>
        <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      </>
    );
  }

  if (!isProfileComplete) {
    return (
      <>
        <Button variant="ghost" size="sm" onClick={() => setLoginOpen(true)}>
          プロフィール設定
        </Button>
        <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
      </>
    );
  }

  const isAdminUser = ADMIN_EMAILS.includes(user.email);

  const handleEditOpen = () => {
    setEditNickname(userProfile?.nickname || "");
    setEditAvatar(userProfile?.avatar || "warabi");
    setEditError("");
    setEditOpen(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    const trimmed = editNickname.trim();
    if (trimmed.length < 2 || trimmed.length > 20) {
      setEditError("ニックネームは2〜20文字で入力してください。");
      return;
    }
    try {
      setEditSaving(true);
      setEditError("");
      await updateProfile(trimmed, editAvatar);
      setEditOpen(false);
    } catch (err) {
      console.error("プロフィール更新エラー:", err);
      setEditError("更新に失敗しました。もう一度お試しください。");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    try {
      setDeleting(true);
      // Firestoreのユーザーデータを削除
      const { doc, deleteDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      // 公開プロフィール削除
      await deleteDoc(doc(db, "users", user.uid));
      // 非公開プロフィール削除
      try {
        await deleteDoc(doc(db, "users", user.uid, "private", "profile"));
      } catch {}
      // Firebase Authのユーザーアカウント削除
      const { getAuth, deleteUser } = await import("firebase/auth");
      const auth = getAuth();
      await deleteUser(auth.currentUser);
      setDeleteOpen(false);
    } catch (err) {
      console.error("アカウント削除エラー:", err);
      // 再認証が必要な場合
      if (err.code === "auth/requires-recent-login") {
        alert("セキュリティのため、再度ログインしてからアカウント削除を行ってください。");
        await logout();
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5">
            {isAdminUser && user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-6 h-6 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-lg leading-none">
                {getAvatarEmoji(userProfile?.avatar)}
              </span>
            )}
            <span className="text-sm max-w-[120px] truncate hidden sm:inline">
              {isAdminUser ? (user.displayName || "Admin") : userProfile?.nickname}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* ユーザー情報ヘッダー */}
          <div className="px-3 py-2">
            <div className="flex items-center gap-2">
              {isAdminUser && user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-2xl">{getAvatarEmoji(userProfile?.avatar)}</span>
              )}
              <div>
                <p className="text-sm font-medium">
                  {isAdminUser ? (user.displayName || "Admin") : userProfile?.nickname}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          {/* プロフィール編集（一般ユーザーのみ） */}
          {!isAdminUser && (
            <DropdownMenuItem onClick={handleEditOpen} className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              プロフィール編集
            </DropdownMenuItem>
          )}
          {!isAdminUser && <DropdownMenuSeparator />}
          {/* ログアウト */}
          <DropdownMenuItem onClick={logout} className="cursor-pointer">
            <LogOut className="h-4 w-4 mr-2" />
            ログアウト
          </DropdownMenuItem>
          {/* アカウント削除（一般ユーザーのみ） */}
          {!isAdminUser && (
            <DropdownMenuItem
              onClick={() => { setDeleteConfirm(""); setDeleteOpen(true); }}
              className="text-destructive cursor-pointer focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              アカウント削除
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* プロフィール編集モーダル */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>プロフィール編集</DialogTitle>
            <DialogDescription>
              ニックネームとアイコンを変更できます。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSave} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="edit-nickname">ニックネーム</Label>
              <Input
                id="edit-nickname"
                type="text"
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
                maxLength={20}
                required
              />
              <p className="text-xs text-muted-foreground">2〜20文字</p>
            </div>
            <div className="space-y-2">
              <Label>アイコン</Label>
              <div className="grid grid-cols-6 gap-2">
                {avatarPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setEditAvatar(preset.id)}
                    className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all hover:scale-105 ${
                      editAvatar === preset.id
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
            {editError && <p className="text-sm text-destructive">{editError}</p>}
            <Button type="submit" className="w-full" disabled={editSaving}>
              {editSaving ? "保存中..." : "保存"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* アカウント削除確認モーダル */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive">アカウント削除</DialogTitle>
            <DialogDescription>
              この操作は取り消せません。アカウントとプロフィール情報が完全に削除されます。
              過去のコメントはニックネーム表示のまま残ります。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delete-confirm">
                確認のため「DELETE」と入力してください
              </Label>
              <Input
                id="delete-confirm"
                type="text"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                disabled={deleteConfirm !== "DELETE" || deleting}
                onClick={handleDeleteAccount}
              >
                {deleting ? "削除中..." : "アカウントを削除"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserMenu;
