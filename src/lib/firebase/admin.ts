import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY 
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

let app: any;
let adminAuth: any;
let adminDb: any;
let firestore: any;

if (serviceAccount && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  app = getApps().length === 0 
    ? initializeApp({
        credential: cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
    : getApps()[0];

  adminAuth = getAuth(app);
  adminDb = getFirestore(app);
  firestore = adminDb; // Alias for compatibility
} else {
  // Mock Firebase Admin for build time
  app = null;
  adminAuth = {
    getUser: () => Promise.resolve({ uid: 'mock', email: 'mock@example.com' }),
    listUsers: () => Promise.resolve({ users: [] }),
    setCustomUserClaims: () => Promise.resolve(),
  };
  adminDb = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
      }),
    }),
  };
  firestore = adminDb;
}

export { adminAuth, adminDb, firestore };
export default app;