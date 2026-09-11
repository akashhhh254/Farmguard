// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyA-as3P2EcMnX136xfe0Pj_i_gHSngCTn8",
  authDomain: "farmguard-5009e.firebaseapp.com",
  projectId: "farmguard-5009e",
  storageBucket: "farmguard-5009e.firebasestorage.app",
  messagingSenderId: "881244480410",
  appId: "1:881244480410:web:8040c72018b6b044d71023",
  measurementId: "G-9MN0DGZJ5S"
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
