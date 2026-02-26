import { app } from "./firebase-config";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const db = getFirestore(app);
export const storage = getStorage(app);
