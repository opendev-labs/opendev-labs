/**
 * Firebase Admin SDK — server-only
 * Uses service account credentials to bypass ALL Firestore security rules.
 * Never import this in client components.
 */
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

let adminApp: App;

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  let credJson;
  if (process.env.FIREBASE_ADMIN_CREDENTIALS_BASE64) {
    credJson = Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIALS_BASE64, 'base64').toString('utf8');
  } else {
    credJson = process.env.FIREBASE_ADMIN_CREDENTIALS_JSON || process.env.GOOGLE_CREDENTIALS_JSON;
  }
  
  if (!credJson) {
    throw new Error("FIREBASE_ADMIN_CREDENTIALS_BASE64 or GOOGLE_CREDENTIALS_JSON env variable is not set");
  }

  const cred = JSON.parse(credJson);

  adminApp = initializeApp({
    credential: cert({
      projectId: cred.project_id,
      clientEmail: cred.client_email,
      privateKey: cred.private_key,
    }),
    projectId: cred.project_id,
  });

  return adminApp;
}

export function getAdminDb() {
  const app = getAdminApp();
  const dbId = process.env.VITE_FIREBASE_DATABASE_ID || process.env.FIREBASE_DATABASE_ID || "opendev-labs-data";
  return getFirestore(app, dbId);
}
