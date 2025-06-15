
import admin from 'firebase-admin';

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_ID) {
    // This case is for environments like Firebase App Hosting / Cloud Functions
    // where GOOGLE_APPLICATION_CREDENTIALS might not be set explicitly,
    // but service account identity is available.
    admin.initializeApp();
  } else {
    // For local development or environments where service account JSON is used
    // GOOGLE_APPLICATION_CREDENTIALS environment variable should point to the service account key file
    // or the service account key details are provided directly.
    // Ensure GOOGLE_APPLICATION_CREDENTIALS is set in your .env.local for local dev.
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    } catch (error: any) {
      // A common error if GOOGLE_APPLICATION_CREDENTIALS is not set or invalid.
      console.error('Firebase Admin SDK initialization error. Ensure GOOGLE_APPLICATION_CREDENTIALS is set correctly for local development.', error.message);
      // If trying to use specific service account JSON values directly (less common for Next.js backend):
      // if (process.env.FIREBASE_PRIVATE_KEY) {
      //   admin.initializeApp({
      //     credential: admin.credential.cert({
      //       projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      //       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      //       privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      //     }),
      //   });
      // }
    }
  }
}

const firestore = admin.firestore();
export { firestore, admin };
