import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWPWcWQVsQ8aTzVfPYZ-ZXkiIe6U9nYRw",
  authDomain: "sansaionlinehp.firebaseapp.com",
  projectId: "sansaionlinehp",
  storageBucket: "sansaionlinehp.firebasestorage.app",
  messagingSenderId: "350956218051",
  appId: "1:350956218051:web:0d379eef421e173482e476",
  measurementId: "G-7PMT2ZY7FG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };
