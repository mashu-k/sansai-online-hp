"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    const initAuth = async () => {
      const { app } = await import("@/lib/firebase-config");
      const { getAuth, onAuthStateChanged } = await import("firebase/auth");
      const auth = getAuth(app);
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
        setLoading(false);
      });
    };
    // TBT最適化: ブラウザがアイドルになってからAuth初期化
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
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { app } = await import("@/lib/firebase-config");
      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    const { app } = await import("@/lib/firebase-config");
    const { getAuth, signOut } = await import("firebase/auth");
    const auth = getAuth(app);
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
