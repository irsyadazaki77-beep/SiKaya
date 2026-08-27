import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

let adminApp: App;

if (!getApps().length) {
  const projectId = process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId;
  adminApp = initializeApp({
    projectId,
    storageBucket: firebaseConfig.storageBucket,
  });
} else {
  adminApp = getApps()[0]!;
}

export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(adminApp, (firebaseConfig as any).firestoreDatabaseId) 
  : getFirestore(adminApp);
