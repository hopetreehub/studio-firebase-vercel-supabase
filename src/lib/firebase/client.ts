import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only if all required config is present
let app: any;
let auth: any;
let db: any;

if (firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain) {
  // Initialize Firebase
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  
  // Initialize Firebase Auth
  auth = getAuth(app);
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Connect to emulators in development
  if (process.env.NODE_ENV === 'development') {
    if (!auth.config.emulator) {
      try {
        connectAuthEmulator(auth, 'http://localhost:9099');
      } catch (error) {
        console.log('Auth emulator connection failed:', error);
      }
    }
    
    if (!(db as any)._delegate._databaseId.projectId.includes('demo-')) {
      try {
        connectFirestoreEmulator(db, 'localhost', 8080);
      } catch (error) {
        console.log('Firestore emulator connection failed:', error);
      }
    }
  }
} else {
  // Mock Firebase for build time
  app = null;
  auth = {
    currentUser: null,
    signInWithEmailAndPassword: () => Promise.resolve({ user: null }),
    createUserWithEmailAndPassword: () => Promise.resolve({ user: null }),
    signOut: () => Promise.resolve(),
    onAuthStateChanged: () => () => {},
  };
  db = {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
      }),
    }),
  };
}

export { auth, db };
export default app;