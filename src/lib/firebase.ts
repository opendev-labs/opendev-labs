import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Helper to resolve env vars across environments (Vite/Node)
const getEnv = (key: string): string => {
  // @ts-ignore
  const metaEnv = typeof import.meta !== 'undefined' ? import.meta.env : null;
  if (metaEnv) {
    return metaEnv[`VITE_FIREBASE_${key}`] || metaEnv[`NEXT_PUBLIC_FIREBASE_${key}`] || '';
  }
  return (typeof process !== 'undefined' ? (process.env[`VITE_FIREBASE_${key}`] || process.env[`NEXT_PUBLIC_FIREBASE_${key}`] || process.env[`FIREBASE_${key}`]) : '') || '';
};

const firebaseConfig = {
    apiKey: getEnv("API_KEY"),
    authDomain: getEnv("AUTH_DOMAIN"),
    projectId: getEnv("PROJECT_ID"),
    storageBucket: getEnv("STORAGE_BUCKET"),
    messagingSenderId: getEnv("MESSAGING_SENDER_ID"),
    appId: getEnv("APP_ID"),
    measurementId: getEnv("MEASUREMENT_ID")
};

// Initialize Firebase only if it hasn't been initialized yet
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const dbId = getEnv("DATABASE_ID") || "opendev-labs-data";
const db = getFirestore(app, dbId);
const storage = getStorage(app);

// Initialize Analytics only in the browser
if (typeof window !== "undefined") {
  isSupported().then(supported => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export { app, auth, db, storage };
