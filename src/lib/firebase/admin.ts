
import admin from 'firebase-admin';

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_ID) {
    // This case is for environments like Firebase App Hosting / Cloud Functions
    // where GOOGLE_APPLICATION_CREDENTIALS might not be set explicitly,
    // but service account identity is available.
    admin.initializeApp();
    console.log('[Firebase Admin] Initialized for Firebase-managed environment.');
    try {
        const projectId = admin.projectManagement()?.appMetadata?.projectId || 'UNKNOWN (could not fetch project ID)';
        console.log('[Firebase Admin] Project ID:', projectId);
    } catch (e) {
        console.warn('[Firebase Admin] Could not retrieve project ID in Firebase-managed environment.', e);
    }
  } else {
    // For local development or environments where service account JSON is used
    // GOOGLE_APPLICATION_CREDENTIALS environment variable should point to the service account key file
    console.log('[Firebase Admin] Attempting to initialize using Application Default Credentials (GOOGLE_APPLICATION_CREDENTIALS).');
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      console.log('[Firebase Admin] Successfully initialized using Application Default Credentials.');
      try {
        const projectId = admin.projectManagement()?.appMetadata?.projectId || 'UNKNOWN (could not fetch project ID)';
        console.log('[Firebase Admin] Project ID from ADC:', projectId);
      } catch (projectError: any) {
        console.warn('[Firebase Admin] Could not retrieve project ID after ADC initialization, this might indicate issues with the service account permissions or the key itself:', projectError.message);
      }
    } catch (error: any) {
      console.error(
        '[Firebase Admin CRITICAL ERROR] Initialization failed using Application Default Credentials. ' +
        'Please ensure the GOOGLE_APPLICATION_CREDENTIALS environment variable is correctly set and points to a valid service account key JSON file. ' +
        'The service account also needs appropriate permissions for Firestore (e.g., Cloud Datastore User or Firebase Admin). ' +
        'Error details:', error.message
      );
      // If initialization fails, subsequent Firestore operations will also fail.
    }
  }
} else {
    console.log('[Firebase Admin] SDK already initialized. Using existing app.');
     try {
        const projectId = admin.projectManagement()?.appMetadata?.projectId || 'UNKNOWN (could not fetch project ID)';
        console.log('[Firebase Admin] Existing Project ID:', projectId);
    } catch (e) {
        console.warn('[Firebase Admin] Could not retrieve project ID from existing app instance.', e);
    }
}

const firestore = admin.firestore();
export { firestore, admin };
