"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Ban, CheckCircle, Users, Mail, Calendar } from "lucide-react";
import { getAvatarEmoji } from "@/lib/avatar-presets";
import { ADMIN_EMAILS } from "@/lib/admin-config";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, "users");
      const q = query(usersRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const list = snapshot.docs
        .map((d) => ({
          uid: d.id,
          ...d.data(),
          createdAt: d.data().createdAt?.toDate(),
        }))
        // 管理者を除外（roleまたはメールアドレスで判定）
        .filter((u) => u.role !== "admin" && !ADMIN_EMAILS.includes(u.email));
      setUsers(list);
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (uid, currentBan) => {
    const action = currentBan ? "BAN解除" : "BAN";
    if (!window.confirm(`このユーザーを${action}しますか？`)) return;
    try {
      await updateDoc(doc(db, "users", uid), { isBanned: !currentBan });
      await fetchUsers();
    } catch (error) {
      console.error("BAN操作エラー:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredUsers = users.filter((u) => {
    if (filter === "banned" && !u.isBanned) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        u.nickname?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s) ||
        u.uid.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const bannedCount = users.filter((u) => u.isBanned).length;

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">ユーザー管理</h1>
        <p className="text-muted-foreground text-sm">
          登録ユーザーの管理、BAN操作を行えます
        </p>
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{users.length}</p>
              <p className="text-xs text-muted-foreground">登録ユーザー</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Ban className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">{bannedCount}</p>
              <p className="text-xs text-muted-foreground">BANユーザー</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 検索・フィルター */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ニックネーム、メール、UIDで検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          すべて
        </Button>
        <Button
          variant={filter === "banned" ? "destructive" : "outline"}
          size="sm"
          onClick={() => setFilter("banned")}
        >
          BAN済み
        </Button>
      </div>

      {/* ユーザーテーブル */}
      {loading ? (
        <p className="text-muted-foreground text-sm text-center py-8">読み込み中...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">ユーザーが見つかりません</p>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">ユーザー</TableHead>
                <TableHead>メールアドレス</TableHead>
                <TableHead className="w-[120px]">登録日</TableHead>
                <TableHead className="w-[80px]">状態</TableHead>
                <TableHead className="w-[100px] text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.uid} className={u.isBanned ? "bg-destructive/5" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{getAvatarEmoji(u.avatar)}</span>
                      <div>
                        <p className="font-medium text-sm">{u.nickname}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">
                          {u.uid.substring(0, 16)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {u.email || "-"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(u.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {u.isBanned ? (
                      <Badge variant="destructive" className="text-[10px]">BAN</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">有効</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={u.isBanned ? "outline" : "destructive"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => handleToggleBan(u.uid, u.isBanned)}
                    >
                      {u.isBanned ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          解除
                        </>
                      ) : (
                        <>
                          <Ban className="h-3 w-3 mr-1" />
                          BAN
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
