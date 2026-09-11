// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseAppletConfig from "../firebase-applet-config.json";

// Dynamic configuration prioritizing env variables then firebase-applet-config.json
const env = (import.meta as any).env || {};
export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey || "",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain || "",
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId || "",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket || "",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId || "",
  appId: env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId || "",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || firebaseAppletConfig.measurementId || ""
};

// Initialize Firebase safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics if supported in the current environment
export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics fallback in restricted environments
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
