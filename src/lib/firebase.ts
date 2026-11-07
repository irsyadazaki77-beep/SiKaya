import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';

const firebaseConfig = {
  ...rawConfig,
  apiKey: import.meta.env?.VITE_FIREBASE_API_KEY || rawConfig.apiKey,
  projectId: import.meta.env?.VITE_FIREBASE_PROJECT_ID || rawConfig.projectId,
  authDomain: import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN || rawConfig.authDomain,
  storageBucket: import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET || rawConfig.storageBucket,
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || rawConfig.messagingSenderId,
  appId: import.meta.env?.VITE_FIREBASE_APP_ID || rawConfig.appId,
  firestoreDatabaseId: import.meta.env?.VITE_FIRESTORE_DATABASE_ID || (rawConfig as any).firestoreDatabaseId || '(default)'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
