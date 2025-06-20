
import admin from 'firebase-admin';

// Check if the app is already initialized to prevent re-initialization
if (!admin.apps.length) {
  console.log('[Firebase Admin] Initializing SDK...');
  try {
    // Use applicationDefault() which works for both local development (via GOOGLE_APPLICATION_CREDENTIALS)
    // and Firebase/Google Cloud environments (like App Hosting) automatically.
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('[Firebase Admin] SDK Initialized Successfully.');
  } catch (error: any) {
    console.error(
      '[Firebase Admin CRITICAL ERROR] SDK failed to initialize. This is a fatal error and the application will not work correctly. ' +
      'Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set for local development, ' +
      'or that the service account has the correct permissions in a cloud environment. ' +
      'Error details:', error.message
    );
    // If initialization fails, subsequent calls to Firestore will fail, making the error visible.
  }
}

const firestore = admin.firestore();

export { admin, firestore };
