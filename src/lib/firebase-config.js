import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAWPWcWQVsQ8aTzVfPYZ-ZXkiIe6U9nYRw",
  authDomain: "sansaionlinehp.firebaseapp.com",
  projectId: "sansaionlinehp",
  storageBucket: "sansaionlinehp.firebasestorage.app",
  messagingSenderId: "350956218051",
  appId: "1:350956218051:web:0d379eef421e173482e476",
  measurementId: "G-7PMT2ZY7FG",
};

// 既に初期化済みなら再利用
export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
