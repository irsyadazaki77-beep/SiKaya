import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import rawConfig from '../../firebase-applet-config.json';

let adminApp: App;

const rawProjectId = (rawConfig as any)?.projectId;
const projectId = process.env.FIREBASE_PROJECT_ID || (rawProjectId && !rawProjectId.includes('YOUR_FIREBASE_PROJECT_ID') ? rawProjectId : undefined);
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || rawConfig.storageBucket;
const firestoreDatabaseId = process.env.FIRESTORE_DATABASE_ID || (rawConfig as any).firestoreDatabaseId || '(default)';

if (!getApps().length) {
  adminApp = initializeApp({
    projectId: projectId || 'demo-project',
    storageBucket,
  });
} else {
  adminApp = getApps()[0]!;
}

export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = firestoreDatabaseId && firestoreDatabaseId !== '(default)'
  ? getFirestore(adminApp, firestoreDatabaseId)
  : getFirestore(adminApp);
