"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { logger } from "@/lib/logger";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Firestoreから公開プロフィールを取得
  const fetchUserProfile = useCallback(async (uid) => {
    try {
      setProfileLoading(true);
      const { doc, getDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const snap = await getDoc(doc(db, "users", uid));
      if (snap.exists()) {
        setUserProfile({ uid, ...snap.data() });
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      logger.error("プロフィール取得エラー:", error);
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // 管理者の自動プロフィール作成
  const autoCreateAdminProfile = useCallback(async (firebaseUser) => {
    try {
      const { doc, getDoc, setDoc, serverTimestamp } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");
      const { ADMIN_EMAILS } = await import("@/lib/admin-config");

      if (!ADMIN_EMAILS.includes(firebaseUser.email)) return false;

      const userRef = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(userRef);

      const adminData = {
        nickname: firebaseUser.displayName || "Admin",
        avatar: "admin",
        role: "admin",
        isBanned: false,
        email: firebaseUser.email || "",
        googlePhotoURL: firebaseUser.photoURL || "",
      };

      if (snap.exists()) {
        // 既存でもGoogle名に常に同期（roleやisBannedは変更しない＝セキュリティルールに抵触しない）
        const { updateDoc } = await import("firebase/firestore");
        await updateDoc(userRef, {
          nickname: firebaseUser.displayName || "Admin",
          avatar: "admin",
          email: firebaseUser.email || "",
          googlePhotoURL: firebaseUser.photoURL || "",
        });
      } else {
        await setDoc(userRef, { ...adminData, createdAt: serverTimestamp() });
      }

      return true;
    } catch (error) {
      logger.error("管理者プロフィール自動作成エラー:", error);
      return false;
    }
  }, []);

  useEffect(() => {
    let unsubscribe;
    const initAuth = async () => {
      try {
        const { app } = await import("@/lib/firebase-config");
        const { getAuth, onAuthStateChanged, isSignInWithEmailLink, signInWithEmailLink } = await import("firebase/auth");
        const auth = getAuth(app);

        // メールリンク認証の復帰処理
        if (isSignInWithEmailLink(auth, window.location.href)) {
          const email = window.localStorage.getItem("emailForSignIn");
          if (email) {
            try {
              await signInWithEmailLink(auth, email, window.location.href);
              window.localStorage.removeItem("emailForSignIn");
            } catch (error) {
              // リンクが既に使用済み・期限切れの場合はエラーを無視
              // （ユーザーが既にログイン済みならonAuthStateChangedで処理される）
              if (error.code !== "auth/invalid-action-code") {
                logger.warn("メールリンク認証エラー:", error.code);
              }
              window.localStorage.removeItem("emailForSignIn");
            }
          }
          // URLからメールリンクパラメータを除去（成功・失敗に関わらず）
          window.history.replaceState(null, "", window.location.pathname);
        }

        unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);
          if (firebaseUser) {
            try {
              // 管理者なら自動プロフィール作成
              await autoCreateAdminProfile(firebaseUser);
            } catch {
              // 管理者プロフィール作成失敗は致命的ではない
            }
            fetchUserProfile(firebaseUser.uid);
          } else {
            setUserProfile(null);
          }
        });
      } catch (error) {
        logger.warn("Auth初期化エラー:", error);
        setLoading(false);
      }
    };

    let cancelId;
    if ("requestIdleCallback" in window) {
      cancelId = requestIdleCallback(() => initAuth(), { timeout: 3000 });
    } else {
      cancelId = setTimeout(() => initAuth(), 100);
    }
    return () => {
      if ("cancelIdleCallback" in window) cancelIdleCallback(cancelId);
      else clearTimeout(cancelId);
      unsubscribe?.();
    };
  }, [fetchUserProfile, autoCreateAdminProfile]);

  const signInWithGoogle = async () => {
    try {
      const { app } = await import("@/lib/firebase-config");
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      logger.error("Googleログインエラー:", error);
      throw error;
    }
  };

  const sendEmailLink = async (email) => {
    try {
      const { app } = await import("@/lib/firebase-config");
      const { getAuth, sendSignInLinkToEmail } = await import("firebase/auth");
      const auth = getAuth(app);
      const actionCodeSettings = {
        url: window.location.origin + window.location.pathname,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
    } catch (error) {
      logger.error("メールリンク送信エラー:", error);
      throw error;
    }
  };

  const logout = async () => {
    const { app } = await import("@/lib/firebase-config");
    const { getAuth, signOut } = await import("firebase/auth");
    const auth = getAuth(app);
    await signOut(auth);
    setUserProfile(null);
  };

  // 初回プロフィール設定が完了しているか
  const isProfileComplete = !!userProfile?.nickname;

  // 一般ユーザーのプロフィールを作成
  const createProfile = async (nickname, avatar) => {
    if (!user) throw new Error("ログインが必要です");
    const { doc, setDoc, serverTimestamp } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    // 公開プロフィール（メールアドレスも管理用に保存）
    await setDoc(doc(db, "users", user.uid), {
      nickname,
      avatar,
      createdAt: serverTimestamp(),
      role: "user",
      isBanned: false,
      email: user.email || "",
    });

    // 非公開プロフィール
    await setDoc(doc(db, "users", user.uid, "private", "profile"), {
      email: user.email || "",
      googleDisplayName: user.displayName || "",
      googlePhotoURL: user.photoURL || "",
      authProvider: user.providerData[0]?.providerId === "google.com" ? "google" : "emailLink",
      lastLoginAt: serverTimestamp(),
    });

    await fetchUserProfile(user.uid);
  };

  // プロフィールを更新
  const updateProfile = async (nickname, avatar) => {
    if (!user) throw new Error("ログインが必要です");
    const { doc, updateDoc } = await import("firebase/firestore");
    const { db } = await import("@/lib/firebase");

    await updateDoc(doc(db, "users", user.uid), { nickname, avatar });
    await fetchUserProfile(user.uid);
  };

  const value = {
    user,
    loading,
    userProfile,
    profileLoading,
    isProfileComplete,
    signInWithGoogle,
    sendEmailLink,
    logout,
    createProfile,
    updateProfile,
    refreshProfile: () => user && fetchUserProfile(user.uid),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
