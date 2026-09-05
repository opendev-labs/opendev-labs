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

const apiKey = getEnv("API_KEY");
const firebaseConfig = {
    apiKey: apiKey,
    authDomain: getEnv("AUTH_DOMAIN") || "opendev-labs.firebaseapp.com",
    projectId: getEnv("PROJECT_ID") || "opendev-labs",
    storageBucket: getEnv("STORAGE_BUCKET") || "opendev-labs.appspot.com",
    messagingSenderId: getEnv("MESSAGING_SENDER_ID") || "",
    appId: getEnv("APP_ID") || "",
    measurementId: getEnv("MEASUREMENT_ID") || ""
};

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

// Only initialize Firebase if a valid API key is present, preventing startup crashes
if (apiKey && apiKey.length > 10) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    const dbId = getEnv("DATABASE_ID") || "opendev-labs-data";
    db = getFirestore(app, dbId);
    storage = getStorage(app);

    if (typeof window !== "undefined") {
      isSupported().then(supported => {
        if (supported && app) {
          getAnalytics(app);
        }
      });
    }
  } catch (e) {
    console.warn("Firebase safely bypassed due to invalid key:", e);
  }
}

export { app, auth, db, storage };
