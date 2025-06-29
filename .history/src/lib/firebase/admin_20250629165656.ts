
import admin from 'firebase-admin';
import { Firestore } from 'firebase-admin/firestore';

// Check if the app is already initialized to prevent re-initialization.
// This is important for Next.js's hot-reloading environment.
if (!admin.apps.length) {
  try {
    // Try to initialize with application default credentials
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (error) {
    console.warn('Failed to initialize Firebase Admin with application default credentials:', error);
    console.warn('Initializing with a minimal configuration for development mode.');
    
    // Initialize with minimal configuration for development
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'innerspell',
    });
  }
}

// Get the firestore instance
let firestore: FirebaseFirestore.Firestore;

try {
  firestore = admin.firestore();
} catch (error) {
  console.error('Failed to initialize Firestore:', error);
  // Create a mock firestore object that will be replaced by the fallback data in actions
  firestore = {} as FirebaseFirestore.Firestore;
}

export { admin, firestore };
